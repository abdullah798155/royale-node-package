# royale-tracker

A small Node library to fetch Clash Royale player data (cards and player stats).
It normalizes card counts/levels and works through the RoyaleAPI proxy so you can avoid direct Supercell IP restrictions when using the official developer token.

## Features

- Fetches player data and card collection via RoyaleAPI proxy.
- Normalizes card levels and counts into a consistent structure.
- Minimal, modern ESM API (Node ≥ 18).
- Type definitions included (`index.d.ts`) for TypeScript users.

## Requirements

- **Node.js v18 or newer** (uses native fetch).
- A **RoyaleAPI-compatible API token** (see below).
- Keep tokens server-side — do not expose your API token in client-side code.

## Install

From npm:
```bash
npm install royale-tracker
```

> **Note:** If you are developing locally, avoid leaving a folder named `royale-tracker` in parent directories of your project — npm may symlink to local folders instead of installing the registry package.

## Getting your API token

1. Create a Clash Royale developer key at the official site using the ip address from below step 2:  
   https://developer.clashroyale.com/#/

2. Use the RoyaleAPI proxy rules to create a key using thier ip adress listed in documentation:  
   https://docs.royaleapi.com/proxy.html

3. Dont forget to copy your player tag from the Clash Royale app (the tag often starts with `#` — the library will clean it for you).

## Usage

**Server-side (recommended)** — Next.js API routes, Express, server scripts, etc.
```javascript
import { fetchPlayerCards, fetchPlayerData } from "royale-tracker";

const tag = "YOUR_TAG";
const token = process.env.YOUR_API_TOKEN;

try {
  const { cards } = await fetchPlayerCards(tag, token);
  let player = await fetchPlayerData(tag,token)
  console.log(cards);
  console.log(player)
} catch (err) {
  console.error("Failed to fetch player cards:", err.message);
}
```

The `fetchPlayerData`function returns an object like:
```javascript
{
  playername: 'Blaze X',
  trophies: 9616,
  bestTrophies: 9646,
  clan: 'Dark Justice',
  wins: 4514,
  losses: 3907,
  tcw: 1645 //three crown wins
}
```

The `fetchPlayerCards`function returns an object like:
```javascript
{
  cards: [
    {
      name: "Mega Minion",
      type: "Rare",
      level: 13,
      count: 45,
      img: "https://..."
    },
    // ...
  ]
}
```



## TypeScript support

A `index.d.ts` type declaration is included. If you import in a TS project, TypeScript should pick up types automatically if the package is installed from npm.

## Security / Best practices

- **Never put your API token in client-side code.** Use server-side API routes or server processes to call `fetchPlayerCards`.
- **Rate limiting:** the API/proxy may return 429 — handle throttling responsibly.
- **Do not commit API tokens to version control.**

## Troubleshooting

### Module not found after install

- Ensure you've installed the package from npm (`npm install royale-tracker`) and that `node_modules/royale-tracker` exists.
- If you previously had a local folder or used `npm link`, remove local links: `npm unlink royale-tracker` and reinstall from the registry.

## Example Next.js usage (API route)
```javascript
// app/api/playercards/[tag]/route.js
import { NextResponse } from "next/server";
import { fetchPlayerCards } from "royale-tracker";

export async function GET(req, context) {
  const { params } = await context;
  const tag = params.tag;
  try {
    const result = await fetchPlayerCards(tag, process.env.RP_API_TOKEN);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
```
const BASE = "https://proxy.royaleapi.dev/v1";

function normalizeLevel(rarity, level) {
  switch (rarity?.toLowerCase()) {
    case "common": return level;
    case "rare": return level + 2;
    case "epic": return level + 5;
    case "legendary": return level + 8;
    case "champion": return level + 10;
    default: return level;
  }
}

/**
 * Fetches player details from Royale API
 * @param {string} tag - Player tag (e.g., J8GV8VLU9)
 * @param {string} apiToken - Your Royale API token
 * @returns {Promise<object>} Player details
 */
export async function fetchPlayerData(tag, apiToken) {
  if (!tag) throw new Error("Player tag is required");
  if (!apiToken) throw new Error("API token is required");

  const cleanTag = tag.toUpperCase().replace(/^#*/, "");

  // if (!/^[0289CGJLPQRUVY]+$/.test(cleanTag)) {
  //   throw new Error("Invalid player tag format");
  // }

  const url = `${BASE}/players/%23${encodeURIComponent(cleanTag)}`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      Accept: "application/json",
    },
  });

  const body = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    if(resp.status===404) throw new Error("No player found")
    else throw new Error(resp.status);
  }

  // Extract only the player details
  const playerDetails = {
    playername: body.name,
    trophies: body.trophies,
    bestTrophies: body.bestTrophies,
    clan: body.clan?.name,
    wins: body.wins,
    losses: body.losses,
    tcw: body.threeCrownWins,
  };

  return playerDetails;
}

/**
 * Fetches player cards from Royale API
 * @param {string} tag - Player tag
 * @param {string} apiToken - Your Royale API token
 * @returns {Promise<object>} Player cards data
 */
export async function fetchPlayerCards(tag, apiToken) {
  // First fetch player details (to get body.name etc.)
  const cleanTag = tag.toUpperCase().replace(/^#*/, "");
  const url = `${BASE}/players/%23${encodeURIComponent(cleanTag)}`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      Accept: "application/json",
    },
  });

  const body = await resp.json().catch(() => ({}));

   if (!resp.ok) {
    if(resp.status===404) throw new Error("No player found")
    else throw new Error(resp.status);
  }

  const cards = (body.cards || []).map((c) => ({
    name: c.name,
    type: c.rarity || c.type,
    level: normalizeLevel(c.rarity, c.level),
    count: c.count ?? c.amount,
    img: c.iconUrls?.medium,
  }));

  return { cards };
}

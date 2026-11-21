const DAY_MS = 24 * 60 * 60 * 1000;
const PROMPT = /\btype\s+["“'‘]([^\s"“”'‘’]{1,32})["”'’]/i;

export function whitelistWord(message) {
  if (!/whitelist/i.test(message)) return null;
  return message.match(PROMPT)?.[1] ?? null;
}

const incoming = (message) => message.direction === "In" || message.direction === 1;
const time = (stamp) => Date.parse(/Z|[+-]\d\d:\d\d$/.test(stamp) ? stamp : `${stamp}Z`);

export function pendingWord(messages, since) {
  const ordered = messages
    .map((message) => ({ ...message, at: time(message.timestamp) }))
    .sort((a, b) => a.at - b.at);
  const index = ordered.findLastIndex((message) => incoming(message) && whitelistWord(message.message));
  if (index === -1) return null;
  const prompt = ordered[index];
  if (prompt.at < since) return null;
  if (ordered.slice(index + 1).some((message) => !incoming(message))) return null;
  return whitelistWord(prompt.message);
}

async function connect(api) {
  if (!api) throw new Error("Turn on Admin access so the plugin can read your slskd settings");
  const response = await fetch(`${api.url}/settings`, { headers: { "X-Api-Key": api.key } });
  if (!response.ok) throw new Error(`Aurral answered ${response.status}`);
  const { url, apiKey, enabled } = (await response.json()).integrations?.slskd ?? {};
  if (!enabled || !url || !apiKey) {
    throw new Error("Connect slskd in Settings > Downloads first");
  }
  return async (path, init = {}) => {
    const reply = await fetch(`${url}/api/v0${path}`, {
      ...init,
      headers: { "X-API-Key": apiKey, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!reply.ok) throw new Error(`slskd answered ${reply.status} for ${path}`);
    const text = await reply.text();
    return text ? JSON.parse(text) : null;
  };
}

export default {
  async test({ api }) {
    const slskd = await connect(api);
    await slskd("/application");
    return { message: "Connected to slskd" };
  },

  async scheduled({ api }) {
    const slskd = await connect(api);
    const conversations = await slskd("/conversations");
    const since = Date.now() - DAY_MS;
    for (const { username } of conversations) {
      const path = `/conversations/${encodeURIComponent(username)}`;
      const word = pendingWord(await slskd(`${path}/messages`), since);
      if (!word) continue;
      await slskd(path, { method: "POST", body: JSON.stringify(word) });
      console.log(`Sent "${word}" to ${username}`);
    }
  },
};

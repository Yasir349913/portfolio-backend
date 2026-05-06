export function getOpenRouterKey() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY missing");
  }
  return process.env.OPENROUTER_API_KEY;
}

export const LIVE_BOARD_ORIGIN = "https://product-badge-board.vilento-belet.chatgpt.site";

export function isLoopbackRequest(request: Request) {
  try {
    const host = new URL(request.url).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
  } catch {
    return false;
  }
}

export async function mirrorLiveBoard(path: string) {
  const response = await fetch(`${LIVE_BOARD_ORIGIN}${path}`, { cache: "no-store" });
  if (!response.ok) return null;
  return response.json() as Promise<Record<string, unknown>>;
}

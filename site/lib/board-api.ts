import { LIVE_BOARD_ORIGIN } from "@/lib/live-board";

function usesLiveBoardApi() {
  if (typeof window === "undefined") return false;
  return !window.location.hostname.endsWith("chatgpt.site");
}

export function boardApiUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return usesLiveBoardApi() ? `${LIVE_BOARD_ORIGIN}${normalized}` : normalized;
}

export function boardFetch(path: string, init?: RequestInit) {
  return fetch(boardApiUrl(path), init);
}

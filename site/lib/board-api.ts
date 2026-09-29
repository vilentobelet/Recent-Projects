import { LIVE_BOARD_ORIGIN } from "@/lib/live-board";

function isVinextHost() {
  if (typeof window === "undefined") return true;
  const { hostname, port } = window.location;
  if (hostname.endsWith("chatgpt.site")) return true;
  const loopback = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
  return loopback && port === "5173";
}

export function boardApiUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return isVinextHost() ? normalized : `${LIVE_BOARD_ORIGIN}${normalized}`;
}

export function boardFetch(path: string, init?: RequestInit) {
  return fetch(boardApiUrl(path), init);
}

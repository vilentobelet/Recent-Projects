#!/usr/bin/env python3
"""Rasterize the sparkle favicon into PNG sizes."""

from __future__ import annotations

import math
import struct
import zlib
from pathlib import Path

PEACH = (232, 196, 168, 255)
BG = (60, 42, 32, 255)


def write_png(path: Path, width: int, height: int, pixels: list[tuple[int, int, int, int]]) -> None:
    raw = bytearray()
    for y in range(height):
        raw.append(0)
        start = y * width
        for x in range(width):
            raw.extend(pixels[start + x])

    def chunk(tag: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    path.write_bytes(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(bytes(raw), 9)) + chunk(b"IEND", b""))


def dist_to_segment(px: float, py: float, ax: float, ay: float, bx: float, by: float) -> float:
    abx, aby = bx - ax, by - ay
    length = abx * abx + aby * aby
    t = 0 if length == 0 else max(0, min(1, ((px - ax) * abx + (py - ay) * aby) / length))
    return math.hypot(px - (ax + t * abx), py - (ay + t * aby))


def sample(size: int, px: float, py: float) -> tuple[int, int, int, int]:
    cx = cy = size / 2
    outer = size * 0.38
    inner = size * 0.12
    stroke = size * 0.065
    verts = []
    for i in range(8):
        angle = -math.pi / 2 + i * math.pi / 4
        radius = outer if i % 2 == 0 else inner
        verts.append((cx + math.cos(angle) * radius, cy + math.sin(angle) * radius))
    nearest = min(
        dist_to_segment(px, py, verts[i][0], verts[i][1], verts[(i + 1) % 8][0], verts[(i + 1) % 8][1])
        for i in range(8)
    )
    return PEACH if nearest <= stroke else BG


def render(size: int) -> list[tuple[int, int, int, int]]:
    pixels: list[tuple[int, int, int, int]] = []
    for y in range(size):
        for x in range(size):
            acc = [0, 0, 0, 0]
            samples = 4
            for oy in range(samples):
                for ox in range(samples):
                    color = sample(size, x + (ox + 0.5) / samples, y + (oy + 0.5) / samples)
                    for i in range(4):
                        acc[i] += color[i]
            pixels.append(tuple(round(v / (samples * samples)) for v in acc))  # type: ignore[misc]
    return pixels


def main() -> None:
    public = Path(__file__).resolve().parents[1] / "public"
    write_png(public / "favicon-32.png", 32, 32, render(32))
    write_png(public / "apple-touch-icon.png", 180, 180, render(180))


if __name__ == "__main__":
    main()

"""Draw geometric avatar PNGs without external images or dependencies."""

from pathlib import Path
import struct
import zlib

ROOT = Path(__file__).resolve().parents[1]
NAMES = ("beanie", "blazer_woman", "blue", "confetti", "hoodie", "laughing", "man_looking_off", "sunshine", "woman_balcony", "man", "person")
PALETTES = ((232, 216, 249), (238, 215, 188), (210, 229, 238), (232, 216, 224))


def png_bytes(index: int) -> bytes:
    width, height = 240, 300
    background = PALETTES[index % len(PALETTES)]
    foreground = tuple(max(0, c - 65) for c in background)
    rows = []
    for y in range(height):
        row = bytearray([0])
        for x in range(width):
            head = (x - 120) ** 2 + (y - 105) ** 2 < 44 ** 2
            shoulders = ((x - 120) / 86) ** 2 + ((y - 278) / 103) ** 2 < 1
            row.extend(foreground if head or shoulders else background)
        rows.append(row)

    def chunk(kind: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)

    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(b"".join(rows))) + chunk(b"IEND", b"")


if __name__ == "__main__":
    target = ROOT / "frontend/assets/images"
    target.mkdir(parents=True, exist_ok=True)
    for i, name in enumerate(NAMES):
        (target / f"{name}.png").write_bytes(png_bytes(i))
    print(f"Generated {len(NAMES)} placeholder avatars.")

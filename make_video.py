"""Placeholder video generator — يُنشئ فيديو MP4 صغير (Vertical 9:16) في public/video.
يُحذف هذا الملف بعد الاستخدام."""
import os
import struct
import zlib

OUT_DIR = r"D:\omar-portfolio_1\public\video"
os.makedirs(OUT_DIR, exist_ok=True)

# --- 1) Poster PNG (خلفية داكنة بلون الموقع) ---
W, H = 360, 640
raw = b"".join(b"\x00" + bytes([15, 17, 21]) * W for _ in range(H))


def chunk(tag, data):
    return (
        struct.pack(">I", len(data))
        + tag
        + data
        + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    )


ihdr = struct.pack(">IIBBBBB", W, H, 8, 2, 0, 0, 0)
png = (
    b"\x89PNG\r\n\x1a\n"
    + chunk(b"IHDR", ihdr)
    + chunk(b"IDAT", zlib.compress(raw, 9))
    + chunk(b"IEND", b"")
)
with open(os.path.join(OUT_DIR, "poster.png"), "wb") as f:
    f.write(png)
print("poster ok")

# --- 2) فيديو MP4 placeholder ---
# نحاول imageio-ffmpeg إن وُجد، وإلا نكتب ملف README فقط.
try:
    import imageio_ffmpeg
    import subprocess

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    out = os.path.join(OUT_DIR, "experience-video.mp4")
    # فيديو 6 ثوانٍ: تدرّج داكن مع نص بسيط — Loop ناعم
    cmd = [
        ffmpeg, "-y",
        "-f", "lavfi",
        "-i", "color=c=0x0f1115:s=360x640:d=6:r=24",
        "-vf",
        "drawtext=text='Experience Video':fontcolor=0xc9b88a:fontsize=28:"
        "x=(w-text_w)/2:y=(h-text_h)/2",
        "-pix_fmt", "yuv420p",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "30",
        "-movflags", "+faststart",
        out,
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    print("video ok:", out)
except Exception as e:
    print("ffmpeg unavailable:", e)
    with open(os.path.join(OUT_DIR, "README.txt"), "w") as f:
        f.write("Place experience-video.mp4 here (vertical 9:16).\n")

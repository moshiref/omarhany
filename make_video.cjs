// Placeholder video generator — ينشئ MP4 صغير صالح (إطار واحد أسود) في public/video
// يُحذف هذا الملف بعد الاستخدام.
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "public", "video");
fs.mkdirSync(OUT_DIR, { recursive: true });

// --- Minimal valid MP4 (1-frame black video, H.264) ---
// ملف MP4 صغير جدًا (~1KB) يحتوي على ftyp + moov + mdat مع إطار أسود واحد.
// هذا يكفي ليعمل <video> بدون أخطاء، ويمكن استبداله بفيديو حقيقي لاحقًا.

function box(type, data) {
  const size = 8 + data.length;
  const buf = Buffer.alloc(size);
  buf.writeUInt32BE(size, 0);
  buf.write(type, 4, "ascii");
  data.copy(buf, 8);
  return buf;
}

function fullBox(type, version, flags, data) {
  const header = Buffer.alloc(4);
  header.writeUInt8(version, 0);
  header.writeUIntBE(flags, 1, 3);
  return box(type, Buffer.concat([header, data]));
}

// ftyp
const ftyp = box(
  "ftyp",
  Buffer.concat([
    Buffer.from("isom", "ascii"),
    Buffer.alloc(4, 0), // minor version
    Buffer.from("isomiso2avc1mp41", "ascii"),
  ])
);

// mdat — H.264 IDR frame (black 16x16 macroblock, minimal)
// SPS + PPS + IDR slice for a tiny black frame
const sps = Buffer.from([
  0x67, 0x42, 0x00, 0x0a, 0xf8, 0x41, 0xa2,
]);
const pps = Buffer.from([0x68, 0xce, 0x38, 0x80]);
const idr = Buffer.from([
  0x65, 0x88, 0x84, 0x00, 0x0f, 0xff, 0xfe, 0xf6, 0xf0,
]);

function nalu(data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  return Buffer.concat([len, data]);
}

const mdat = box("mdat", Buffer.concat([nalu(sps), nalu(pps), nalu(idr)]));

// moov
const mvhd = fullBox(
  "mvhd",
  0,
  0,
  Buffer.concat([
    Buffer.alloc(4, 0), // creation_time
    Buffer.alloc(4, 0), // modification_time
    Buffer.from([0, 0, 0x03, 0xe8]), // timescale = 1000
    Buffer.from([0, 0, 0x00, 0x28]), // duration = 40ms
    Buffer.from([0x00, 0x01, 0x00, 0x00]), // rate 1.0
    Buffer.from([0x01, 0x00]), // volume
    Buffer.alloc(10, 0), // reserved
    // matrix
    Buffer.from([0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x40, 0, 0, 0]),
    Buffer.alloc(24, 0), // pre_defined
    Buffer.from([0, 0, 0, 2]), // next_track_ID
  ])
);

const tkhd = fullBox(
  "tkhd",
  0,
  7,
  Buffer.concat([
    Buffer.alloc(4, 0), // creation_time
    Buffer.alloc(4, 0), // modification_time
    Buffer.from([0, 0, 0, 1]), // track_ID
    Buffer.alloc(4, 0), // reserved
    Buffer.from([0, 0, 0x00, 0x28]), // duration
    Buffer.alloc(8, 0), // reserved
    Buffer.from([0, 0]), // layer
    Buffer.from([0, 0]), // alternate_group
    Buffer.from([0, 0]), // volume
    Buffer.alloc(2, 0), // reserved
    Buffer.from([0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x40, 0, 0, 0]),
    Buffer.from([0x01, 0x68, 0, 0]), // width = 360
    Buffer.from([0x02, 0x80, 0, 0]), // height = 640
  ])
);

const mdhd = fullBox(
  "mdhd",
  0,
  0,
  Buffer.concat([
    Buffer.alloc(4, 0),
    Buffer.alloc(4, 0),
    Buffer.from([0, 0, 0x03, 0xe8]), // timescale
    Buffer.from([0, 0, 0x00, 0x28]), // duration
    Buffer.from([0x55, 0xc4]), // language (und)
    Buffer.alloc(2, 0),
  ])
);

const hdlr = fullBox(
  "hdlr",
  0,
  0,
  Buffer.concat([
    Buffer.alloc(4, 0), // pre_defined
    Buffer.from("vide", "ascii"), // handler_type
    Buffer.alloc(12, 0), // reserved
    Buffer.from("VideoHandler\0", "ascii"),
  ])
);

const avcC = box(
  "avcC",
  Buffer.concat([
    Buffer.from([1, 0x42, 0, 0x0a, 0xff, 0xe1]), // version, profile, compat, level, lengthSizeMinusOne=3, numSPS=1
    Buffer.from([0, sps.length]),
    sps,
    Buffer.from([1]), // numPPS
    Buffer.from([0, pps.length]),
    pps,
  ])
);

const avc1 = box(
  "avc1",
  Buffer.concat([
    Buffer.alloc(6, 0), // reserved
    Buffer.from([0, 1]), // data_reference_index
    Buffer.alloc(16, 0), // pre_defined + reserved
    Buffer.from([0x01, 0x68]), // width 360
    Buffer.from([0x02, 0x80]), // height 640
    Buffer.from([0x00, 0x48, 0, 0]), // horizresolution 72dpi
    Buffer.from([0x00, 0x48, 0, 0]), // vertresolution
    Buffer.alloc(4, 0), // reserved
    Buffer.from([0, 1]), // frame_count
    Buffer.alloc(32, 0), // compressorname
    Buffer.from([0, 0x18]), // depth
    Buffer.from([0xff, 0xff]), // pre_defined
    avcC,
  ])
);

const stsd = fullBox("stsd", 0, 0, Buffer.concat([Buffer.from([0, 0, 0, 1]), avc1]));
const stts = fullBox("stts", 0, 0, Buffer.concat([Buffer.from([0, 0, 0, 1]), Buffer.from([0, 0, 0, 1]), Buffer.from([0, 0, 0x03, 0xe8])]));
const stsc = fullBox("stsc", 0, 0, Buffer.concat([Buffer.from([0, 0, 0, 1]), Buffer.from([0, 0, 0, 1]), Buffer.from([0, 0, 0, 1]), Buffer.from([0, 0, 0, 1])]));
const stsz = fullBox("stsz", 0, 0, Buffer.concat([Buffer.alloc(4, 0), Buffer.from([0, 0, 0, 1]), Buffer.from([0, 0, 0, mdat.length - 8])]));
const stco = fullBox("stco", 0, 0, Buffer.concat([Buffer.from([0, 0, 0, 1]), Buffer.from([0, 0, 0, ftyp.length + 8])]));

const stbl = box("stbl", Buffer.concat([stsd, stts, stsc, stsz, stco]));
const minf = box(
  "minf",
  Buffer.concat([
    fullBox("vmhd", 0, 1, Buffer.alloc(8, 0)),
    box("dinf", fullBox("dref", 0, 0, Buffer.concat([Buffer.from([0, 0, 0, 1]), fullBox("url ", 0, 1, Buffer.alloc(0))]))),
    stbl,
  ])
);
const mdia = box("mdia", Buffer.concat([mdhd, hdlr, minf]));
const trak = box("trak", Buffer.concat([tkhd, mdia]));
const moov = box("moov", Buffer.concat([mvhd, trak]));

const mp4 = Buffer.concat([ftyp, moov, mdat]);
fs.writeFileSync(path.join(OUT_DIR, "experience-video.mp4"), mp4);
console.log("video ok:", path.join(OUT_DIR, "experience-video.mp4"), mp4.length, "bytes");

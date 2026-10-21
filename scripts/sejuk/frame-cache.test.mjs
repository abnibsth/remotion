import test from "node:test";
import assert from "node:assert/strict";
import { validFramePNG } from "./frame-cache.mjs";
test("frame cache rejects truncated files and wrong dimensions", () => {
  const bytes = Buffer.alloc(45);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(bytes);
  bytes.write("IHDR", 12);
  bytes.writeUInt32BE(1080, 16);
  bytes.writeUInt32BE(1920, 20);
  Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]).copy(bytes, 33);
  assert.equal(validFramePNG(bytes), true);
  assert.equal(validFramePNG(bytes.subarray(0, bytes.length - 1)), false);
  assert.equal(validFramePNG(bytes, 720, 1280), false);
  assert.equal(validFramePNG(Buffer.alloc(0)), false);
  const corrupt = Buffer.from(bytes);
  corrupt[0] = 0;
  assert.equal(validFramePNG(corrupt), false);
});

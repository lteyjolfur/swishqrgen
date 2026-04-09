import { createCanvas } from "canvas";
import fs from "fs";
import assert from "assert";
import { create_image_with_text, get_png_from_api } from "./index.js";
import sinon from "sinon";
import axios from "axios";

describe("Node.js QR Image Generation", function () {
  describe("Swish QR Node.js Logic", function () {
    it("should create an image with text using create_image_with_text", async function () {
      // Create a dummy PNG buffer
      const canvas = createCanvas(100, 100);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 100, 100);
      const pngBuffer = canvas.toBuffer();

      const outputPath = "./output_images/test_node_logic.png";
      await create_image_with_text(pngBuffer, "Hello", outputPath);
      assert(fs.existsSync(outputPath));
      fs.unlinkSync(outputPath);
    });
  });

  describe("get_png_from_api", function () {
    it("should return data from the API (mocked)", async function () {
      const fakeData = Buffer.from([1, 2, 3, 4]);
      const postStub = sinon.stub(axios, "post").resolves({ data: fakeData });
      const url = "https://example.com/api";
      const payload = { foo: "bar" };
      const result = await get_png_from_api(url, payload);
      assert.deepStrictEqual(result, fakeData);
      postStub.restore();
    });
  });
});

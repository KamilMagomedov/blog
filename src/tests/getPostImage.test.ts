import { getPostImage } from "../lib/getPostImages";

test("get default image when empty path", () => {
  expect(getPostImage()).toBe("/image_not_found.webp");
});

test("get path image", () => {
  expect(getPostImage("https://custom-path.png")).toBe(
    "https://custom-path.png",
  );
});

test("get path image with via", () => {
  expect(getPostImage("https://via-custom-path.png")).toBe(
    "/image_not_found.webp",
  );
});

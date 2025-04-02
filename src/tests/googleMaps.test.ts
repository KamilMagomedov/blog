import { getFullPath } from "../lib/googleMaps";

test("receive full path map url", () => {
  expect(getFullPath("my-custom-path")).toBe(
    "https://www.google.com/maps?q=my-custom-path",
  );
});

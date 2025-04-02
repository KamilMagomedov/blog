import { getPostQueryBuilder } from "../lib/builder";

test("test builder with empty parameters", () => {
  expect(getPostQueryBuilder().build()).toBe("page=1");
});

test("test builder with all parameters", () => {
  expect(
    getPostQueryBuilder()
      .setPage("1")
      .setSearch("hello")
      .setLimit(10)
      .setType("travel")
      .setCategory("10")
      .setTags("tag-1,tag-2")
      .setOrder("likes")
      .setDir("desc")
      .setArchive("2025-10")
      .build(),
  ).toBe(
    "page=1&search=hello&limit=10&type=travel&category=10&tags=tag-1%2Ctag-2&order=likes&dir=desc&archive=2025-10",
  );
});

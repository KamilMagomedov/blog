jest.mock("@/lib/db", () => ({
  sql: jest
    .fn()
    .mockResolvedValue([
      { published_at: "2026-08-18T12:00:00.000Z" },
      { published_at: "2026-08-10T12:00:00.000Z" },
      { published_at: "2026-07-20T12:00:00.000Z" },
    ]),
}));

import { getPostsCalendar } from "../lib/api";

test("get posts calendar data", async () => {
  const data = await getPostsCalendar();

  expect(data).toEqual([
    {
      year: "2026",
      months: [
        {
          month: "08",
          monthName: "August",
          total: 2,
        },
        {
          month: "07",
          monthName: "July",
          total: 1,
        },
      ],
    },
  ]);
});

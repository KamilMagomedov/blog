import { getPostsCalendar } from "../lib/api";

test("get posts calendar data", async () => {
  const data = await getPostsCalendar();
  console.log(data);
  expect(data).toMatchObject({
    year: expect.any(String),
    months: expect.arrayContaining([
      expect.objectContaining({
        month: expect.any(String),
        total: expect.any(Number),
        monthName: expect.any(String),
      }),
    ]),
  });
});

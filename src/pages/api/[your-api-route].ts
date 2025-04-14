import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "private, max-age=0, must-revalidate");
  res.status(200).json({ message: "Success" });
}

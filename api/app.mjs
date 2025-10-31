import express, { json } from "express";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3000;
import "dotenv/config";

import askRouter from "./routes/ask.mjs";

app.use(json());
app.use(cors());

app.use("/api/ask", askRouter);

app.listen(PORT, async () => {
  console.log("Server started");
});

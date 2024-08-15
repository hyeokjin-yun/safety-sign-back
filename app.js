import express, { urlencoded } from "express";
import cors from "cors";
import MemberRouter from "./router/MemberRouter.js";

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(cors());

app.use("/member", MemberRouter);

app.listen(8080, () => {
  console.log("Safety Sign 서버 실행중...");
});

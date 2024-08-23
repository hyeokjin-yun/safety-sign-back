import express, { urlencoded } from "express";
import cors from "cors";
import MemberRouter from "./router/MemberRouter.js";
import ServiceRouter from "./router/ServiceRouter.js";

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(cors());

app.use("/member", MemberRouter);
app.use("/service", ServiceRouter);

app.listen(443, () => {
  console.log("간판지킴이 서버 실행중...");
});

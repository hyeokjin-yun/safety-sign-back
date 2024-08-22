import * as repository from "../repository/MemberRepository.js";
import bcrypt from "bcryptjs";
import { generateJWT } from "../jwt.js";

export async function signUp(req, res) {
  const { phoneNumber, name, password } = req.body;

  const hashPassword = bcrypt.hashSync(password, 10);
  const formData = [phoneNumber, hashPassword, name];
  const result = await repository.signUp(formData);
  res.json(result);
}

export async function login(req, res) {
  const { phoneNumber, password } = req.body;

  try {
    const user = await repository.findUserByPhoneNumber(phoneNumber);

    if (!user) {
      return res.status(200).json({
        result: false,
        message: "휴대폰 번호 혹은 비밀번호가 일치하지 않습니다",
      });
    }

    const passwordMatch = bcrypt.compareSync(password, user.user_pwd);
    if (!passwordMatch) {
      return res.status(200).json({
        result: false,
        message: "휴대폰 번호 혹은 비밀번호가 일치하지 않습니다",
      });
    }

    const token = generateJWT(user.user_phone);
    res.status(200).json({ result: true, token });
  } catch (error) {
    console.error("서버 에러:", error);
    res.status(500).json({ result: false, message: "오류가 발생했습니다" });
  }
}

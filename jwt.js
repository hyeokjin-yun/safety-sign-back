import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

export function generateJWT(user) {
  return jwt.sign({ id: user.user_phone }, jwtSecretKey);
}

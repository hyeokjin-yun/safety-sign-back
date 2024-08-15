import { db } from "../db/Database.js";

export async function signUp(formData) {
  const sql =
    "INSERT INTO users (user_phone, user_pwd, user_name) VALUES (?, ?, ?)";
  try {
    const [result] = await db.execute(sql, formData);
    return "SignUp Complete";
  } catch (error) {
    console.error("Error during sign-up:", error.message);
    throw new Error("SignUp Failed");
  }
}

export async function findUserByPhoneNumber(phoneNumber) {
  const sql = "SELECT user_phone, user_pwd FROM users WHERE user_phone = ?";
  try {
    const [rows] = await db.execute(sql, [phoneNumber]);
    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    throw new Error("Login Failed");
  }
}

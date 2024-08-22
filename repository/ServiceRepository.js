import { db } from "../db/Database.js";

export async function serviceApply(formdata) {
  try {
    await db.query("START TRANSACTION");

    const userSql = `SELECT user_id FROM users WHERE user_phone = ?`;
    const [userResult] = await db.query(userSql, [formdata.user_phone]);

    if (userResult.length === 0) {
      throw new Error("User not found with the provided phone number");
    }

    const userId = userResult[0].user_id;

    const orderSql = `
      INSERT INTO orders (user_id, order_no, order_date, order_status, sign_category_id)
      VALUES (?, ?, NOW(), '서비스 신청 접수 중', ?)
    `;
    await db.query(orderSql, [
      userId,
      formdata.order_no,
      formdata.sign_category_id,
    ]);

    const orderDetailsSql = `
      INSERT INTO order_details (order_no, price)
      VALUES (?, ?)
    `;
    await db.query(orderDetailsSql, [formdata.order_no, formdata.price]);

    const constructionCompanySql = `
      INSERT INTO construction_company (order_no, construction_company_name, representative_name, business_license_no, representative_phone)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(constructionCompanySql, [
      formdata.order_no,
      formdata.construction_company_name,
      formdata.representative_name,
      formdata.business_license_no,
      formdata.representative_phone,
    ]);

    const administratorSql = `
      INSERT INTO administrator (order_no, administrator_name, administrator_phone, administrator_address, additional_info)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(administratorSql, [
      formdata.order_no,
      formdata.administrator_name,
      formdata.administrator_phone,
      formdata.administrator_address,
      formdata.additional_info,
    ]);

    const signSql = `
      INSERT INTO sign (order_no, display_period_start, display_period_end, construction_period_start, construction_period_end, sign_image_path, design_image_path, owner_consent_image_path, specification_image_path, installation_address, site_photo_path, installation_height, sign_width, sign_height, local_government)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(signSql, [
      formdata.order_no,
      formdata.display_period_start,
      formdata.display_period_end,
      formdata.construction_period_start,
      formdata.construction_period_end,
      formdata.sign_image_path,
      formdata.design_image_path,
      formdata.owner_consent_image_path,
      formdata.specification_image_path,
      formdata.installation_address,
      formdata.site_photo_path,
      formdata.installation_height,
      formdata.sign_width,
      formdata.sign_height,
      formdata.local_government,
    ]);

    await db.query("COMMIT");

    return true;
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error processing service application:", error);
    return false;
  }
}

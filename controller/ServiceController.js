import * as repository from "../repository/ServiceRepository.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import multer from "multer";
import AWS from "aws-sdk";

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
}).fields([
  { name: "sign_image", maxCount: 1 },
  { name: "design_image", maxCount: 1 },
  { name: "owner_consent_image", maxCount: 1 },
  { name: "specification_image", maxCount: 1 },
  { name: "site_photo", maxCount: 1 },
]);

export async function serviceApply(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const userPhone = decoded.id;

  upload(req, res, async function (err) {
    if (err) {
      console.error("Error uploading files:", err);
      return res.status(500).json({ error: "Error uploading files" });
    }

    try {
      const uploadFileToS3 = async (file, fileName) => {
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        const data = await s3.upload(params).promise();
        return data.Location;
      };

      const signImagePath = req.files.sign_image
        ? await uploadFileToS3(
            req.files.sign_image[0],
            `signs/${Date.now()}_${req.files.sign_image[0].originalname}`
          )
        : null;
      const designImagePath = req.files.design_image
        ? await uploadFileToS3(
            req.files.design_image[0],
            `designs/${Date.now()}_${req.files.design_image[0].originalname}`
          )
        : null;
      const ownerConsentImagePath = req.files.owner_consent_image
        ? await uploadFileToS3(
            req.files.owner_consent_image[0],
            `owner_consents/${Date.now()}_${
              req.files.owner_consent_image[0].originalname
            }`
          )
        : null;
      const specificationImagePath = req.files.specification_image
        ? await uploadFileToS3(
            req.files.specification_image[0],
            `specifications/${Date.now()}_${
              req.files.specification_image[0].originalname
            }`
          )
        : null;
      const sitePhotoPath = req.files.site_photo
        ? await uploadFileToS3(
            req.files.site_photo[0],
            `site_photos/${Date.now()}_${req.files.site_photo[0].originalname}`
          )
        : null;

      const signCategoryId = Number(req.body.sign_category_id);
      const installationHeight = parseFloat(req.body.installation_height);
      const signWidth = parseFloat(req.body.sign_width);
      const signHeight = parseFloat(req.body.sign_height);
      const orderNumber = Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 10)
      ).join("");

      const formData = {
        order_no: orderNumber,
        user_phone: userPhone,
        sign_category_id: signCategoryId,
        price: 0,
        construction_company_name: req.body.construction_company_name,
        representative_name: req.body.representative_name,
        business_license_no: req.body.business_license_no,
        representative_phone: req.body.representative_phone,
        administrator_name: req.body.administrator_name,
        administrator_phone: req.body.administrator_phone,
        administrator_address: req.body.administrator_address,
        additional_info: req.body.additional_info,
        display_period_start: req.body.display_period_start,
        display_period_end: req.body.display_period_end,
        construction_period_start: req.body.construction_period_start,
        construction_period_end: req.body.construction_period_end,
        sign_image_path: signImagePath,
        design_image_path: designImagePath,
        owner_consent_image_path: ownerConsentImagePath,
        specification_image_path: specificationImagePath,
        installation_address: req.body.installation_address,
        site_photo_path: sitePhotoPath,
        installation_height: installationHeight,
        sign_width: signWidth,
        sign_height: signHeight,
        local_government: req.body.local_government,
      };

      const success = await repository.serviceApply(formData);

      if (success) {
        res
          .status(200)
          .json({ message: "Data received and processed successfully" });
      } else {
        res
          .status(500)
          .json({ error: "Failed to process service application" });
      }
    } catch (error) {
      console.error("Error processing service application:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

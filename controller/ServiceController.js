import * as repository from "../repository/ServiceRepository.js";
import multer from "multer";

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
  upload(req, res, function (err) {
    if (err) {
      console.error("Error uploading files:", err);
      return res.status(500).json({ error: "Error uploading files" });
    }

    try {
      console.log("Body:", req.body);
      console.log("Files:", req.files);

      // 여기에 파일을 S3에 업로드하거나 다른 처리를 수행하는 로직을 추가할 수 있습니다.

      res.status(200).json({ message: "Data received successfully" });
    } catch (error) {
      console.error("Error processing service application:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

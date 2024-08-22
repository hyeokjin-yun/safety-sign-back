import * as repository from "../repository/ServiceRepository.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export async function serviceApply(req, res) {
  upload.fields([
    { name: "sign_image", maxCount: 1 },
    { name: "design_image", maxCount: 1 },
    { name: "owner_consent_image", maxCount: 1 },
    { name: "specification_image", maxCount: 1 },
    { name: "site_photo", maxCount: 1 },
  ]),
    async (req, res) => {
      try {
        console.log("Body:", req.body);
        console.log("Files:", req.files);

        // 예를 들어, 파일을 S3에 업로드하거나 다른 곳에 저장하는 로직을 추가할 수 있습니다.

        res.status(200).json({ message: "Data received successfully" });
      } catch (error) {
        console.error("Error processing service application:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    };
}

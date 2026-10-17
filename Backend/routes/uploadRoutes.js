const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() || ".png";
    const cleanExt = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(ext) ? ext : ".png";
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "upload-" + uniqueSuffix + cleanExt);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow common image mime types
  if (file.mimetype.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPG, PNG, WEBP, GIF, SVG) are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max limit
  fileFilter: fileFilter
});

// Single image file upload (accepts field name 'image' or 'file')
router.post("/", (req, res) => {
  const uploadSingle = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 }
  ]);

  uploadSingle(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }

    const uploadedFile = (req.files && (req.files.image?.[0] || req.files.file?.[0])) || req.file;
    if (!uploadedFile) {
      return res.status(400).json({ success: false, message: "No file uploaded. Please choose an image from your computer." });
    }

    const fileUrl = `/uploads/${uploadedFile.filename}`;
    return res.json({
      success: true,
      message: "Image uploaded successfully from local drive!",
      url: fileUrl,
      filename: uploadedFile.filename,
      size: uploadedFile.size,
      mimetype: uploadedFile.mimetype
    });
  });
});

// Base64 upload endpoint (fallback or for client-compressed images)
router.post("/base64", (req, res) => {
  try {
    const { image, filename } = req.body;
    if (!image || typeof image !== "string") {
      return res.status(400).json({ success: false, message: "Base64 image data string required" });
    }

    // Match data URI scheme: data:image/png;base64,....
    const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    let ext = ".png";
    let base64Data = image;

    if (matches && matches.length === 3) {
      ext = "." + (matches[1] === "jpeg" ? "jpg" : matches[1]);
      base64Data = matches[2];
    } else {
      // Raw base64 string
      base64Data = image.replace(/^data:([A-Za-z-+/]+);base64,/, "");
    }

    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(ext) ? ext : ".png";
    const uniqueName = "upload-" + Date.now() + "-" + Math.round(Math.random() * 1e9) + safeExt;
    const filePath = path.join(uploadDir, uniqueName);

    fs.writeFile(filePath, Buffer.from(base64Data, "base64"), (err) => {
      if (err) {
        console.error("Base64 save error:", err);
        return res.status(500).json({ success: false, message: "Failed to write image file to disk" });
      }

      return res.json({
        success: true,
        message: "Image uploaded and saved successfully!",
        url: `/uploads/${uniqueName}`,
        filename: uniqueName
      });
    });
  } catch (err) {
    console.error("Base64 processing error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to process base64 upload" });
  }
});

module.exports = router;

import API from "../services/api";

/**
 * Upload an image file from local drive to SkillSwap server
 * @param {File} file - HTML File object from local disk
 * @returns {Promise<string>} - Resolves to the uploaded image URL (e.g. /uploads/upload-xxx.png)
 */
export async function uploadImageFile(file) {
  if (!file) throw new Error("No file provided");

  // Validate image type
  if (!file.type.startsWith("image/") && !/\.(jpe?g|png|webp|gif|svg)$/i.test(file.name)) {
    throw new Error("Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).");
  }

  // Create multipart FormData
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await API.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    if (res.data && res.data.success && res.data.url) {
      return res.data.url;
    }
    throw new Error(res.data?.message || "Upload failed");
  } catch (err) {
    console.warn("Server multipart upload failed, attempting base64 fallback:", err);

    // Resilient fallback: read as data URL and upload via base64 or return data URL
    const dataUrl = await readFileAsDataUrl(file);
    try {
      const b64Res = await API.post("/upload/base64", { image: dataUrl });
      if (b64Res.data && b64Res.data.success && b64Res.data.url) {
        return b64Res.data.url;
      }
    } catch (b64Err) {
      console.warn("Base64 upload endpoint failed, returning client Data URL fallback:", b64Err);
    }
    // Final fallback: return Data URL directly so user is never blocked
    return dataUrl;
  }
}

/**
 * Read local file as Base64 Data URL for immediate preview
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

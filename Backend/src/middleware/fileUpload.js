const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
exports.uploadFile = async (req, res, next) => {
  const { files } = req.files || [];
  let fileValidation = true;
  if (files && files.length > 0) {
    fileList = [];
    const uploadDir = path.join(__dirname, "../../", "UPLOAD_DATA");
    for (let tempFile of files) {
      let fileType = tempFile.type.split("/")[0];
      if (!(fileType === "image" || fileType === "video")) {
        fileValidation = false;
        break;
      }
      let filePath = path.join(
        uploadDir,
        uuidv4() + path.extname(tempFile.name)
      );
      fs.copyFileSync(tempFile.path, filePath);
      fileList.push(path.basename(filePath));
    }
    if (!fileValidation)
      return res
        .status(400)
        .json({ success: false, error: "Inappropiate File Type" });
    req.fileList = fileList;
    return next();
  }
  return res.json({ success: false, error: "Cannot create an empty post" });
};

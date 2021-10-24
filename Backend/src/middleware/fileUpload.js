require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { uploadFiles } = require("../producers/post");
exports.uploadFile = async (req, res, next) => {
  let { files } = req.files || [];
  let fileValidation = true;
  if (files && typeof files.length === "undefined") files = [files];
  if (files && files.length > 0) {
    fileList = [];
    const uploadDir = path.join(__dirname, process.env.UPLOAD_PATH);
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

exports.uploadFileKafka = (req, res, next) => {
  uploadFiles(req, res, next);
};

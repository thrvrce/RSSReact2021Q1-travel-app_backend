import * as express from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import { UPLOAD_PRESET_DELETEFILE } from "../Const";

const loader = multer({ dest: path.join(__dirname, "tmp") });

async function setImage(
  req: express.Request,
  res: express.Response,
  next: any
) {
  const uploadPreset: string | undefined = req.header("uploadPreset");
  if (uploadPreset) {
    if (uploadPreset !== UPLOAD_PRESET_DELETEFILE) {
      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            upload_preset: uploadPreset,
          });
          req.body.imgSecureUrl = result.secure_url;
          req.body.imgPublicId = result.public_id;
        } catch (error) {
          res.send(error);
        }
        fs.unlink(req.file.path);
      }
    } else {
      try {
        const deleteStatus = await cloudinary.uploader.destroy(
          req.body.imgPublicId
        );
        if (deleteStatus.result === "ok") {
          req.body.imgPublicId = "";
          req.body.imgSecureUrl = "";
        }
      } catch (error) {
        res.send(error);
      }
    }
  }

  next();
}

export { loader, setImage };

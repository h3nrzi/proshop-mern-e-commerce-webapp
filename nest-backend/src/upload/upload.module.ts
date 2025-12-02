import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MulterModule } from "@nestjs/platform-express";
import * as multer from "multer";
import * as path from "path";
import { AdminGuard } from "../auth/admin.guard";
import { AuthGuard } from "../auth/auth.guard";
import { User, UserSchema } from "../user/user.schema";
import { UploadController } from "./upload.controller";

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, "uploads/");
  },
  filename(_req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void
) => {
  const fileTypes = /jpg|jpeg|png|webp/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  if (!extname || !mimetype) {
    return cb(new Error("Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed."), false);
  }
  cb(null, true);
};

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MulterModule.register({ storage, fileFilter }),
  ],
  controllers: [UploadController],
  providers: [AuthGuard, AdminGuard],
})
export class UploadModule {}

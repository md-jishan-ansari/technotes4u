import CatchAsync from "../utils/CatchAsync.js";
import sharp from 'sharp';
import path from 'path';
import { promises as fsPromises } from 'fs';

export const imageupload = CatchAsync(async (req, res, next) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({
            success: false,
            message: 'No file received.'
        });
    }

    const file = req.files.file;
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(process.env.CDN_PATH, filename);

    // Read file buffer and compress with sharp
    const compressedImageBuffer = await sharp(file.data)
      .resize(1920, 1080, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Write compressed file
    await fsPromises.writeFile(filepath, compressedImageBuffer);

    req.link = `${process.env.CDN_URL}/${filename}`;

    next();
});

export const deleteimage = CatchAsync(async (req, res, next) => {
  const imageUrl = req.body.imageUrl;
  const filename = imageUrl.split('/').pop();
  const filepath = path.join(process.env.CDN_PATH, filename);

  await fsPromises.unlink(filepath);

  next();
});
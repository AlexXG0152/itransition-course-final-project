import { Injectable } from '@nestjs/common';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  StorageReference,
  getStorage,
  deleteObject,
} from 'firebase/storage';

@Injectable()
export class FirebaseService {
  async remove(name: string) {
    try {
      const storage = getStorage();
      const desertRef = ref(storage, `user-pictures-uploads/${name}`);

      await deleteObject(desertRef);
    } catch (error) {
      console.error(error);
    }
  }

  async upload(files: Express.Multer.File[]) {
    try {
      const attachments = await Promise.all(
        files.map(async (file) => {
          const downloadURL = await this.uploadfile(file);
          return {
            originalname: downloadURL.filename,
            link: downloadURL.downloadURL,
          };
        }),
      );
      return attachments;
    } catch (error) {
      console.error(error);
    }
  }

  async uploadfile(file: Express.Multer.File) {
    const storage = getStorage();

    const filename = `${file.originalname}-id-${Date.now()}`;

    const storageRef: StorageReference = ref(
      storage,
      `user-pictures-uploads/${filename}`,
    );

    const metadata: any = {
      contentType: `${file.mimetype}`,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata,
    );

    const downloadURL = await getDownloadURL(snapshot.ref);

    return { filename, downloadURL };
  }
}

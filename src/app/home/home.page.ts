import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource, GalleryPhoto, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { AttachedPhoto } from './attached-photo';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public photos: Array<AttachedPhoto>;

  constructor(
      public platform: Platform,
  ) {
      this.platform = platform;
      this.photos = [];
  }

  public async takePhoto(): Promise<void> {
      const capturedPhoto = await Camera.getPhoto({
          correctOrientation: true,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          quality: 75,
      });

      const photoId = "test";

      // Save the picture and add it to photo collection
      const savedImageFile = await this.savePicture(capturedPhoto, photoId);

      const attachedPhoto = new AttachedPhoto({
          id: photoId,
          filePath: savedImageFile.filepath,
      });

      if (this.platform.is('hybrid')) {
          attachedPhoto.webviewPath = savedImageFile.webviewPath as string;
      }
      else {
          attachedPhoto.base64 = savedImageFile.base64Data as string;
      }      

      this.photos.push(attachedPhoto);
  }

  private async savePicture(photo: Photo | GalleryPhoto, photoId: string) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);

    // Write the file to the data directory
    const fileName = photoId + '.jpeg';
    const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
    });

    if (this.platform.is('hybrid')) {
        // Display the new image by rewriting the 'file://' path to HTTP
        // Details: https://ionicframework.com/docs/building/webview#file-protocol
        return {
            filepath: savedFile.uri,
            webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        };
    }
    else {
        // Use webPath to display the new image instead of base64 since it's
        // already loaded into memory
        return {
            filepath: fileName,
            base64Data,
        };
    }
  }
  
  private async readAsBase64(photo: Photo | GalleryPhoto): Promise<string> {
      // "hybrid" will detect Cordova or Capacitor
      if (this.platform.is('hybrid')) {
          // Read the file into base64 format
          const file = await Filesystem.readFile({
              path: photo.path as string,
          });

          return file.data;
      }
      else {
          // Fetch the photo, read as a blob, then convert to base64 format
          const response = await fetch(photo.webPath as string);
          const blob = await response.blob();

          return await this.convertBlobToBase64(blob) as string;
      }
  }  

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
          resolve(reader.result);
      };
      reader.readAsDataURL(blob);
  });  

}

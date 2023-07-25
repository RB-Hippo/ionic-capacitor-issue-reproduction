import { Component } from '@angular/core';
import { Camera } from '@capacitor/camera';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
      public platform: Platform,
  ) { }

  public async addPhotosFromLibrary(): Promise<void> {
    // Pick photos
    const pickedPhotos = await Camera.pickImages({
        correctOrientation: true,
        quality: 75,
    });
  }
}

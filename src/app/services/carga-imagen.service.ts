import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import FileItem from '../models/File-item';

@Injectable({
  providedIn: 'root'
})
export class CargaImagenService {

  private carpeta_img = 'img';

  constructor(private db: AngularFirestore) { }

  private saveImage(imagen: { nombre: string, url: string }): void {
    this.db.collection(`${this.carpeta_img}`).add(imagen);
  }

  public uploadImagesFirebase(imagenes: FileItem[]) {
    const storageRef = firebase.storage().ref();

    for (const i of imagenes) {
      i.estaSubiendo = true

      if (i.progreso >= 100) continue;

      const upload: firebase.storage.UploadTask = storageRef.child(`${this.carpeta_img}/${i.nombreArchivo}`).put(i.archivo);

      upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) =>
          i.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        (error) => console.error('Error al subir', error),
        () => {
          console.log('Imagen cargada');
          upload.snapshot.ref.getDownloadURL().then((downloadURL) => {
            i.url = downloadURL;
            i.estaSubiendo = false;
            this.saveImage({
              nombre: i.nombreArchivo,
              url: i.url
            });
          });
        });
    }
  }

}

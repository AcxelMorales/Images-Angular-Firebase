import { Component } from '@angular/core';
import FileItem from 'src/app/models/File-item';
import { CargaImagenService } from 'src/app/services/carga-imagen.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styles: []
})
export class CargaComponent {

  public archivos: FileItem[] = [];
  onDrop: boolean = false;

  constructor(private _service: CargaImagenService) { }

  public uploadImages(): void {
    this._service.uploadImagesFirebase(this.archivos);
  }

  public clearFiles(): void {
    this.archivos = [];
  }

}

import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import FileItem from '../models/File-item';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any) {
    this.mouseSobre.emit(true);
    this._preventStop(event);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    this.mouseSobre.emit(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any) {
    const transferencia = this._getTransferencia(event);

    if (!transferencia) return;

    this._extractFiles(transferencia.files);
    this._preventStop(event);
    this.mouseSobre.emit(false);
  }

  private _getTransferencia(event: any): any {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _extractFiles(archivosLista: FileList) {
    for (const i in Object.getOwnPropertyNames(archivosLista)) {
      const archivoTemp = archivosLista[i];

      if (this._isFileChangeOk(archivoTemp)) {
        const nuevoArchivo = new FileItem(archivoTemp);
        this.archivos.push(nuevoArchivo);
      }
    }

    console.log(this.archivos);
  }

  // Validaciones
  private _isFileChangeOk(archivo: File): boolean {
    if (!this._isExistDrop(archivo.name) && this._isImage(archivo.type)) return true;
    else return false;
  }

  private _preventStop(event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  private _isExistDrop(nombreArchivo: string): boolean {
    for (const i of this.archivos) {
      if (i.nombreArchivo === nombreArchivo) {
        console.log(`El archivo ${nombreArchivo} ya esta agregado`);
        return true;
      }
    }

    return false;
  }

  private _isImage(tipoArchivo: string): boolean {
    return (tipoArchivo === '' || tipoArchivo === undefined) ? false : tipoArchivo.startsWith('image');
  }

}

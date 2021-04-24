import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseService } from '@services/firebase.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  public isUpdate: boolean = false;
  public creationForm!: FormGroup;
  public allPosts: any[] = []
  public config: any = {
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.allPosts.length
  }

  @ViewChild('input')
  private fileInput!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private storage: AngularFireStorage,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getAllPosts();

  }

  getAllPosts() {
    this.firebaseService.getAllPosts().subscribe((res: any) => {
      const newPosts = res.map((e: any) => {
        const document = e.payload.doc.data();
        return {
          firebaseId: e.payload.doc.id,
          title: document.title,
          subtitle: document.subtitle,
          imageUrl: document.imageUrl,
          likes: document.likes,
          description: document.description,
          comments: document.comments
        }
      });

      this.allPosts = newPosts;
    })
  }


  createForm() {
    this.creationForm = this.formBuilder.group({
      title: [''],
      subtitle: [''],
      imageUrl: [''],
      description: [''],
      likes: [0],
      comments: [[]],
      firebaseId: ['']
    })
  }

  get imageUrl() {
    return this.creationForm.get('imageUrl')!.value;
  }

  get firebaseId() {
    return this.creationForm.get('firebaseId')!.value;
  }

  get update() {
    return this.isUpdate;
  }

  createPost() {
    this.firebaseService.createPost(this.creationForm.value)
      .then(res => {
        this.creationForm.reset();
        this.fileInput.nativeElement.value = "";
        alert('Post creado correctamente');

      })
      .catch(err => {
        console.error(err);
      })
  }

  deletePost(id: string) {
    this.firebaseService.deletePost(id)
      .then(res => {
        alert('Borrado correctamente');
      })
      .catch(err => {
        console.error(err);
      })
  }

  setUpdatePost(post: any) {
    this.isUpdate = true;
    this.creationForm.setValue(post);
  }

  updatePost(id: any) {
    this.firebaseService.updatePost(id, this.creationForm.value)
      .then(res => {
        alert('Editado correctamente')
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        this.isUpdate = false;
      })
  }

  uploadFile(event: any) {
    const image = event.target.files[0];
    const name = image.name;
    const ref = this.storage.ref(name);
    const task = this.storage.upload(name, image);

    task.percentageChanges().subscribe(res => {

    });

    task.snapshotChanges()
      .pipe(
        finalize(() => {
          const urlImage$ = ref.getDownloadURL();
          urlImage$.subscribe(url => {
            this.creationForm.get('imageUrl')!.setValue(url);
          })
        })
      )
      .subscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      width: '460'
    });

    dialogRef.componentInstance.title = '¿Listo para crear el post?';
    dialogRef.componentInstance.btnClose = 'No';
    dialogRef.componentInstance.btnConfirm = 'Sí';

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.createPost();
      }
    });
  }

  openDialogDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      width: '460'
    });

    dialogRef.componentInstance.title = '¿Está seguro de eliminar el post';
    dialogRef.componentInstance.btnClose = 'No';
    dialogRef.componentInstance.btnConfirm = 'Sí';

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deletePost(id);
      }
    });
  }

  openDialogUpdate(id: string): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      width: '460'
    });

    dialogRef.componentInstance.title = '¿Está seguro de editar el post?';
    dialogRef.componentInstance.btnClose = 'No';
    dialogRef.componentInstance.btnConfirm = 'Sí';

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.updatePost(id);
      }
    });
  }

  pageChanged(event: any) {
    this.config.currentPage = event;
  }
}



import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  public title: string = '';
  public message: string = '';
  public btnClose: string = '';
  public btnConfirm: string = '';

  constructor(
    public dialogRef: MatDialogRef<ConfirmModalComponent>
  ) { }

  confirm(): void {
    this.dialogRef.close(true);
  }

}

import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user = {
    username: '',
    password: '',
    remember: false,
  };

  constructor(public dialogRef: MatDialogRef<LoginComponent>) {}

  ngOnInit() {}

  onSubmit() {
    console.log('User: ', this.user);
    this.dialogRef.close();
  }
}

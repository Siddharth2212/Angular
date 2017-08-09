import {MdDialog, MdDialogRef} from '@angular/material';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private dialogRef: MdDialogRef<LoginComponent>) { }

  user = {remember: false};

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.user);
    this.dialogRef.close();
  }

}

import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetchResult } from '@apollo/client/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


const GETUSER = gql`
mutation{
  login(username:"sunlis",
  password:"sunlist25")
}`

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;

  loginForm: FormGroup;

  user: any

  loading: boolean = true

  constructor(
    private router: Router,
    private apollo: Apollo,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  
  ) {
    this.loginForm = this.fb.group({
      username: ['sunylis', [
        Validators.required
      ]],
      password: ['sunlist25', [
        Validators.required,
        Validators.pattern('^.{5,10}$')
      ]],
    })
  }

  get username(): any {
    return this.loginForm.get('username'); 
  }

  get password(): any {
    return this.loginForm.get('password');
  }

  async submit($event: MouseEvent) {
    $event.preventDefault();

    const { username, password } = this.loginForm.value;
    console.log(username)
    console.log(password)
    if (password == "sunlist25") {
      
      this.router.navigate([`/home`]);
      this.snackBar.open('Welcome back', 'Thank you', {
        duration: 2000,
      });
    }

    this.apollo.watchQuery({
      query: GETUSER,
      variables: { username }

    }).valueChanges.subscribe(async(result: any) => {
      const user = await result.data.getUserByUsername
      console.log(user.id)

      if (password == "sunlist25") {
      
        this.router.navigate([`/home`]);
        this.snackBar.open('Welcome back', 'Thank you', {
          duration: 2000,
        });
      } else {
        this.snackBar.open('Login Failed', 'Sorry', {
          duration: 2000,
        });
      }
    })
  }


  ngOnInit(): void {

  }

}
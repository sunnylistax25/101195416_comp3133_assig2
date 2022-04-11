import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { FetchResult } from '@apollo/client/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const ADDUSER = gql`
  mutation createUser($username: String!,$firstname: String!, $lastname: String!, $email: String!, $password: String!){
    createUser(username: $username,$firstname: String!, $lastname: String!, email: $email, password: $password){
      username
    }
  }`

  // Mutation {
  //   createUser(
  //     username: String!
  //     firstname: String!
  //     lastname: String!
  //     password: String!
  //     email: String!
  //     type: String!): User

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup

  hide = true

  constructor(
    private router: Router,
    private apollo: Apollo,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.signupForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.pattern('[A-Za-z0-9]+')
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern('[A-Za-z0-9]+')
      ]],
    })
  }

  get username(): any {
    return this.signupForm.get('username')
  }

  get email(): any {
    return this.signupForm.get('email')
  }

  get password(): any {
    return this.signupForm.get('password')
  }

  submit($event: MouseEvent): void {
    $event.preventDefault()

    console.log(this.signupForm.value)

    const { username, email, password } = this.signupForm.value;

    this.apollo.mutate({
      mutation: ADDUSER,
      variables: { username, email, password }
    }).subscribe((res: any) => {
      console.log('login response: ', res)

      this.router.navigate(['/'])
      this.snackBar.open('User registered successfully.', '', {
        duration: 3000,
      })

    }, (error) => {
      console.log("The registration coudn't be completed: ", error)
    })
  }

  ngOnInit(): void {
  }

}
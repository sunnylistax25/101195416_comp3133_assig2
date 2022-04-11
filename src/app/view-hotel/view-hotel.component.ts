import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Hotel } from '../home/home.component'


const GETHOTEL = gql`
  query getHotelById($id: ID!){
    getHotelById(id: $id) {
      id
      hotel_name
      street
      city
      postal_code
      price
      email
    }
  }`

const NEWBOOKING = gql`
mutation addBooking(
  $hotel_id: String!,
  $user_id: String!,
  $booking_start: String!,
  $booking_end: String!
  ){
  addBooking(
    hotel_id: $hotel_id,
    user_id: $user_id,
    booking_start: $booking_start,
    booking_end: $booking_end
  ){
    id
    hotel{
      hotel_name
    }
    booking_start
    booking_end
    createdAt
  }
}
`

@Component({
  selector: 'app-view-hotel',
  templateUrl: './view-hotel.component.html',
  styleUrls: ['./view-hotel.component.scss']
})
export class ViewHotelComponent implements OnInit {

  @Input() hotel?: Hotel

  bookingForm: FormGroup

  _userId: string = ''
  _hotelId: string = ''

  loading: boolean = true

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apollo: Apollo,
    private fb: FormBuilder,
    private snackBar: MatSnackBar

  ) {
    this.bookingForm = this.fb.group({
      hotelId: [this._hotelId, [
        Validators.required
      ]],
      userId: [this._userId, [
        Validators.required
      ]],
      startDate: ['', [
        Validators.required
      ]],
      endDate: ['', [
        Validators.required
      ]]
    })
  }

  get hotelId(): any{
    return this.bookingForm.get('hotelId')
  }

  get userId(): any{
    return this.bookingForm.get('userId')
  }

  get startDate(): any {
    return this.bookingForm.get('startDate')
  }

  get endDate(): any {
    return this.bookingForm.get('endDate')
  }

  submit($event: MouseEvent): void {
    $event.preventDefault()

    console.log(this.bookingForm.value)

    const { hotelId, userId, startDate, end } = this.bookingForm.value;

    this.apollo.mutate({
      mutation: NEWBOOKING,
      variables: { hotelId, userId, startDate, end }
    }).subscribe((res: any) => {
      console.log('login response: ', res)

      this.router.navigate(['/'])
      this.snackBar.open('New Booking added successfully.', '', {
        duration: 3000,
      })

    }, (error) => {
      console.log("The registration coudn't be completed: ", error)
    })
  }



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.apollo.watchQuery({
      query: GETHOTEL,
      variables: { id }

    }).valueChanges.subscribe((result: any) => {
      this.hotel = result.data.getHotelById
      this.loading = result.loading
    })
  }

  debug(val: any) {
    console.log("DEBUG:", val)
  }

}
import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { FetchResult } from '@apollo/client/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';


export interface Hotel {
  id: string;
  hotel_name: string;
  street: string;
  city: string;
  postal_code: string;
  price: number;
  email: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  hotelsData: Hotel[] = []

  loading: boolean = true

  displayedColumns: string[] = [
    'hotel_name', 'street', 'city', 'postal_code', 'price', 'email'
  ]

  dataSource = new MatTableDataSource(this.hotelsData);

  constructor(
    private router: Router,
    private apollo: Apollo,

  ) { }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: gql`
        {
          getHotels {
            id
            hotel_name
            street
            city
            postal_code
            price
            email
          }
        }
      `
    })
      .valueChanges.subscribe((result: any) => {
        result.data.getHotels.map((hotelObject: any) => {
          const hotel: Hotel = {
            id: hotelObject.id,
            hotel_name: hotelObject.hotel_name,
            street: hotelObject.street,
            city: hotelObject.city,
            postal_code: hotelObject.postal_code,
            price: hotelObject.price,
            email: hotelObject.email
          }
          this.hotelsData.push(hotel)
        } )
        this.loading = result.loading
      })
  }

  navigate(id: any) {
    this.router.navigate([`/view-hotel/${id}`])
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  debug(val: any) {
    console.log("DEBUG:", val)
  }

}
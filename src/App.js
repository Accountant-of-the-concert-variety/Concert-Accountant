// Hooking up API call
// Grabbing search function from API to allow user to input keyword
// https://app.ticketmaster.com/discovery/v2/events.json?
// parameters: apikey, keyword
// animation/image on isLoading before displaying search

// component to display search results

// display all the events with price-range, date, name, image, url to selected event site

// Form for creating list
// Text input with placeholder "Create a list" that gets replaced with name
// Allow user to enter a budget and name of the list
// Lists stack on top of each other that can be minimized with a button
// Store name and budget amount into its own database on firebase

// On all the events displayed, have a button for each event where you can add it to the list

import { useEffect, useState } from 'react';
import './App.css';
import DisplayEvents from './DisplayEvents';
import Search from './Search';
import firebase from 'firebase';

function App() {

   const [events, setEvents] = useState([]);
   const [search, setSearch] = useState("");

   const submitForm = (e) => {
      e.preventDefault();

      const ticketMasterUrl = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
      const ticketMasterKey = "LTtkh2NXZOyGcG6HGOASJH8KgZ4JiKGX"
      const searchKeyword = "eagles";

      ticketMasterUrl.search = new URLSearchParams({
         apikey: ticketMasterKey,
         keyword: search,
         size: 20
      })

      fetch(ticketMasterUrl)
         .then(data => {
            return data.json();
         }).then(jsonData => {
            filterEvents(jsonData);
         })
      // .catch(data => {
      //    console.log("not found")
      // })
      setSearch("");


      // fetch(searchUrl + search)
      //    .then(res => res.json())
      //    .then(data => {
      //       setEvents(data._embedded.events)
      //    }).catch(data => {
      //       console.log("not found");
      //    })
      // setSearch("");
   };

   const searchQuery = (e) => {
      setSearch(e.target.value);
   };


   //in case we need to filter events (by price, selected image etc. before displaying on the page)
   function filterEvents(jsonData) {
      const events = jsonData._embedded.events;
      console.log(events);

      setEvents(events.map(event => {
         const name = event.name;
         const date = event.dates.start.localDate;

         const venueName = event._embedded.venues[0].name;
         const country = event._embedded.venues[0].country.countryCode;
         const city = event._embedded.venues[0].city.name;

         const venue = {
            name: venueName,
            city: city,
            country: country
         }
         // const venue = `${venueName} ${city}, ${country}`;

         console.log(venue);
         console.log(event._embedded.venues[0]);

         let price = {
            min: 0,
            max: 0
         }

         if (event.priceRanges) {
            price = {
               min: event.priceRanges[0].min,
               max: event.priceRanges[0].max
            }
         }

         //update this to choose smallest image. Right now its just the first one
         const image = event.images[0].url;

         return ({ name, image, date, venue, price })
      }));

   }

   console.log(events)

   return (
      <div className="App">
         <Search
            submitForm={submitForm}
            value={search}
            searchQuery={searchQuery} />

         <ul>
            <DisplayEvents
               events={events}
               displayType="searchResults"
            />
         </ul>
      </div>
   );
}

export default App;

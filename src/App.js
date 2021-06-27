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
import WatchList from './WatchList';
import firebase from './firebase';

function App() {
   const [list, setList] = useState([]);
   const [watchList, setWatchList] = useState([]);
   const [userName, setUserName] = useState("Brandon");

   useEffect(() => {
      const dbRef = firebase.database().ref(`${userName}/lists/watchList`);

      dbRef.on('value', (response) => {
         const newState  = []
         const data = response.val()
         console.log(data);

         for (let key in data)
            {
               newState.push({key: key, name: data[key]})
            }
            console.log(newState)
            setWatchList(newState)
      })
   },  [])

   const removeListItem = (listId) => {
      const dbRef = firebase.database().ref(`${userName}/lists/watchList`);


      
      dbRef.child(listId).remove();
   }


   function addToWatchList() {
      const dbRef = firebase.database().ref(`${userName}/lists/watchList`);
      dbRef.push(search);
   }




   const [events, setEvents] = useState([]);
   const [search, setSearch] = useState("");

   const submitForm = (e) => {
      e.preventDefault();
      // dbRef.push(search);
   

      const ticketMasterUrl = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
      const ticketMasterKey = "LTtkh2NXZOyGcG6HGOASJH8KgZ4JiKGX"

      ticketMasterUrl.search = new URLSearchParams({
         apikey: ticketMasterKey,
         keyword: search,
         size: 5
      })

      fetch(ticketMasterUrl)
         .then(data => {
            return data.json();
         }).then(jsonData => {
            filterEvents(jsonData);
         })
         .catch(data => {
            console.log("not found")
         })
      setSearch("");
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
         const button = addToWatchList;
         
         const key =event.id;

         const venue = {
            name: venueName,
            city: city,
            country: country
         }

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

         return ({ name, image, date, venue, price, button, key })
      }));
   }


   return (
      <div className="App">
         <Search
            submitForm={submitForm}
            value={search}
            searchQuery={searchQuery} />

         <ol>
            <WatchList saveList = {watchList} remove = {removeListItem} searchList = {submitForm}/>
         </ol>
            
         

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

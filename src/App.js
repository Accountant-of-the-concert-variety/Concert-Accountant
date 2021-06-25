import './App.css';
import { useState, useEffect } from 'react';
import Search from './Search';
import Events from './Events';

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

const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?&apikey=LTtkh2NXZOyGcG6HGOASJH8KgZ4JiKGX`

const searchUrl =  new URL("https://app.ticketmaster.com/discovery/v2/events.json?&apikey=LTtkh2NXZOyGcG6HGOASJH8KgZ4JiKGX&keyword=");

URL.search = new URLSearchParams({
   param1: 'keyword'
});



function App() {
const [events, setEvents] = useState([]);
const [search, setSearch] = useState("");

   const submitForm = (e) => {
   e.preventDefault();

   fetch(searchUrl + search)
   .then(res => res.json())
   .then(data => {
      setEvents(data._embedded.events)
   }).catch(data => {
      console.log("not found");
   })
   setSearch("")};

   const searchQuery = (e) => {
      setSearch(e.target.value);
   };


    

   return (
      <div className="App">
      <Search
         submitForm={submitForm}
         value={search}
         searchQuery={searchQuery}/>


      </div>
   );
}
   export default App;

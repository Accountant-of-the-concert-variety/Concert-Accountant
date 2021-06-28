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
import UserList from './UserList';
import firebase from './firebase';
import { act } from 'react-dom/cjs/react-dom-test-utils.production.min';

function App() {
   const [events, setEvents] = useState([]);
   const [search, setSearch] = useState("");

   const [activeList, setActiveList] = useState('LA');
   const [activeListItems, setActiveListItems] = useState([]);
   const [watchList, setWatchList] = useState([]);

   const [userName, setUserName] = useState("Brandon");
   const [userNameTemplate, setUserNameTemplate] = useState("")

   console.log(userName)

   const userNameInput = (e) => {
      e.preventDefault();
      setUserNameTemplate(e.target.value)
   }

   const setUserNameButton = (e) => {
      e.preventDefault();
      setUserName(userNameTemplate);
      console.log(userNameTemplate);
   }

   useEffect(() => {
      const dbRef = firebase.database().ref(`${userName}/lists/watchList`);

      dbRef.on('value', (response) => {
         const newState = []
         const data = response.val()
         // console.log(data);

         for (let key in data) {
            newState.push({ key: key, name: data[key] })
         }
         // console.log(newState);
         setWatchList(newState);
         setUserName(newState)
      })
   }, [])

   const removeListItem = (listId) => {
      const dbRef = firebase.database().ref(`${userName}/lists/${activeList}`);
      dbRef.child(listId).remove();
   }

   function addToActiveList() {
      const dbRef = firebase.database().ref(`${userName}/lists/${activeList}`)
      dbRef.push(search)
      console.log(search)
   }

   function addToWatchList() {
      const dbRef = firebase.database().ref(`${userName}/lists/watchList`);
      dbRef.push(search);
   }

   const submitForm = (e, searchTerm) => {
      e.preventDefault();
      // dbRef.push(search);
      let searchWord = search;

      if (searchTerm) {
         searchWord = searchTerm;
      }
      // console.log(searchWord);

      const ticketMasterUrl = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
      const ticketMasterKey = "LTtkh2NXZOyGcG6HGOASJH8KgZ4JiKGX"

      ticketMasterUrl.search = new URLSearchParams({
         apikey: ticketMasterKey,
         keyword: searchWord,
         size: 5
      })

      fetch(ticketMasterUrl)
         .then(data => {
            return data.json();
         }).then(jsonData => {
            filterEvents(jsonData);
         })
         .catch(data => {
            filterEvents(data);
            // setEvents([]);
            console.log("not found");
         })
      setSearch("");
   };

   const searchQuery = (e) => {
      setSearch(e.target.value);
   };

   //in case we need to filter events (by price, selected image etc. before displaying on the page)
   function filterEvents(jsonData) {
      let events = [];

      if (jsonData._embedded) {
         events = jsonData._embedded.events;
      }

      if (events.length > 0) {
         setEvents(events.map(event => {
            const name = event.name;
            const date = event.dates.start.localDate;

            const venueName = event._embedded.venues[0].name;
            const country = event._embedded.venues[0].country.countryCode;
            const city = event._embedded.venues[0].city.name;
            const button = addToActiveList
            const key = event.id;

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

            return ({ name, image, date, venue, price, key, button })
         }));
      } else {
         const name = "No events found. Would you like to add to watch-list to search later?";
         const button = addToWatchList;
         const image = "https://i0.wp.com/www.ecommerce-nation.com/wp-content/uploads/2017/08/How-to-Give-Your-E-Commerce-No-Results-Page-the-Power-to-Sell.png?resize=1000%2C600&ssl=1"

         const event = [{ name, image, button }]

         setEvents(event);
      }
   }


   return (
      <div className="App">
         <Search
            submitForm={submitForm}
            value={search}
            searchQuery={searchQuery}
         />

         <UserList
            userNameInput={userNameInput}
            userNameTemplate={userNameTemplate}
            button={setUserNameButton}
         />

         <ol>
            <WatchList
               saveList={watchList}
               remove={removeListItem}
               searchList={submitForm} />
         </ol>

         <ul>
            <DisplayEvents
               events={activeListItems}
               displayType="listItems"
            />
         </ul>

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

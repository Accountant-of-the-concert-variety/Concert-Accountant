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

import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import DisplayEvents from './DisplayEvents';
import Search from './Search';
import WatchList from './WatchList';
import UserNameForm from './UserList';
import NewList from './AddLists';
import firebase from './firebase';

function App() {
   const [events, setEvents] = useState([]);
   const [search, setSearch] = useState("");

   const [allLists, setAllLists] = useState([]);
   const [activeList, setActiveList] = useState('New York');
   const [activeListItems, setActiveListItems] = useState([]);

   const [watchList, setWatchList] = useState([]);
   const [newListName, setNewListName] = useState("");

   const [userName, setUserName] = useState("Brandon");
   const [userNameValue, setUserNameValue] = useState("")
   const [allUsers, setAllUsers] = useState([]);

   console.log("search = " + search);
   console.log(userName);

   useEffect(() => {
      const dbRef = firebase.database().ref();
      dbRef.on('value', (response) => {
         const nameState = []
         const data = response.val();
         for (let key in data) {
            nameState.push({ key: key, name: data[key] })
         }
         setAllUsers(nameState);
      })
   }, [])

   const userNameOnChange = (e) => {
      e.preventDefault();
      setUserNameValue(e.target.value)
   }

   const submitUserName = (e) => {
      if (e) {
         e.preventDefault();
      }

      setUserName(userNameValue);

      console.log("setting userName to " + userNameValue);
   }

   useEffect(() => {
      updateLists();

   }, [userName])

   useEffect(() => {
      updateUserLists(activeList);
   }, [activeList])

   const updateLists = () => {
      console.log(userName);
      const dbRef = firebase.database().ref(`${userName}/lists`);
      setWatchList([]);
      setActiveListItems([]);

      dbRef.on("value", response => {
         let lists = [];

         for (const list in response.val()) {
            if (list != "watchList") {
               lists.push(list);
            }
            updateUserLists(list);
         }

         setAllLists(lists);
      })
   }

   function updateUserLists(list) {
      console.log(list);
      const dbRef = firebase.database().ref(`${userName}/lists/${list}/events`);

      dbRef.on("value", (response) => {
         const newState = [];
         const data = response.val();

         if (list === "watchList") {
            for (let key in data) {
               newState.push({ key: key, name: data[key] });
            }

            setWatchList(newState);

         } else if (list === activeList) {
            for (const key in data) {
               newState.push(data[key])
            }

            setActiveListItems(newState);
         }
      });
   }

   function changeActiveList(list, e) {
      if (e) {
         e.preventDefault();
      }

      console.log(list);
      setActiveList(list);
   }

   const removeListItem = (listId) => {
      const dbRef = firebase.database().ref(`${userName}/lists/watchList`);
      dbRef.child(listId).remove();
   }

   function addToActiveList(listItem) {
      const dbRef = firebase.database().ref(`${userName}/lists/${activeList}/events/${listItem.name}`);
      dbRef.set(listItem)
      console.log(listItem);
   }

   function addToWatchList() {
      const dbRef = firebase.database().ref(`${userName}/lists/watchList`);
      dbRef.push(search);
   }

   const searchOnChange = (e) => {
      setSearch(e.target.value);
   };

   const submitSearch = (e, searchTerm) => {
      e.preventDefault();
      // dbRef.push(search);
      let searchWord = search;

      if (searchTerm) {
         setSearch(searchTerm);
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
   };

   function filterEvents(data) {
      let events = [];

      if (data._embedded) {
         events = data._embedded.events;
      }

      if (events.length > 0) {
         const eventList = (events.map(event => {
            const type = "event"
            const name = event.name;
            const date = event.dates.start.localDate;

            const venueName = event._embedded.venues[0].name;
            const country = event._embedded.venues[0].country.countryCode;
            const city = event._embedded.venues[0].city.name;

            const key = `${userName + event.id}`;

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

            return ({ type, name, image, date, venue, price, key })
         }));

         setEvents(eventList);
      } else {
         const name = "No events found. Would you like to add to watch-list to search later?";

         const image = "https://i0.wp.com/www.ecommerce-nation.com/wp-content/uploads/2017/08/How-to-Give-Your-E-Commerce-No-Results-Page-the-Power-to-Sell.png?resize=1000%2C600&ssl=1"

         const event = [{ name, image }]

         setEvents(event);
      }
   }

   // const submitList = (e) => {
   //    e.preventDefault();
   //    setActiveList(createList);
   // }

   const listNameOnChange = (e) => {
      console.log(e.target.value)
      setNewListName(e.target.value);
   }


   return (
      <Router>
         <div className="App">
            <Search
               submitSearch={submitSearch}
               value={search}
               searchOnChange={searchOnChange}
            />

            <UserNameForm
               submitUserName={submitUserName}
               value={userNameValue}
               userNameOnChange={userNameOnChange}
            />

            <NewList
               submitList={(e) => changeActiveList(newListName, e)}
               value={newListName}
               listNameOnChange={listNameOnChange}
            />

            <div>
               <ul>
                  {allUsers.map((name) => {
                     return (
                        <li key={name.key}>
                           <p
                              // bug - have to click twice
                              onClick={(e) => {
                                 e.preventDefault();
                                 setUserName(`${name.key}`);
                              }}
                           >
                              {name.key}
                           </p>
                        </li>
                     );
                  })}
               </ul>
            </div>

            <ol>
               <WatchList
                  saveList={watchList}
                  remove={removeListItem}
                  searchList={submitSearch} />
            </ol>

            {/* <ul>
               <DisplayEvents
                  events={activeListItems}
                  displayType="listItems"
               />
            </ul> */}

            <ul>
               {
                  allLists.map(list => {
                     return (
                        <li>
                           <button onClick={() => { changeActiveList(list) }}>
                              <Link to="/list">{list}</Link>
                           </button>
                        </li>
                     )
                  })
               }
            </ul>

            <Route exact path="/list">
               <DisplayEvents
                  events={activeListItems}
                  displayType="listItems"
               />
            </Route>

            <ul>
               <DisplayEvents
                  events={events}
                  displayType="searchResults"
                  activeList={activeList}
                  button={{ addToActiveList, addToWatchList }}
               />
            </ul>
         </div>
      </Router>
   );
}

export default App;


//Please change the file name of your "UserList.js" to "UserNameForm.js"
//Please change the file name of your "AddLists.js" to "NewList.js"
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
import Footbar from './Footbar.js'
import DisplayEvents from './DisplayEvents';
import Search from './Search';
import WatchList from './WatchList';
import UserNameForm from './UserNameForm';
import AddLists from './AddLists';
import Description from './Description';
import firebase from './firebase';

function App() {
   const [events, setEvents] = useState([]);
   const [search, setSearch] = useState("");

   const [allLists, setAllLists] = useState([]);
   const [activeList, setActiveList] = useState('');
   const [activeListItems, setActiveListItems] = useState([]);

   const [watchList, setWatchList] = useState([]);
   const [displayWatchList, setDispayWatchList] = useState(false);

   const [createList, setCreateList] = useState({ name: "", budget: "" });

   const [userName, setUserName] = useState("");
   const [userNameTemplate, setUserNameTemplate] = useState("")
   const [allUsers, setAllUsers] = useState([]);


   const [firebaseRef, setFirebaseRef] = useState({});
   const [firebaseVal, setFirebaseVal] = useState({});


   // USERNAME FORM
   const userNameInput = (e) => {
      e.preventDefault();
      setUserNameTemplate(e.target.value)
   }
   const setUserNameButton = (e) => {
      if (e) {
         e.preventDefault();
      }
      setUserName(userNameTemplate);
      createLists();
   }


   // CREATE LIST FORM
   const createLists = () => {
      console.log(userNameTemplate);
      const dbRef = firebase.database().ref(`${userNameTemplate}/lists`);
      setWatchList([]);
      setActiveListItems([]);

      dbRef.on("value", response => {
         let lists = [];

         for (const list in response.val()) {
            if (list !== "watchList") {
               lists.push({ name: list, budget: response.val()[list].budget });
            }
            updateUserLists(list);
         }


         setAllLists(lists);
      })
   }


   function updateUserLists(list) {
      const dbRef = firebase.database().ref(`${userNameTemplate}/lists/${list}/events`);

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

   useEffect(() => {
      updateUserLists(activeList);
   }, [activeList])

   function submitNewList(list, e) {
      e.preventDefault();

      const dbRef = firebase.database().ref(`${userName}/lists/${list.name}/budget`);

      dbRef.set(list.budget);

      changeActiveList(list.name, e);
   }

   // ACTIVE LIST BUTTON
   function changeActiveList(list, e) {
      e.preventDefault(); //maybe remove

      setActiveList(list);
      updateUserLists(list);
   }


   function removeFromLists(list, item) {
      let title = item.title;

      if (!item.title) {
         title = item;
         console.log(title);
      }
      firebaseRef.child(`${userName}/lists/${list}/events/${title}`).remove();
   }

   function addToLists(list, item) {
      let title = item.title;

      if (!item.title) {
         title = item;
         console.log(title);
      }

      firebaseRef.child(`${userName}/lists/${list}/events/${title}`).set(item);
   }


   // REMOVE BUTTONS
   const removeActiveListItem = (listItem) => {
      removeFromLists(activeList, listItem);
   }

   const removeWatchListItem = (listId) => {
      console.log(listId);
      removeFromLists("watchList", listId);
   }

   // ADD BUTTONS
   function addToActiveList(listItem) {
      addToLists(activeList, listItem);
   }
   function addToWatchList() {
      addToLists("watchList", search)
   }



   // SEARCH FORM
   const searchQuery = (e) => {
      setSearch(e.target.value);
   };

   const submitForm = (e, searchTerm) => {
      e.preventDefault();
      let searchWord = search;

      if (searchTerm) {
         setSearch(searchTerm);
         searchWord = searchTerm;
      }

      const ticketMasterUrl = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
      const ticketMasterKey = "LTtkh2NXZOyGcG6HGOASJH8KgZ4JiKGX"

      ticketMasterUrl.search = new URLSearchParams({
         apikey: ticketMasterKey,
         keyword: searchWord,
         size: 10
      })

      fetch(ticketMasterUrl)
         .then(data => {
            return data.json();
         }).then(jsonData => {
            filterEvents(jsonData);
         })
         .catch(data => {
            filterEvents(data);
            addToWatchList(data);
            console.log("not found");
         })
   };


   // FILTERED DATA
   //in case we need to filter events (by price, selected image etc. before displaying on the page)
   function filterEvents(jsonData) {
      let events = [];

      if (jsonData._embedded) {
         events = jsonData._embedded.events;
      }

      if (events.length > 0) {
         const eventList = (events.map(event => {
            const title = event.name.replace(/[^a-zA-Z0-9 ]/g, "");

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

            return ({ title, type, name, image, date, venue, price, key });
         }));

         setEvents(eventList);
      } else {
         const name = "No events found. Would you like to add to watch-list to search later?";

         const image = "https://i0.wp.com/www.ecommerce-nation.com/wp-content/uploads/2017/08/How-to-Give-Your-E-Commerce-No-Results-Page-the-Power-to-Sell.png?resize=1000%2C600&ssl=1"

         const event = [{ name, image }]

         setEvents(event);
      }
   }

   // console.log(firebaseData);

   useEffect(() => {
      const dbRef = firebase.database().ref();
      setFirebaseRef(dbRef);

      dbRef.on('value', (response) => {
         setFirebaseVal(response.val());
         const nameState = []
         const data = response.val();
         for (let key in data) {
            nameState.push({ key: key, name: data[key] })
         }
         setAllUsers(nameState);
         console.log("firebase updating")

      })
   }, [])

   const addListOnChange = (key, e) => {
      let updateList = createList;
      updateList[key] = e.target.value;
      setCreateList({ ...updateList });
   }

   return (
      <Router>
         <div className="App wrapper">

            <header>
               <h1 className="wrapper" >CONCERT ACCOUNTANT</h1>
               <h2>Planning that one summer roadtrip? Set up a list and see what works for you. Create a list with your budgeted amount and add events in the area! </h2>
            </header>

            <main>
               
                  <Description />

                  <Search
                     submitSearch={submitForm}
                     value={search}
                     onChange={searchQuery}
                  />

               <div className="searchResultsDisplay">

                  <aside className="cornerPiece">
                     <button className = "wButton" onClick={() => {
                        setDispayWatchList(!displayWatchList)
                     }}>WATCHLIST</button>
                     {displayWatchList ? <ol>
                        <p className="yourWatchlist">{userName} saved for later</p>
                        <WatchList
                           saveList={watchList}
                           remove={removeWatchListItem}
                           searchList={submitForm}
                        />
                     </ol> : null}
                  </aside>

                  <div className="userForm">
                     <h3>CREATE YOUR LIST</h3>

                     <UserNameForm
                        userNameInput={userNameInput}
                        value={userNameTemplate}
                        button={setUserNameButton}
                     />

                     <AddLists
                        submitList={(e) => submitNewList(createList, e)}
                        value={createList}
                        onChange={addListOnChange}
                     />

                     <ul className = "userCreatedLists" >
                        <h4>{`User logged in: ${userName}`}</h4>
                        {
                           allLists.map(list => {
                              return (
                                 <li>
                                    <button onClick={(e) => { changeActiveList(list.name, e) }}>
                                       <Link to="/list">{`${list.name}  $${list.budget}`}</Link>
                                    </button>
                                 </li>
                              )
                           })
                        }
                     </ul>

                     <Route exact path="/list">
                        <DisplayEvents
                           remove={removeActiveListItem}
                           events={activeListItems}
                           displayType="listItems"
                        />
                     </Route>

                     <div className="allListForm">
                        <h4>Check Out Other User Lists!</h4>
                        <select name="" id="">
                           {allUsers.map((name) => {
                              return (
                                 <option key={name.key}
                                    onClick={(e) => {
                                       e.preventDefault()
                                       setUserNameTemplate(`${name.key}`);
                                       setUserNameButton();
                                    }}
                                 >
                                    {name.key}
                                 </option>
                              );
                           })}
                        </select>
                     </div>
                  </div>

                  <ul>
                     <DisplayEvents
                        events={events}
                        displayType="searchResults"
                        activeList={activeList}
                        button={{ addToActiveList, addToWatchList }}
                     />
                  </ul>
               </div>
            </main>
            <Footbar/>
         </div>
      </Router>
   );
}

export default App;
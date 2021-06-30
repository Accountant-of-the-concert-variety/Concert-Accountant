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
import UserNameForm from './UserNameForm';
import AddLists from './AddLists';
import firebase from './firebase';

function App() {
   const [events, setEvents] = useState([]);
   const [search, setSearch] = useState("");

   const [usersLists, setUsersLists] = useState([]);
   const [activeList, setActiveList] = useState('');
   const [activeListItems, setActiveListItems] = useState([]);

   const [watchList, setWatchList] = useState([]);
   const [createList, setCreateList] = useState("");

   const [userName, setUserName] = useState("");
   const [userNameTemplate, setUserNameTemplate] = useState("")
   const [userLists, setUserLists] = useState([]);

   console.log("search = " + search);
   console.log(userName);

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

   const createLists = () => {
      console.log(userNameTemplate);
      const dbRef = firebase.database().ref(`${userNameTemplate}/lists`);
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

         setUsersLists(lists);
      })
   }

   function updateUserLists(list) {
      console.log(list);
      const dbRef = firebase.database().ref(`${userNameTemplate}/lists/${list}`);

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

   const removeWatchListItem = (listId) => {
      const dbRef = firebase.database().ref(`${userName}/lists/watchList`);
      dbRef.child(listId).remove();
   }

   // const removeActiveListItem = (listItem) => {
   //    const dbRef = firebase.database().ref(`${userName}/lists/${activeList}/events/${listItem.name}`)
   //    dbRef.child(listItem).remove();
   //    console.log(listItem)
   // }

   function changeActiveList(list) {
      console.log(list);
      setActiveList(list);
      updateUserLists(list)
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
            console.log("not found");
         })
   };

   //in case we need to filter events (by price, selected image etc. before displaying on the page)
   function filterEvents(jsonData) {
      let events = [];

      if (jsonData._embedded) {
         events = jsonData._embedded.events;
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

   useEffect(() => {
      const dbRef = firebase.database().ref();
      dbRef.on('value', (response) => {
         const nameState = []
         const data = response.val();
         for (let key in data) {
            nameState.push({ key: key, name: data[key] })
         }
         setUserLists(nameState);

      })
   }, [])

   const submitList = (e) => {
      e.preventDefault();
      setActiveList(createList);

   }

   const onChange = (e) => {
      e.preventDefault();
      setCreateList(e.target.value);
   }


   return (
      <Router>
         <div className="App">
            <header>
               <h1 className = "wrapper" >CONCERT ACCOUNTANT</h1>
               <h2>Search For Events and Make YOUR LIST</h2>
               <Search
                  submitForm={submitForm}
                  value={search}
                  searchQuery={searchQuery}
               />
   
            </header>

            <main>
               <aside className = "userForm">
                  <h3>Create Your Lists</h3>
                  <UserNameForm
                     userNameInput={userNameInput}
                     userNameTemplate={userNameTemplate}
                     button={setUserNameButton}
                  />

                  <AddLists
                     value={createList}
                     submitList={submitList}
                     onChange={onChange}
                  />

                  <ul>
                     <h4>{`User logged in: ${userName}`}</h4>
                     {
                        usersLists.map(list => {
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
                        remove = {removeActiveListItem}
                        events={activeListItems}
                        displayType="listItems"
                     />
                  </Route>

                  <ol>
                     <WatchList
                        saveList={watchList}
                        remove={removeWatchListItem}
                        searchList={submitForm} />
                  </ol>

                  <div className = "allListForm">
                     <h4>Check Out Other User Lists!</h4>
                     <select name="" id="">
                           {userLists.map((name) => {
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
               </aside>

            <ul>
               <DisplayEvents
                  events={events}
                  displayType="searchResults"
                  activeList={activeList}
                  button={{ addToActiveList, addToWatchList }}
               />
            </ul>
            </main>
         </div>
         
      </Router>
   );
}

export default App;

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
import firebase from './firebase';

function App() {
   const [events, setEvents] = useState([]);
   const [search, setSearch] = useState("");

   const [allLists, setAllLists] = useState([]);
   const [activeList, setActiveList] = useState('');
   const [activeListItems, setActiveListItems] = useState([]);

   const [watchList, setWatchList] = useState([]);
   const [createList, setCreateList] = useState({ name: "", budget: "" });

   const [userName, setUserName] = useState("");
   const [userNameTemplate, setUserNameTemplate] = useState("")
   const [allUsers, setAllUsers] = useState([]);

   const [firebaseRef, setFirebaseRef] = useState();
   const [firebaseVal, setFirebaseVal] = useState({});


   // USERNAME FORM
   const userNameInput = (e) => {
      setUserNameTemplate(e.target.value)
   }
   const setUserNameButton = (e, specificUserName) => {
      if (e) {
         e.preventDefault();
      }

      let newUserName = userNameTemplate;

      if (specificUserName) {
         newUserName = specificUserName;
      }

      setUserName(newUserName);

      if (firebaseRef) {
         firebaseRef.off();
      }

      setWatchList([]);
      setActiveListItems([]);
   }

   useEffect(() => {
      if (!firebaseVal) {
         return;
      }

      let lists = [];

      console.log(firebaseVal);

      const data = firebaseVal.lists;

      for (const list in data) {
         if (list !== "watchList") {
            lists.push({ name: list, budget: data[list].budget });
         }
         updateUserLists(list);
      }

      setAllLists(lists);

      function updateUserLists(list) {

         const newData = firebaseVal.lists[list].events;

         const newState = [];

         if (list === "watchList") {
            for (let key in newData) {
               newState.push({ key: key, name: newData[key] });
            }

            setWatchList(newState);

         } else if (list === activeList) {
            for (const key in newData) {
               newState.push(newData[key])
            }

            setActiveListItems(newState);
         }
      }
   }, [setAllLists, firebaseVal, activeList])



   // CREATE LIST FORM
   // const createLists = () => {
   //    // console.log(userNameTemplate);
   //    // const dbRef = firebaseRef.child(`${userNameTemplate}/lists`);
   //    const dbRef = firebaseRef.child(`/lists`);
   //    // setWatchList([]);
   //    // setActiveListItems([]);

   //    dbRef.on("value", response => {
   //       let lists = [];

   //       for (const list in response.val()) {
   //          if (list !== "watchList") {
   //             lists.push({ name: list, budget: response.val()[list].budget });
   //          }
   //          updateUserLists(list);
   //       }


   //       setAllLists(lists);
   //    })
   // }


   // function updateUserLists(list) {
   //    // console.log(list);
   //    const dbRef = firebase.database().ref(`${userNameTemplate}/lists/${list}/events`);

   //    dbRef.on("value", (response) => {
   //       const newState = [];
   //       const data = response.val();

   //       if (list === "watchList") {
   //          for (let key in data) {
   //             newState.push({ key: key, name: data[key] });
   //          }

   //          setWatchList(newState);

   //       } else if (list === activeList) {
   //          for (const key in data) {
   //             newState.push(data[key])
   //          }

   //          setActiveListItems(newState);
   //       }
   //    });
   // }

   // useEffect(() => {
   //    updateUserLists(activeList);
   //    // eslint-disable-next-line
   // }, [activeList])

   function submitNewList(list, e) {
      e.preventDefault();

      console.log("trying");
      
      if(!userName){
         return;
      }
      if (!list.name) {
         return;
      }

      if (!list.budget) {
         list.budget = 0;
      }
      
      firebaseRef.child(`/lists/${list.name}/budget`).set(list.budget);

      changeActiveList(list.name);
   }

   // ACTIVE LIST BUTTON
   function changeActiveList(list) {
      setActiveList(list);
   }


   // function changeListItems(list, item, type) {
   //    if (!userName) {
   //       return;
   //    }
   //    if (allLists.length === 0) {
   //       return
   //    }

   //    console.log(list, item);

   //    let title = item.title;

   //    if (!item.title) {
   //       title = item;
   //       console.log(title);
   //    }

   //    const firebaseChild = firebaseRef.child(`/lists/${list}/events/${title}`);

   //    if(type === "remove") {
   //       firebaseChild.remove();
   //    } else {
   //       firebaseChild.set(item);
   //    }
   // }


   function removeFromLists(list, item) {
      let title = item.title;

      console.log(item);

      if (!item.title) {
         title = item;
         console.log(title);
      }

      firebaseRef.child(`/lists/${list}/events/${title}`).remove();

      // changeListItems(list, item, "remove")
   }

   function addToLists(list, item) {

      // changeListItems(list, item, "set")

      if (!userName) {
         return;
      }
      if (allLists.length === 0) {
         return
      }

      console.log(list, item);
      let title = item.title;

      if (!item.title) {
         title = item;
         console.log(title);
      }

      firebaseRef.child(`/lists/${list}/events/${title}`).set(item);
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

            let venue = null;
            let venueFile = [];
            let venueName = "";
            let country = "";
            let city = "";

            if (event._embedded) {
               venueFile = event._embedded.venues[0];

               if (venueFile.name)
                  venueName = venueFile.name;

               if (venueFile.country) {
                  country = venueFile.country.countryCode;
               }
               if (venueFile.city) {
                  city = venueFile.city.name;
               }

               venue = {
                  name: venueName,
                  city: city,
                  country: country
               }
            }

            const key = `${userName + event.id}`;

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

   useEffect(() => {
      if (!userName) {
         return
      }

      const dbRef = firebase.database().ref(userName);
      setFirebaseRef(dbRef);

      dbRef.on('value', (response) => {
         setFirebaseVal(response.val());

         if (response.val()) {
            changeActiveList(Object.keys(response.val().lists)[0])
         }

         console.log("updating firebase location")
      })
      console.log("updating firebase useEffect")
   }, [setFirebaseRef, userName])

   useEffect(() => {
      const dbRef = firebase.database().ref();

      dbRef.once('value', (response) => {
         const nameState = []
         const data = response.val();
         for (let key in data) {
            nameState.push({ key: key, name: data[key] })
         }
         setAllUsers(nameState);
         console.log("firebase updating allUsers");
      })
   }, [])

   const addListOnChange = (key, e) => {
      let updateList = createList;
      updateList[key] = e.target.value;
      setCreateList({ ...updateList });
   }

   return (
      <Router>
         <div className="App">
            <header>
               <h1 className="wrapper" >CONCERT ACCOUNTANT</h1>
               <h2>Search For Events and Make YOUR LIST</h2>
            </header>
            <Search
               submitSearch={submitForm}
               value={search}
               onChange={searchQuery}
            />

            <main>
               <aside className="userForm">
                  <h3>Create Your Lists</h3>

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

                  <ul>
                     <h4>{`User logged in: ${userName}`}</h4>
                     {
                        allLists.map(list => {
                           return (
                              <li key={list.name}>
                                 <button onClick={() => { changeActiveList(list.name) }}>
                                    <Link to="/list">{list.name + list.budget}</Link>
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
                        // key={`listItems${Math.random()}`}
                        key={"listItems"}
                        activeList={activeList}
                        button={removeFromLists}
                     />
                  </Route>

                  <ol>
                     <p className="yourWatchlist">Your Watchlist</p>
                     <WatchList
                        saveList={watchList}
                        remove={removeFromLists}
                        searchList={submitForm}
                     />
                  </ol>

                  <div className="allListForm">
                     <h4>Check Out Other User Lists!</h4>
                     <select name="" id="">
                        {allUsers.map((name) => {
                           return (
                              <option key={name.key}
                                 onClick={(e) => {
                                    e.preventDefault()
                                    setUserNameTemplate(`${name.key}`);
                                    setUserNameButton(e, name.key);
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
                     key="searchResults"
                     activeList={activeList}
                     button={addToLists}
                     search={search}
                     userName={userName}
                     allListsCount={allLists.length}
                  />
               </ul>
            </main>
            <Footbar />
         </div>
      </Router>
   );
}

export default App;
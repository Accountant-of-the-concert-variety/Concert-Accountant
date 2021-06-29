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

import { useEffect, useState } from "react";
import "./App.css";
import DisplayEvents from "./DisplayEvents";
import Search from "./Search";
import WatchList from "./WatchList";
import UserList from "./UserList";
import CreateLists from "./CreateLists";
import firebase from "./firebase";

function App() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  const [activeList, setActiveList] = useState("Chicago");
  const [activeListItems, setActiveListItems] = useState([]);
  const [watchList, setWatchList] = useState([]);

  const [userName, setUserName] = useState("");
  const [userNameTemplate, setUserNameTemplate] = useState("");
  const [userLists, setUserLists] = useState([]);


 
  console.log(userName);

  const userNameInput = (e) => {
    e.preventDefault();
    setUserNameTemplate(e.target.value);
  };

  const setUserNameButton = (e) => {
    e.preventDefault();
    setUserName(userNameTemplate);

    console.log("setting userName to " + userNameTemplate);

    const dbRef = firebase
      .database()
      .ref(`${userNameTemplate}/lists/watchList`);

    dbRef.on("value", (response) => {
      const newState = [];
      const data = response.val();
      // console.log(data);

      for (let key in data) {
        newState.push({ key: key, name: data[key] });
      }
      // console.log(newState);
      setWatchList(newState);
      // dbRef.push(userNameInput)
    });
  };

  const removeListItem = (listId) => {
    const dbRef = firebase.database().ref(`${userName}/lists/watchList`);
    dbRef.child(listId).remove();
  };

  function addToActiveList(listItem) {
    const dbRef = firebase
      .database()
      .ref(`${userName}/lists/${activeList}/${listItem.name}`);
    dbRef.set(listItem);
    console.log(listItem);

    setActiveListItems([...activeListItems, listItem]);
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
    // dbRef.push(search);
    let searchWord = search;

    if (searchTerm) {
      setSearch(searchTerm);
      searchWord = searchTerm;
    }
    // console.log(searchWord);

    const ticketMasterUrl = new URL(
      "https://app.ticketmaster.com/discovery/v2/events.json"
    );
    const ticketMasterKey = "LTtkh2NXZOyGcG6HGOASJH8KgZ4JiKGX";

    ticketMasterUrl.search = new URLSearchParams({
      apikey: ticketMasterKey,
      keyword: searchWord,
      size: 5,
    });

    fetch(ticketMasterUrl)
      .then((data) => {
        return data.json();
      })
      .then((jsonData) => {
        filterEvents(jsonData);
      })
      .catch((data) => {
        filterEvents(data);
        // setEvents([]);
        console.log("not found");
      });
    // setSearch("");
  };

  //in case we need to filter events (by price, selected image etc. before displaying on the page)
  function filterEvents(jsonData) {
    let events = [];

    if (jsonData._embedded) {
      events = jsonData._embedded.events;
    }

    if (events.length > 0) {
      setEvents(
        events.map((event) => {
          const name = event.name;
          const date = event.dates.start.localDate;

          const venueName = event._embedded.venues[0].name;
          const country = event._embedded.venues[0].country.countryCode;
          const city = event._embedded.venues[0].city.name;
          // const button = {
          //    button: addToActiveList,
          //    text: `Add to ${activeList} list`
          // }

          const key = `${userName + event.id}`;

          const venue = {
            name: venueName,
            city: city,
            country: country,
          };

          let price = {
            min: 0,
            max: 0,
          };

          if (event.priceRanges) {
            price = {
              min: event.priceRanges[0].min,
              max: event.priceRanges[0].max,
            };
          }

          //update this to choose smallest image. Right now its just the first one
          const image = event.images[0].url;

          return { name, image, date, venue, price, key };
        })
      );
    } else {
      const name =
        "No events found. Would you like to add to watch-list to search later?";

      // const button = {
      //    button: addToWatchList,
      //    text: `Add to watch list`
      // }

      const image =
        "https://i0.wp.com/www.ecommerce-nation.com/wp-content/uploads/2017/08/How-to-Give-Your-E-Commerce-No-Results-Page-the-Power-to-Sell.png?resize=1000%2C600&ssl=1";

      const event = [{ name, image }];

      setEvents(event);
    }
  }

  // const button = {
  //    button: addToActiveList,
  //    text: `Add to ${activeList} list`
  // }

  useEffect(() => {
    const dbRef = firebase.database().ref();
    dbRef.on("value", (response) => {
      const nameState = [];
      const data = response.val();
      for (let key in data) {
        nameState.push({ key: key, name: data[key] });
      }
      setUserLists(nameState);
      console.log(userLists);
    });
  }, []);









   const newList = (e) => {
     activeList(e.target.value);
         const dbRef = firebase.database().ref();
         dbRef.push(newList);
     setActiveList(newList);
   };


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

      <CreateLists
      // submitForm={submitList}
      value={activeList} 
      createList={newList}/>

     


      <div>
        <ul>
          {userLists.map((name) => {
            return (
              <li key={name.key}>
                <p
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
        <p>Your watchlist</p>
        <WatchList
          saveList={watchList}
          remove={removeListItem}
          searchList={submitForm}
        />
      </ol>

      <ul>
        <p onClick={(e) => {
           e.preventDefault();
         //   setActiveList(`${}`)
        }}>Your activelists</p>
        <DisplayEvents events={activeListItems} displayType="listItems" />
      </ul>

      <ul>
        <DisplayEvents
          events={events}
          displayType="searchResults"
          activeList={activeList}
          button={{ addToActiveList, addToWatchList }}
        />
      </ul>
    </div>
  );
}

export default App;

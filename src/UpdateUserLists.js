// import { useEffect } from "react";
// import firebase from './firebase';

// function UpdateUserLists({ list, userName, activeList }) {
//    useEffect(() => {
//       console.log(list);
//       const dbRef = firebase.database().ref(`${userName}/lists/${list}/events`);
//       const newState = [];

//       dbRef.on("value", (response) => {
//          const data = response.val();

//          if (list === "watchList") {
//             for (let key in data) {
//                newState.push({ key: key, name: data[key] });
//             }

//             // setWatchList(newState);

//          } else if (list === activeList) {
//             for (const key in data) {
//                newState.push(data[key])
//             }
//             console.log(newState);

//             // setActiveListItems(newState);
//          }

//          console.log(activeList);
//       });

//       console.log(newState)
//       return newState;
//    }, [])
// }

// export default UpdateUserLists;
// import { useEffect } from "react";
// import firebase from './firebase';

// function UpdateLists() {
//    useEffect(() => {
//       console.log(userName);
//       const dbRef = firebase.database().ref(`${userName}/lists`);
//       setWatchList([]);
//       setActiveListItems([]);

//       dbRef.on("value", response => {
//          let lists = [];

//          for (const list in response.val()) {
//             if (list !== "watchList") {
//                lists.push(list);
//             }
//             updateUserLists(list);
//          }

//          setAllLists(lists);
//       })
//    })
// }

// export default UpdateLists;
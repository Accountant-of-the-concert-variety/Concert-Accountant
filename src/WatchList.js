function WatchList (props) {
   const {saveList, remove, searchList} = props
   
   return (
      saveList.map(list => {
         return (
         <li key = {list.key}>
            <p onClick = { (e) => searchList(e, list.name)}>
               {list.name}
               <button onClick = { () => remove(list.key) }>
                  x
               </button>
            </p>
         </li>
         )
      })
   )
}

export default WatchList;
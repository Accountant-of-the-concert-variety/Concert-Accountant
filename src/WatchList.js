function WatchList (props) {
   const {saveList, remove, searchList} = props
   
   return (
      saveList.map(list => {
         return (
            <li key={list.key} className="watchList">
               <p onClick={(e) => searchList(e, list.name)} className="watchListItem">
                  {list.name}
                  <button onClick={() => remove(list.key)} className="removeButton">
                     x
                  </button>
               </p>
            </li>
         )
      })
   )
}

export default WatchList;
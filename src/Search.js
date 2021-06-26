const Search = ({submitForm, search, searchQuery}) => {
   return (
   <form onSubmit={submitForm}>
   <i className="fas fa-search"></i>
   <label className="sr-only" htmlFor="searchEvent">Search for an event</label>
   <input
     className="search"
     type="search"
     placeholder="Search for an event.."
     value={search}
     onChange={searchQuery}
     />
   </form>
   )
}

export default Search;
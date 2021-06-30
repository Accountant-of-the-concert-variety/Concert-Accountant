const Search = ({ submitSearch, value, searchOnChange }) => {
   return (
      <form onSubmit={submitSearch}>
         <label className="sr-only" htmlFor="searchEvent">Search for an event</label>
         <input
            className="search"
            type="search"
            placeholder="Search for an event.."
            value={value}
            onChange={searchOnChange}
         />
      </form>
   )
}

export default Search;
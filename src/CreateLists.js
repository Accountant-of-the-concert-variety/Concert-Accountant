const Search = ({ submitForm, search, createLists }) => {
   return (
      <form onSubmit={submitForm}>
         <label className="sr-only" htmlFor="searchEvent">
            Create a list
         </label>
         <input
            className="search"
            type="search"
            placeholder="Create a list"
            value={search}
            onChange={createLists}
         />
      </form>
   );
};

export default Search;

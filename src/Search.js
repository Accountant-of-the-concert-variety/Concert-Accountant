const Search = ({ submitSearch, value, onChange }) => {
  return (
    <form onSubmit={submitSearch}>
      <label className="sr-only" htmlFor="searchEvent">
        Search for an event
      </label>
      <input
        className="search"
        type="search"
        placeholder="Search for an event.."
        value={value}
        onChange={onChange}
      />
    </form>
  );
};

export default Search;

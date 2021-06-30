const NewList = ({ submitList, value, listNameOnChange, }) => {
   return (
      <form onSubmit={submitList}>
         <label className="sr-only" htmlFor="addList">
            Add a list
         </label>
         <input
            className="addList"
            type="text"
            placeholder="Add a new list"
            value={value}
            onChange={listNameOnChange}
         />
         <input
            className="budget"
            type="number"
            placeholder="Enter a budget"
         // value={}
         // onchange={}/>
         />


         <button>Create List</button>
      </form>
   );
};

export default NewList;

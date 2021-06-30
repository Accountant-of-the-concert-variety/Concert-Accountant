const AddLists = ({ submitList, value, onChange, number, updateNumber }) => {
   return (
      <form onSubmit={submitList} className = "createListForm">
         <label className="sr-only" htmlFor="addList">
            Add a list
         </label>
         <div>
            <input
               className="addList"
               type="text"
               placeholder="Add a new list"
               value={value}
               onChange={onChange}
            />
            <input
               className="budget"
               type="number"
               placeholder="Enter a budget"
               value={number}
               onchange={updateNumber}/>
      
         </div>

         <button>Create List</button>
      </form>
   );
};

export default AddLists;

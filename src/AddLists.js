const AddLists = ({ submitList, value, onChange }) => {
   return (
      <form onSubmit={submitList} className = "createListForm">
         <div>
         <label className="sr-only" htmlFor="nameTitle">
            Name your list
         </label>
            <input
               className="addList"
               type="text"
               placeholder="Add a new list"
               value= {value.name}
               onChange={onChange}
            />
         <label className ="sr-only" htmlFor="budgetNumber">Add a budget</label>
            <input
               className="budget"
               type="number"
               placeholder="Enter a budget"
               value={value.budget}
               onChange={onChange}/>
         </div>

         <button>Create List</button>
         
      </form>
   );
};

export default AddLists;

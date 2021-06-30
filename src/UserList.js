const UserNameForm = ({ submitUserName, value, userNameOnChange }) => {
   return (
      <fieldset>
         <form onSubmit={submitUserName}>
            <label className="sr-only" htmlFor="name">enter user name</label>
            <input
               className="name"
               type="text"
               placeholder="enter user name"
               value={value}
               onChange={userNameOnChange}
            />
            {/* // <label className="sr-only" htmlFor="budget">enter user budget</label>
         // <input */}
            {/* //    className="budget"
         //    type="text"
         //    placeholder="enter budget"
         //    value = {userName}
         // /> */}
            <input type="submit" />
         </form>
      </fieldset>
   )
}

export default UserNameForm;
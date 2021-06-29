const UserList = ({ userNameInput, userNameTemplate, button }) => {
   return (
      <fieldset>
         <form onSubmit={button}>
            <label className="sr-only" htmlFor="name">enter user name</label>
            <input
               className="name"
               type="text"
               placeholder="enter user name"
               value={userNameTemplate}
               onChange={userNameInput}
            />
            <input type="submit" />
         </form>
      </fieldset>
   )
}

export default UserList;
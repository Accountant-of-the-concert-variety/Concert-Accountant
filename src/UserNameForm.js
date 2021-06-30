const UserNameForm = ({ userNameInput, userNameTemplate, button }) => {
   return (
      <fieldset >
         <form onSubmit={button} className="logInForm">
            <label className="sr-only" htmlFor="name">enter user name</label>
            <input
               className="name"
               type="text"
               placeholder="enter user name"
               value={userNameTemplate}
               onChange={userNameInput}
            />
            <button>Submit</button>
         </form>
      </fieldset>
   )
}

export default UserNameForm;
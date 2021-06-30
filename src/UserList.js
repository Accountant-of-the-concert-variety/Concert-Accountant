<<<<<<< HEAD
const UserList = ({userNameInput, userNameTemplate, button}) => {
=======
const UserNameForm = ({ userNameInput, userNameTemplate, button }) => {
>>>>>>> 44f1c0aff7a1ee9dd47673adb5a855acb44f82b5
   return (
      <fieldset>
      <form onSubmit = {button}>
         <label className="sr-only" htmlFor="name">enter user name</label>
         <input
            className="name"
            type="text"
            placeholder="enter user name"
            value = {userNameTemplate}
            onChange = {userNameInput}
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
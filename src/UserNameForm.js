const UserNameForm = ({ userNameInput, value, button }) => {
  return (
    <fieldset>
      <form onSubmit={button} className="logInForm">
        <label className="sr-only" htmlFor="name">
          enter user name
        </label>
        <input
          className="name"
          type="text"
          placeholder="enter user name"
          value={value}
          onChange={userNameInput}
        />
        <button>Submit</button>
      </form>
    </fieldset>
  );
};

export default UserNameForm;

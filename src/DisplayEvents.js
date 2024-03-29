import "./App.css";

function DisplayEvents({ events, displayType, activeList, button, search, userName, allListsCount }) {
   const domButton = {};

   const eventItems = events.map((event) => {
      const { type, name, image, date, venue, price, key } = event;

      const eventName = <p className="eventName">{name}</p>;
      const eventDate = (
         <p>
            <i className="far fa-calendar-times"></i>
            {date}
         </p>
      );
      const eventPrice = () => {
         if (price) {
            let domPrice = (
               <p>
                  ${price.min} - ${price.max}
               </p>
            );

            if (price.min === price.max) {
               domPrice = <p>${price.min}</p>;
            }

            return domPrice;
         } else {
            return null;
         }
      };

      let eventVenue = () => {
         if (venue) {
            return (
               <div>
                  <p>
                     <i className="fas fa-location-arrow"></i>
                     {venue.name}
                  </p>
                  <p>
                     <i className="far fa-flag"></i>
                     {venue.city}, {venue.country}
                  </p>
               </div>
            );
         }
      };

      const eventImage = <img src={image} alt={name} />;

      let displayItem = {};

      if (displayType === "searchResults") {
         if (type === "event") {
            domButton.button = () => button(activeList, event);
            domButton.text = `Add to "${activeList}" list`;
         } else {
            domButton.button = () => button("watchList", search);
            domButton.text = `Add to watch list`;
         }

         if (!userName) {
            domButton.text = `Please sign in first`
         } else if (allListsCount === 0) {
            domButton.text = `Please add a new list`
         } else if (!activeList) {
            domButton.text = 'Please select a list'
         }

         displayItem = (
            <li className="searchResult" key={key}>
               {/* {console.log("rerender")} */}

               <div className="flex-container">
                  <div className="image-container">{eventImage}</div>
                  <div className="text-container">
                     {eventName}
                     {eventDate}
                     {eventVenue()}
                     {eventPrice()}

                     <button
                        className="btn btn-2 btn-2g"
                        onClick={domButton.button}
                     >
                        {domButton.text}
                     </button>
                  </div>
               </div>
            </li>
         );
      } else if (displayType === "listItems") {
         domButton.button = () => button(activeList, event)
         domButton.text = "x";

         displayItem = (
            <div className="eventObject" >
               <button
                  onClick={domButton.button}
               >
                  {domButton.text}
               </button>
               <li className="activeListItem" key={`${userName}${activeList}-${key}`}>
                  <div>
                     {eventName}
                     {eventPrice()}
                  </div>
                  {eventImage}
               </li>

            </div>
         );
      }
      return displayItem;
   });

   return eventItems;
}

export default DisplayEvents;

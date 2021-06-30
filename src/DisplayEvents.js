import './App.css';

function DisplayEvents({ events, displayType, activeList, button, remove}) {
   const domButton = {};

   const eventItems = events.map((event) => {
      const { type, name, image, date, venue, price, key } = event;

      const eventName = <p>{name}</p>;
      const eventDate = <p>{date}</p>;
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
                  <p>{venue.name}</p>
                  <p>{venue.city}</p>
                  <p>{venue.country}</p>
               </div>
            );
         }
      };

      const eventImage = <img src={image} alt={name} />;

      let displayItem = {};

      if (displayType === "searchResults") {
         if (type === "event") {
            domButton.button = button.addToActiveList;
            domButton.text = `Add to ${activeList} list`;
            console.log("adding to my list");
         } else {
            domButton.button = button.addToWatchList;
            domButton.text = `Add to watch list`;
            console.log("adding to watch list");
         }

         displayItem = (
            <li className="searchResult" key={`searchResults${key}`}>
               <div className="image-container">{eventImage}</div>

               {console.log("rerender")}

               <div className="flex-container">
                  {eventName}
                  {eventDate}
                  {eventVenue()}
                  {eventPrice()}
                  <button
                     onClick={() => {
                        domButton.button(event);
                     }}
                  >
                     {domButton.text}
                  </button>
               </div>
            </li>
         );
      } else if (displayType === "listItems") {
         displayItem = (
            <div>
               <h4>{} LIST</h4>
            <li className="activeListItem" key={`listItem${key}`}>
               <div>
                  {eventName}
                  {eventPrice()}
               </div>
               {eventImage}
            </li>
               {/* <button onClick={() => remove(displayItem.eventName)}>x</button> */}
            
            </div>
         );
      }
      // console.log(eventName.key)
      return displayItem;
   });

   return <>{eventItems}</>;
}

export default DisplayEvents;

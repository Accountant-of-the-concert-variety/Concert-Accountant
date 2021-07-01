function DisplayEvents({ events, displayType, activeList, button }) {
   const eventButton = {};
   
   
   const eventItems = events.map(event => {
      const { type, name, image, date, venue, price, key } = event;
      
      // console.log("events = " + event.type)

      const eventName = <p>{name}</p>;
      const eventDate = <p>{date}</p>
      const eventPrice = () => {
         if (price) {
            let domPrice = <p>${price.min} - ${price.max}</p>

            if (price.min === price.max) {
               domPrice = <p>${price.min}</p>
            }

            return (domPrice);

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
            )
         }
      };

      const eventImage = <img src={image} alt={name} />

      let displayItem = {};

      if (displayType === "searchResults") {

         if (type === "event") {
            eventButton.button = button.addToActiveList;
            eventButton.text = `Add to "${activeList}" list`
            // console.log('adding to my list')
         } else {
            eventButton.button = button.addToWatchList;
            eventButton.text = `Add to watch list`
            // console.log('adding to watch list')
         }

         displayItem =
            <li
               className="searchResult"
               key={`searchResults${key}`}
            >
               <div className="image-container">
                  {eventImage}
               </div>

               {/* {console.log("rerender")} */}

               <div className="flex-container">
                  {eventName}
                  {eventDate}
                  {eventVenue()}
                  {eventPrice()}
                  <button onClick={() => { eventButton.button(event) }}>{eventButton.text}</button>
               </div>

            </li>
      } else if (displayType === "listItems") {
         console.log("Check")

         displayItem =
            < li
               className="active-list-item"
               key={`listItem${key}`}
            >
               {eventName}
            </li >
      }

      return (displayItem)
   })

   return (
      <>
         {eventItems}
      </>
   )
}

export default DisplayEvents;
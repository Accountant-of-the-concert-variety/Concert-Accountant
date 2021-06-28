function DisplayEvents({ events, displayType }) {

   const eventItems = events.map(event => {
      const { name, image, date, venue, price, button, key } = event;

      const eventName = <p>{name}</p>;
      const eventDate = <p>{date}</p>
      let eventPrice = null;
      let eventVenue = null;

      const eventImage =
         <img src={image} alt={name} />

      if (price) {
         eventPrice = <p>${price.min} - ${price.max}</p>

         if (price.min === price.max) {
            eventPrice = <p>${price.min}</p>
         }
      }

      if (venue) {
         eventVenue =
            <div>
               <p>{venue.name}</p>
               <p>{venue.city}</p>
               <p>{venue.country}</p>
            </div>
      }

      let displayItem = {};

      if (displayType === "searchResults") {
         displayItem =
            <li className="searchResult" key={key}>
               <div className="image-container">
                  {eventImage}
               </div>

               <div className="flex-container">
                  {eventName}
                  {eventDate}
                  {eventPrice}
                  <button onClick={button}>Add to List</button>
               </div>

            </li>
      } else if (displayType === "listItems") {
         displayItem =
            < li className="listItem" >
               <div className="image-container">
                  {eventImage}
                  {eventName}
               </div>

            </li >
      }

      // console.log(displayItem)

      return (displayItem)
   })

   // console.log(eventItems);

   return (
      <>
         {eventItems}
      </>
   )
}

export default DisplayEvents;
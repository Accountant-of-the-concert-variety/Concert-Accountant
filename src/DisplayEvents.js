function DisplayEvents({ events, displayType }) {

   const eventItems = events.map(event => {
      const { name, image, date, venue, price, button, key } = event;

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

      const eventImage =
         <img src={image} alt={name} />



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
                  {eventVenue()}
                  {eventPrice()}
                  <button onClick={() => { button.addToActiveList({ name, image, date, venue, price, key }) }}>{button.text}</button>
               </div>

            </li>
      } else if (displayType === "listItems") {
         displayItem =
            < li className="active-list-item" >
               {eventName}
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
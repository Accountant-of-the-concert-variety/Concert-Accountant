function DisplayEvents({ events, displayType }) {

   const eventItems = events.map(event => {
      const { name, image, date, venue, price, button, key } = event;

      const domName = <p>{name}</p>;
      const domDate = <p>{date}</p>
      const domImage = <img src={image} alt={name} />
      let domPrice = null;

      if (price) {
         domPrice = <p>${price.min} - ${price.max}</p>
         
         if(price.min === price.max) {
            domPrice = <p>${price.min}</p>
         }
      }

      let displayItem =
         <li className="event" key={key}>
            <div className="image-container">
               <img src={image} alt={name} />
            </div>
            {domName}
            {domDate}
            {domPrice}

            {!venue ? null :
               <div>
                  <p>{venue.name}</p>
                  <p>{venue.city}</p>
                  <p>{venue.country}</p>
               </div>
            }

            <button onClick={button}>Add to Watch List</button>
         </li>

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
function DisplayEvents({ events, displayType }) {

   const eventItems = events.map(event => {
      const { name, image, date, venue, price, button, key } = event;

      let displayItem =
         <li className="event" key = {key}>
            <p>{name}</p>
            <div className="image-container">
               <img src={image} alt={name} />
            </div>
            <p>{date}</p>

            {/* //if min and max are the same, only show one */}
            <p>${price.min} - ${price.max}</p>

            <div>
               <p>{venue.name}</p>
               <p>{venue.city}</p>
               <p>{venue.country}</p>
            </div>

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
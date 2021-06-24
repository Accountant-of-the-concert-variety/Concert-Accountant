import logo from './logo.svg';
import './App.css';

//Allow user to create list
//list name and budget

//stretch goals
//filter through images to decide which pic to use

function App() {

   

   $.ajax({
      type: "GET",
      url: "https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=LTtkh2NXZOyGcG6HGOASJH8KgZ4JiKGX",
      async: true,
      dataType: "json",
      success: function (json) {
         console.log(json);
         // Parse the response.
         // Do other things.
      },
      error: function (xhr, status, err) {
         // This time, we do not end up here!
      }
   });


   return (
      <div className="App">

         {

         }


      </div>
   );
}

export default App;

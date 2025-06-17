console.log("Running!");

function getWeather(city, state){
    console.log(city + ", " + state);
    fetch("https://nominatim.openstreetmap.org/search?city="+ city +"&state="+ state +"&format=json")
        .then(Response =>{
            if(!Response.ok){
                console.error("Failed openstreetmap Api Call");
            }
            return Response.json();
        })
        .then(data =>{
            if(data.length == 0){
                console.error("No Matches");
                return;
            }

            const lat = data[0].lat;
            const lon = data[0].lon;

            console.log(lat + ", " + lon)
        })
}
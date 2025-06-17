console.log("Running!");
const loadingIconContainer = document.getElementById("loadingIcon");
loadingIconContainer.innerHTML = "";

function getWeather(city, state){
    loadingIconContainer.innerHTML = '<div class="loader"></div>';
    console.log(city + ", " + state);
    fetch("https://nominatim.openstreetmap.org/search?city="+ city +"&state="+ state +"&format=json")
        .then(Response =>{
            if(!Response.ok){
                console.error("Failed openstreetmap Api Call");
                loadingIconContainer.innerHTML = "";
            }
            return Response.json();
        })
        .then(data =>{
            if(data.length == 0){
                console.error("No Matches");
                loadingIconContainer.innerHTML = "";
                return;
            }

            const lat = data[0].lat;
            const lon = data[0].lon;

            console.log(lat + ", " + lon)
            fetch("https://api.weather.gov/points/"+ lat +","+lon)
                .then(Response =>{
                    if(!Response.ok){
                        console.error("Failed weather Api Call");
                        loadingIconContainer.innerHTML = "";
                    }
                    return Response.json();
                })
                .then(data =>{
                    fetch(data.properties.forecast)
                    .then(res => res.json())
                    .then(forecastData => {
                        console.log("7-Day Forecast:", forecastData);
                        displayForecast(forecastData);
                    })
                })
        })
}

function displayForecast(forecast) {
    const forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = "";

    const periods = forecast.properties?.periods;

    periods.slice(0, 7).forEach(period => {
        const day = document.createElement("div");
        day.classList.add("day");

        const rainChance = period.probabilityOfPrecipitation?.value;
        const rainText = rainChance != null ? rainChance + "%" : "N/A";

        day.innerHTML = `
            <h3>${period.name}</h3>
            <img src="${period.icon}" alt="${period.shortForecast}">
            <p>${period.shortForecast}</p>
            <p>Temp: ${period.temperature}°${period.temperatureUnit}</p>
            <p>Precipitation: ${rainText}</p>
            <p>Wind: ${period.windSpeed} ${period.windDirection}</p>
        `;

        forecastContainer.appendChild(day);
        loadingIconContainer.innerHTML = "";
    });
}

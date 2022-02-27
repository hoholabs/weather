let input = document.querySelector('input');
let button = document.querySelector('button');

button.addEventListener('click', ()=>{
    showWeather(getWeather());
});

async function getWeather(){

    //Use geocode API to get lat and lon from input
    const units = "imperial"
    const locResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${input.value}&limit=5&appid=127a7807fe4ed3c75fbfbbfde9368206`);
    const location = await locResponse.json();
    const lat = await location[0].lat;
    const lon = await location[0].lon;

    //fetch weather data using lat and lon
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=127a7807fe4ed3c75fbfbbfde9368206`);
    const weather = await response.json();

    //console.log(weather);

    return weather;
}

function convertTemp(K){
    let C = Math.round((K-273.15)*10)/10 ;
    let F  = Math.round((C * 9/5 + 32)*10)/10 ;

    return [C,F];

}

function convertWind(deg){
    var val = Math.floor((deg / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}

async function showWeather(promise){
    let report = await promise;
    console.log(report);

    let city = await report.name;
    let temp = await report.main.temp;
    let desc = await report.weather[0].description;
    let windSpeed = await report.wind.speed;
    let windDir = await report.wind.deg;
    console.log(desc);

    let cityDiv = document.getElementById("city");
    let tempDiv = document.getElementById("temp");
    let descDiv = document.getElementById("desc");
    let windDiv = document.getElementById("wind");

    cityDiv.textContent = city
    tempDiv.textContent = Math.round(temp*10)/10+"°";
    descDiv.textContent = desc;
    //windDiv.textContent = Math.round(windSpeed)+"mph"+windDir;
    windDiv.textContent = Math.round(windSpeed)+"mph"+convertWind(windDir);


}
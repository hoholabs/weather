let input = document.querySelector('input');
let button = document.querySelector('button');

button.addEventListener('click', ()=>{
    showWeather(getWeather());
});

input.addEventListener("keyup", ()=> {

    if (event.keyCode === 13){
        showWeather(getWeather());
    }

});

let units = "imperial"

let fBtn = document.getElementById('fBtn');
let cBtn = document.getElementById('cBtn');

fBtn.addEventListener('click', ()=>{
    units = "imperial";
    fBtn.style.color = "var(--color2)";
    fBtn.style.backgroundColor = "var(--color1)";

    cBtn.style.color = "var(--color1)";
    cBtn.style.backgroundColor = "var(--color2)";

    showWeather(getWeather());
})

cBtn.addEventListener('click', ()=>{
    units = "metric";
    cBtn.style.color = "var(--color2)";
    cBtn.style.backgroundColor = "var(--color1)";

    fBtn.style.color = "var(--color1)";
    fBtn.style.backgroundColor = "var(--color2)";

    showWeather(getWeather());
})


async function getWeather(){

    //Use geocode API to get lat and lon from input
    
    const locResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${input.value}&limit=5&appid=127a7807fe4ed3c75fbfbbfde9368206`);
    const location = await locResponse.json();

    //add a part in here that lets user selct city from the returned array
    //uses location at array[0] for now

    const lat = await location[0].lat;
    const lon = await location[0].lon;

    //fetch weather data using lat and lon
    const weatherResponse = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=127a7807fe4ed3c75fbfbbfde9368206`);
    const weather = await weatherResponse.json();

    //fetch forecast data

    const forecastResponse = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=127a7807fe4ed3c75fbfbbfde9368206`);
    const forecast = await forecastResponse.json()

    return [weather,forecast];
}

function convertTemp(K){
    let C = Math.round((K-273.15)*10)/10 ;
    let F  = Math.round((C * 9/5 + 32)*10)/10 ;

    return [C,F];
};

function convertWind(deg){
    var val = Math.floor((deg / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
};

async function showWeather(promise){
    clearWeather();
    let spinner = document.getElementById("spinner");
    spinner.style.display = "inline";

    let array = await promise;
    spinner.style.display = "none";
    let report = array[0];
    //let forecast = array[1];
    console.log(report);


    let temp =  report.main.temp;
    let prec =  report.weather[0].main;
    let precType = prec.toLowerCase();
    let precAmt = report[precType]["1h"];
    let desc =  report.weather[0];
    let windSpeed =  report.wind.speed;
    let windDir =  report.wind.deg;

    let tempDiv = document.getElementById("temp");
    let precDiv = document.getElementById("prec");
    let descDiv = document.getElementById("desc");
    let windDiv = document.getElementById("wind");

    //precipitarion
    precDiv.textContent = prec;

    //Temp
    tempDiv.textContent = Math.round(temp*1)/1+"°";

    //Description
    descDiv.textContent = desc.description + precipitation(precAmt);
    let icon = document.createElement('img');
    icon.src = `http://openweathermap.org/img/wn/${desc.icon}@2x.png`;
    descDiv.append(icon);


    let windText = document.createElement('span');
    windText.textContent = `${Math.round(windSpeed)}mph\n${convertWind(windDir)}`;

    let windArrow = document.createElement('div')
    windArrow.id = 'windArrow';
    windArrow.style.transform = `rotate(${windDir}deg)`

    windDiv.append(windText);
    windDiv.append(windArrow);



}

function clearWeather(){
    let tempDiv = document.getElementById("temp");
    let precDiv = document.getElementById("prec");
    let descDiv = document.getElementById("desc");
    let windDiv = document.getElementById("wind");

    precDiv.textContent = ""
    tempDiv.textContent = ""
    descDiv.textContent = ""
    windDiv.textContent = ""
    console.log(windDiv);
}

function precipitation(precAmt){


    return precAmt
}

showWeather(getWeather());
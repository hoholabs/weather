let input = document.querySelector('input');
input.value = "";
let button = document.querySelector('button');
let nav = document.querySelector('nav');
let current = document.getElementById('current');
let mainDiv = document.getElementById('mainDiv');

button.addEventListener('click', ()=>{
    selectLocation();
});

input.addEventListener("keyup", ()=> {

    if (event.keyCode === 13){
        selectLocation();
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

async function selectLocation(){
    clearWeather();

    //Use geocode API to get lat and lon from input
    const locResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${input.value}&limit=5&appid=127a7807fe4ed3c75fbfbbfde9368206`);
    const location = await locResponse.json();

    if (location.length>1){
        let locationsDiv = document.createElement('div');
        i=0;
            location.forEach(element => {
            let selection = document.createElement('button');
            console.log(element.name);
            if (element.state == null){
                selection.textContent = element.name;
            } else{
            selection.textContent = `${element.name}, ${element.state}`
            }
            selection.setAttribute('data-loc', i);
            selection.classList.add('locSelection');
            i++
            selection.addEventListener('click', chooseLocation);
            locationsDiv.append(selection);
        });
        locationsDiv.id = "locations";
        nav.append(locationsDiv);
        //mainDiv.insertBefore(locationsDiv, current);

    }
    function chooseLocation(e){
        clearWeather();
        let spinner = document.getElementById("spinner");
        spinner.style.display = "inline";

        let arrayPos = e.target.dataset.loc;
        input.value = `${location[arrayPos].name}, ${location[arrayPos].state}`
        let lat = location[arrayPos].lat;
        let lon = location[arrayPos].lon

    getWeather(lat, lon)
    }
}

async function getWeather(lat, lon){


    //fetch weather data using lat and lon
    const weatherResponse = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=127a7807fe4ed3c75fbfbbfde9368206`);
    const weather = await weatherResponse.json();

    //fetch forecast data

    const forecastResponse = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=127a7807fe4ed3c75fbfbbfde9368206`);
    const forecast = await forecastResponse.json()

    //return [weather,forecast];

    showWeather(weather);
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

    let array = await promise;

    spinner.style.display = "none";
    let report = array;
    //let forecast = array[1];

    let temp =  report.main.temp;
    let tempFeels = Math.round(report.main.feels_like);
    let prec =  report.weather[0].main;

    let precType = prec.toLowerCase();

    //let precAmt = report[precType]["1h"];
    let desc =  report.weather[0];
    let windSpeed =  report.wind.speed;
    let windDir =  report.wind.deg;

    let tempDiv = document.getElementById("temp");
    let precDiv = document.getElementById("prec");
    let descDiv = document.getElementById("desc");
    let windDiv = document.getElementById("wind");

    //precipitarion

    //precDiv.textContent = precipitation(precAmt,prec);


    //Temp
    tempDiv.textContent = Math.round(temp*1)/1+"°";
    let feelSpan = document.createElement('span');
    feelSpan.textContent = `feels like ${tempFeels}°`;
    tempDiv.append(feelSpan);

    //Description



    descDiv.textContent = desc.description + " " 
    let icon = document.createElement('img');
    icon.src = `http://openweathermap.org/img/wn/${desc.icon}@2x.png`;
    descDiv.append(icon);

    //Wind

    let windUnits =""
    
    if(units == "imperial"){
        windUnits = "mph";
    } else if (units == "metric"){
        windUnits = "m/s"
    };

    
    let windText = document.createElement('span');
    windText.textContent = `${Math.round(windSpeed)} ${windUnits}\n${convertWind(windDir)}`;

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

    let locations = document.querySelectorAll('.locSelection');
    locations.forEach(element => {
        element.remove();
    });
}

function precipitation(precAmt,prec){

    if(precAmt == null){
        return "";
    }
    return `${prec} \n ${precAmt} in/h`;

}

// showWeather(getWeather());
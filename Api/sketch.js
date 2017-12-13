var input;
var button;

var elements = [];

var APIKEY = '' //Enter your api key from openweathermap.org

function setup() {
    noCanvas()
    input = createInput('Enter City');
    button = createButton('Go');

    button.mousePressed(update);

    elements.push(createElement('h1', ''));
    elements.push(createElement('h2', ''));
    elements.push(createDiv(''));
    elements.push(createDiv(''));
    elements.push(createElement('h2', ''));
    elements.push(createDiv(''));
    elements.push(createDiv(''));
    elements.push(createDiv(''));
    elements.push(createDiv(''));
    elements.push(createDiv(''));
    elements.push(createElement('h2', ''));
    elements.push(createDiv(''));
    elements.push(createDiv(''));
    elements.push(createElement('h2', ''));
    elements.push(createElement('h2', ''));
    elements.push(createDiv(''));
    elements.push(createDiv(''));
    //createCanvas(200, 200);
    loadJSON('http://api.openweathermap.org/data/2.5/weather?q=USA&APPID=' + APIKEY, gotData, 'jsonp');
}

function gotData(data) {
    elements[0].html(data.name + ', ' + data.sys.country +  ':');
    elements[1].html('Coordinates:');
    elements[2].html('Longitude: ' + data.coord.lon);
    elements[3].html('Latitude: ' + data.coord.lat);
    elements[4].html('Statistics:');
    elements[5].html("Current Temprature: " + (int(data.main.temp) - 273) + 'C');
    elements[6].html("Maximum Temprature: " + (int(data.main.temp_max) - 273) + 'C');
    elements[7].html("Minimum Temprature: " + (int(data.main.temp_min) - 273) + 'C');
    elements[8].html("Pressure: " + (data.main.pressure) + 'KPa');
    elements[9].html("Humidity: " + (data.main.humidity) + '%');
    elements[10].html('Wind:');
    elements[11].html("Wind Speed: " + (data.wind.speed) + 'm/s');
    elements[12].html("Wind Bearing: " + (data.wind.deg) + ' degrees');
    elements[13].html('Weather Description: ' + data.weather[0].description);
    elements[14].html("Sunrise/Sunset:");
    var d = new Date(data.sys.sunrise *1000);
    elements[15].html('Sunrise: ' + d.getHours() + ':' + d.getMinutes() + 'AM');
    var d = new Date(data.sys.sunset * 1000);
    elements[16].html('Sunset: ' + (d.getHours() - 12) + ':' + d.getMinutes() + 'PM');
}

function update() {
    loadJSON('http://api.openweathermap.org/data/2.5/weather?q=' + input.value() + APIKEY, gotData, 'jsonp');
}

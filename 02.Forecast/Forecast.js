function attachEvents(){

    // TODO - onclick - make a GET request
    // take text from input field
    // process the response from the GET request - find the corresponding location code.
    // display weather forecast
    let url = 'https://judgetests.firebaseio.com/';  // --->  Locations in firebase - London, Barcelona, New York
    const symbols = {
        'Sunny': '&#x2600;',
        'Partly sunny': '&#x26C5;',
        'Overcast': '&#x2601;',
        'Rain': '&#x2614;'
    }
    $('#submit').click(weather);
   // let currentCode;
   function weather(){
    let location = $('#location').val();
    $.get(url+'locations.json')
        .then(getWeather);

    function getWeather(codes){
        let code = undefined;
        for( let loc of codes){
            if(loc.name == location){
                code = loc.code;
                break;
            }
        }   
        Promise.all([
            $.get(`${url}forecast/today/${code}.json`),
            $.get(`${url}forecast/upcoming/${code}.json`)
            
        ]).then(handleForecast)  
    }
    function handleForecast([today, upcoming]){
        const todayDiv = $('#current');
        const upcomingDiv = $('#upcoming')
        const symbol = symbols[today.forecast.condition];
        
        
        const htmlSymbol = `<span class="condition symbol">${symbol}</span>`;
        const htmlContent = `
        <span class = "condition">
            <span class="forecast-data">${today.name}</span>
            <span class="forecast-data">${today.forecast.low}&#176 / ${today.forecast.high}&#176</span>
            <span class="forecast-data">${today.forecast.condition}</span>
        </span>`;
        todayDiv.empty();
        todayDiv.append('<div class="label">Current conditions</div>');
        todayDiv.append(htmlSymbol);
        todayDiv.append(htmlContent);

        upcomingDiv.empty();
        upcomingDiv.append('<div class="label">Three-day forecast</div>');
        for(let day of upcoming.forecast){
            upcomingDiv.append(renderUpcoming(day));
        }
        $('#forecast').show();
        }
        function renderUpcoming(data){
        const symbol = symbols[data.condition];
      
        return `<span class = "upcoming">
            <span class="symbol">${symbol}</span>
            <span class="forecast-data">${data.low}&#176 / ${data.high}&#176</span>
            <span class="forecast-data">${data.condition}</span>
        </span>`;     
        }
   }
}
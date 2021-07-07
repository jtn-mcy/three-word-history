
var apiKey = '&apiKey=c7f77b1aac9843b6b86b9cf855938226'; //apikey
var userInput = 'google' //searchInput.value
var newsApiBase = 'https://newsapi.org/v2/top-headlines?country=us'; //base link to add from
var newsApiURL = newsApiBase.concat('&q=', userInput, apiKey);



//fetching from newsAPI, obtain results and dates
function newsAPI (url) {
    fetch(url)
    .then (function (response) {
        console.log(response);
        return response.json()
    })
    .then (function (data) {
        console.log(data)
        return data
    })
}

newsAPI(newsApiURL)
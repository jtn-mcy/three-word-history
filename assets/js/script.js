/**************************************************************************************
 * NEWS API - fetching data from news API to obtain results and dates
 * functions: newsAPI
 * &from=YYYY-MM-DD &to=YYYY-MM-DD
 * &sortby=(relevancy, popularity, publishedAt)
 * 
 */

//Userinput from search form
var userInput = 'google+texas'; //searchInput.value
//Query parameters
var sortBy = '&sortby=' + 'publishedAt';
var pageSize = '&pageSize=' + 100;
var apiKey = '&apiKey=c7f77b1aac9843b6b86b9cf855938226'; //apikey
var fromDate = '&from=';
var toDate = '&to=';
//date ranges
var fourteenDaysAgo = moment().subtract(14, 'days').format("YYYY-MM-DD");
var sevenDaysAgo = moment().subtract(17, 'days').format("YYYY-MM-DD");
var now = moment().format('YYY-MM-DD');
//base API URL and concatenation with 
var newsApiBase = 'https://newsapi.org/v2/everything?'; //base link to add from
var newsApiURL14to7 = newsApiBase.concat('qInTitle=', userInput, pageSize, sortBy, fromDate, fourteenDaysAgo, toDate, sevenDaysAgo, apiKey);
var newsApiURL7toNow = newsApiBase.concat('qInTitle=', userInput, pageSize, sortBy, fromDate, sevenDaysAgo, toDate, now, apiKey);



//fetching from newsAPI, obtain results and dates
async function newsAPI (url) {
    console.log(url);
    const response = await fetch(url);
    console.log(response);
    const data_1 = await response.json();
    console.log(data_1);
    console.log('Total results: ', data_1['totalResults']);
    return data_1['articles'];
}

var articles = newsAPI(newsApiURL14to7);
console.log(articles);

console.log('newsApiURL14to7 ', newsApiURL14to7);
console.log('newsApiURL7toNow ', newsApiURL7toNow)
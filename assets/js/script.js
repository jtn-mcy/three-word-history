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



//fetching from newsAPI, obtain array of article objects to extract dates and headlines/data from
async function newsAPI (url) {
    // console.log(url);
    const response = await fetch(url);
    // console.log(response);
    const data_newsAPI = await response.json();
    // console.log(data_newsAPI);
    console.log('Total results: ', data_newsAPI['totalResults']);
    // console.log(data_newsAPI['articles'])
    return data_newsAPI['articles'];
}

var arrayDate = []; // dates
var arrayHeadlineCount = []; //headlines count per date

async function obtainArrays () {
    const articles14to7 = await newsAPI(newsApiURL14to7);
    // console.log(articles14to7)
    const articles7to0 = await newsAPI(newsApiURL7toNow);
    var combinedArticles = articles14to7.concat(articles7to0);
    console.log('Total amount of articles: ', combinedArticles.length)
    for (i=0; i<combinedArticles.length; i++) {
        arrayDate.push(combinedArticles[i]['publishedAt'].substr(0,9))
    }
}

obtainArrays()

// console.log('newsApiURL14to7 ', newsApiURL14to7);
// console.log('newsApiURL7toNow ', newsApiURL7toNow)
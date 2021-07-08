/**************************************************************************************
 * NEWSAPI - fetching data from news API to obtain results and dates
 * functions: newsAPI, obtainArrays
 * &from=YYYY-MM-DD &to=YYYY-MM-DD
 * &sortby=(relevancy, popularity, publishedAt)
 * 
 */

//Userinput from search form
var userInput = 'texas'; //searchInput.value
//Query parameters
var nSortBy = '&sortby=' + 'publishedAt';
var nPageSize = '&pageSize=' + 100;
// var apiKey = '&apiKey=c7f77b1aac9843b6b86b9cf855938226'; //apikey
var fromDate = '&from=';
var toDate = '&to=';
//date ranges
var fourteenDaysAgo = moment().subtract(14, 'days').format("YYYY-MM-DD");
var sevenDaysAgo = moment().subtract(17, 'days').format("YYYY-MM-DD");
var now = moment().format('YYY-MM-DD');
//base API URL and concatenation with 
var newsApiBase = 'https://newsapi.org/v2/everything?'; //base link to add from
// var newsApiURL14to7 = newsApiBase.concat('qInTitle=', userInput, nPageSize, nSortBy, fromDate, fourteenDaysAgo, toDate, sevenDaysAgo, apiKey);
// var newsApiURL7toNow = newsApiBase.concat('qInTitle=', userInput, nPageSize, nSortBy, fromDate, sevenDaysAgo, toDate, now, apiKey);



//fetching from newsAPI, obtain array of article objects to extract dates and headlines/data from
async function newsAPI (url) {
    // console.log(url);
    const response = await fetch(url); //obtain response
    // console.log(response);
    const data_newsAPI = await response.json(); //jsonify the response
    // console.log(data_newsAPI);
    console.log('Total results: ', data_newsAPI['totalResults']); 
    // console.log(data_newsAPI['articles'])
    return data_newsAPI['articles']; //returns an array of articles
}


var arrDate = []; // dates
var arrHeadlineCount = []; //headlines count per date

async function obtainArrays () { //will combine the two article arrays over a span of 2 weeks and separate 
    let articles14to7 = await newsAPI(newsApiURL14to7);
    articles14to7 = articles14to7.reverse(); //puts the articles in chronological order
    // console.log(articles14to7)
    let articles7to0 = await newsAPI(newsApiURL7toNow);
    articles7to0 = articles7to0.reverse() //puts the articles in chronological order
    var combinedArticles = articles14to7.concat(articles7to0);
    console.log('Total amount of articles: ', combinedArticles.length); //tells us how many articles obtained total
    for (i=0; i<combinedArticles.length; i++) {
        var indexHeadline = 0 //declare/rest indexHeadline every loop
        if (arrDate.includes(combinedArticles[i]['publishedAt'].substr(5,5))) { //.substr(5,10) will grab the MM-DD standardized in the API object
            //obtain index of arrDate[date]--it will match index of arrHeadlineCount
            indexHeadline = arrDate.indexOf(combinedArticles[i]['publishedAt'].substr(5,5));
            arrHeadlineCount[indexHeadline] += 1; //increments headlineCount at appropriate
        } else {
            arrDate.push(combinedArticles[i]['publishedAt'].substr(5,5))
            indexHeadline = arrDate.indexOf(combinedArticles[i]['publishedAt'].substr(5,5));
            arrHeadlineCount[indexHeadline] = 1 //sets index of array
        }
    }
    return [arrDate, arrHeadlineCount]
}

jsonArr = []
async function jsonifiedArray () {
    let unjsonifiedArr = await obtainArrays()
    console.log(unjsonifiedArr.length);
    firstUnjson = unjsonifiedArr[0];
    secondUnjson = unjsonifiedArr[1];
    // console.log('unjsonifiedArr', unjsonifiedArr)
    // console.log('firstArr', unjsonifiedArr[0][0])
    // console.log('secondArr', unjsonifiedArr[1])
    for (i=0; i<unjsonifiedArr[0].length; i++) {
        obj = {};
        obj['date'] = firstUnjson[i];
        obj['HeadlineCount'] = secondUnjson[i]
        jsonArr.push(obj);
    }
}

// jsonifiedArray();    


// console.log('newsApiURL14to7 ', newsApiURL14to7);
// console.log('newsApiURL7toNow ', newsApiURL7toNow)

/************************************************************
 * CHRONICLING AMERICA API - fetching data from chronicling america api to obtain results and dates
 * Functions:gNewsAPI, grabGNewsArticle,
 * Adopted vars: userInput (from NEWSAPI)
 * 
 */
var apiKeyGNews = '&token=5cee1145337d4bc87079fa32cac6a057';
var gNewsApiBase = 'https://gnews.io/api/v4/search?';
var gLanguage = '&lang=' + 'en'; //fromDate defined above
var gSortBy = '&sortby=' + 'relevance'; //toDate defined above
var gOneYearAgo = moment().subtract(365, 'days').format('YYYY-MM-DD') + 'T00:00:00Z';
var gTenYearsAgo = moment().subtract(365*10, 'days').format('YYYY-MM-DD') + 'T00:00:00Z';
var gNewsApiURL =  gNewsApiBase.concat('q=', userInput, gSortBy, gLanguage, fromDate, gTenYearsAgo, toDate, gOneYearAgo, apiKeyGNews);

//fetching from gNewsAPI, obtain array of article objects to extract dates and headlines/data from
async function gNewsAPI (url) {
    // console.log(url)
    const response = await fetch(url);
    const data_gNewsAPI = await response.json();
    console.log('Total results: ', data_gNewsAPI['totalArticles']);
    console.log(data_gNewsAPI);
    return data_gNewsAPI['articles'] //returns an array of article objects
}

async function grabGNewsArticle () { //obtain a random article from some year
    gArticleArr = await gNewsAPI(gNewsApiURL);
    console.log(gArticleArr);
    gArticle = gArticleArr[Math.floor(Math.random()*gArticleArr.length)];
    return gArticle
}

gArticleEx = grabGNewsArticle()
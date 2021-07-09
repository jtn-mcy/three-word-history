/*******************NEWSAPI*********************************
 * fetching data from news API to obtain results and dates
 * functions: newsAPI, obtainArrays, jsonified Array, addNewsApiData
 * &from=YYYY-MM-DD &to=YYYY-MM-DD
 * &sortby=(relevancy, popularity, publishedAt)
 * id in html: newsapi-article
 */
//Userinput from search form
var userInput = ''; //searchInput.value
//Query parameters
var nSortBy = '&sortby=' + 'publishedAt';
var nPageSize = '&pageSize=' + 100;
var apiKey = '&apiKey=c7f77b1aac9843b6b86b9cf855938226'; //apikey
var fromDate = '&from=';
var toDate = '&to=';
//date ranges
var fourteenDaysAgo = moment().subtract(14, 'days').format("YYYY-MM-DD");
var sevenDaysAgo = moment().subtract(7, 'days').format("YYYY-MM-DD");
var now = moment().format('YYY-MM-DD');
//base API URL and concatenation with 
var newsApiBase = 'https://newsapi.org/v2/everything?'; //base link to add from

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
    var newsApiURL14to7 = newsApiBase.concat('qInTitle=', userInput, nPageSize, nSortBy, fromDate, fourteenDaysAgo, toDate, sevenDaysAgo, apiKey);
    var newsApiURL7toNow = newsApiBase.concat('qInTitle=', userInput, nPageSize, nSortBy, fromDate, sevenDaysAgo, toDate, now, apiKey);
    let articles14to7 = await newsAPI(newsApiURL14to7);
    articles14to7 = articles14to7.reverse(); //puts the articles in chronological order
    let articles7to0 = await newsAPI(newsApiURL7toNow);
    articles7to0 = articles7to0.reverse() //puts the articles in chronological order
    var combinedArticles = articles14to7.concat(articles7to0);
    console.log('Total amount of articles: ', combinedArticles.length); //tells us how many articles obtained total
    for (var i=0; i<combinedArticles.length; i++) {
        var indexHeadline = 0 //declare/reset indexHeadline every loop
        if (arrDate.includes(combinedArticles[i]['publishedAt'].substr(5,5))) { //.substr(5,5) will grab the MM-DD standardized in the API object
            //obtain index of arrDate[date]--it will match index of arrHeadlineCount
            indexHeadline = arrDate.indexOf(combinedArticles[i]['publishedAt'].substr(5,5));
            arrHeadlineCount[indexHeadline] += 1; //increments headlineCount at appropriate
        } else {
            arrDate.push(combinedArticles[i]['publishedAt'].substr(5,5))
            indexHeadline = arrDate.indexOf(combinedArticles[i]['publishedAt'].substr(5,5));
            arrHeadlineCount[indexHeadline] = 1 //sets index of array
        }
    }
    var articleTitleArr = [] //declare a variable to obtain article titles
    for (i=0; i<combinedArticles.length; i++) {
        if (i === 5) {break} //only up to 5 articles to display
        else {
            articleTitleArr.push(combinedArticles[i]['title']);
        }
    }
    addNewsApiData(articleTitleArr); //display article titles into column
    return [arrDate, arrHeadlineCount]
}


async function jsonifiedArray () { //add objects into jsonArr so that it can be dimpled into a graph
    let unjsonifiedArr = await obtainArrays()
    jsonArr = [] //reset jsonArr
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
    var appendThis = drawChart(jsonArr);
    document.getElementsByTagName('body').appendChild(appendThis);
}

function addNewsApiData(arr) { //updates column with 5 search articles
    var parentEl = document.querySelector('#newsapi-article');
    removeAllChildren(parentEl) //clears column list

    titleEl = document.createElement('p'); //create title
    titleEl.textContent = 'Recent articles about ' + userInput;
    orderedListEl = document.createElement('ol'); //create ordered list
    orderedListEl.setAttribute('class', 'p-4');
    parentEl.appendChild(titleEl);
    parentEl.appendChild(orderedListEl);

    for (i=0; i<arr.length; i++) {
        var childEl = document.createElement('li');
        childEl.textContent = arr[i];
        childEl.setAttribute('class', 'title is-5 p-2');
        orderedListEl.appendChild(childEl);
    }
}

// jsonifiedArray();    


/******************draw the graph********************************
 * Fetching data from jsonArr to obtain a graph to display in graph.html
 * Functions: drawchart
 * Adopted vars: jsonArr (from NEWSAPI)
 */
function drawChart (jsonData) {
    var svg = dimple.newSvg("body", 800, 600);
    var data = jsonData;
    console.log(data);
    var chart = new dimple.chart(svg, data);
    chart.addCategoryAxis("x", "date");
    chart.addMeasureAxis("y", "HeadlineCount");
    chart.addSeries(null, dimple.plot.scatterplot);
    chart.draw();
}

/******************GNEWS API********************************
 * Fetching data from gNEWS api to obtain a random article from long ago
 * Functions:gNewsAPI, grabGNewsArticle,
 * Adopted vars: userInput (from NEWSAPI)
 * Article object properties: content, description, image, publishedAt, source, title, url
 */

var apiKeyGNews = '&token=5cee1145337d4bc87079fa32cac6a057';
var gNewsApiBase = 'https://gnews.io/api/v4/search?';
var gLanguage = '&lang=' + 'en'; //fromDate defined above
var gSortBy = '&sortby=' + 'relevance'; //toDate defined above
var gOneYearAgo = moment().subtract(365, 'days').format('YYYY-MM-DD') + 'T00:00:00Z';
var gTenYearsAgo = moment().subtract(365*10, 'days').format('YYYY-MM-DD') + 'T00:00:00Z';
// var gNewsApiURL =  gNewsApiBase.concat('q=', userInput, gSortBy, gLanguage, fromDate, gTenYearsAgo, toDate, gOneYearAgo, apiKeyGNews);

//fetching from gNewsAPI, obtain array of article objects to extract dates and headlines/data from
async function gNewsAPI (url) {
    console.log(url)
    const response = await fetch(url);
    const data_gNewsAPI = await response.json();
    console.log('Total results: ', data_gNewsAPI['totalArticles']);
    console.log(data_gNewsAPI);
    return data_gNewsAPI['articles'] //returns an array of article objects
}

async function grabGNewsArticle () { //obtain a random article from some year
    var gNewsApiURL =  gNewsApiBase.concat('q=', userInput, gSortBy, gLanguage, fromDate, gTenYearsAgo, toDate, gOneYearAgo, apiKeyGNews);
    gArticleArr = await gNewsAPI(gNewsApiURL);
    console.log(gArticleArr);
    gArticle = gArticleArr[Math.floor(Math.random()*gArticleArr.length)];
    addGArticleData(gArticle);
}

function addGArticleData (article) { //creates elements to add article details
    parentEl = document.querySelector('#gnews-article');
    removeAllChildren(parentEl); //clears column list

    var titleEl = document.createElement('h4');
    var contentEl = document.createElement('p');
    var urlEl = document.createElement('a');
    var imgEl = document.createElement('img');
    var brEl = document.createElement('br');
    
    titleEl.textContent = 'Title: '+ article['title'];
    contentEl.textContent = 'Description: ' + article['description'];
    urlEl.textContent = 'link to article';
    urlEl.setAttribute('href', article['url']);
    imgEl.setAttribute('src', article['image']);

    parentEl.appendChild(titleEl);
    parentEl.appendChild(contentEl);
    parentEl.appendChild(urlEl);
    parentEl.appendChild(brEl);
    parentEl.appendChild(imgEl);
}

function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
/*****************COMPILESEARCH*************************
 *  Compiling all functions to populate the index and graph htmls
 *  Functions: compileSearch
 */

function compileSearch () { //runs when user clicks search
    jsonData = jsonifiedArray(); //obtain jsonData to be used for graphing, populate the #newsapi-article column
    grabGNewsArticle(); //populates the #gnews-article column
    //add code that will update the graph.html

}

function addPlus (input) {
    tempInputSplit = input.split(" ");
    for (i=0; i< tempInputSplit.length-1; i++) {
        tempInputSplit[i] = tempInputSplit[i].concat('', '+');
    }
    finalInput = tempInputSplit.join("");
    return finalInput
}

/**********EVENT LISTENERS*************************
 * Event listeners for clicking the search, view results, go back, search history, and clear history
 * Functions: None
 */
document.getElementById("search-btn").addEventListener('click', function () { //clicks search button
    console.log('submit button!');
    searchInput = document.getElementById("search-input").value;
    console.log('searching for..', searchInput);
    userInput = addPlus(searchInput);
    // userInput = wordInput.split(' ');
    // for (i=0; i < userInput.length-1; i++) {
    //     userInput[i].concat('+')
    // }
    console.log(userInput);
    compileSearch();
})
/*
document.getElementById("view-results").addEventListener('click', function () { //clicks view results
    console.log('view results!');
    //document.location.replace('graph.html);
})

document.getElementById("").addEventListener('click', function () { //clicks go back
    console.log('go back!');
    //document.location.replace('index.html');
})

document.getElementById("").addEventListener('click', function () { //clicks a search history button
    console.log('search history item!')
})
*/

/* uncomment if we add a clear history button! A clearSearchHistory has been added (and commented out) in Local Storage section
document.getElementById("").addEventListener('click', function () { //clicks a clear history button
    console.log('clear search history!')
})
*/

/**************LOCAL STORAGE***************************
 * Add a search history and set up local storage for the user
 * Functions: init, renderSearchhistory, saveSearchHistory, updateSearchHistory, clearSearchHistory
 */
var gp1SearchHistory = []; //base localstorage array

function init() {
    var tempLocal = JSON.parse(localStorage.getItem('gp1SearchHistory'));
    console.log(tempLocal);
    if (tempLocal !== null) { //if user has search history, update gp1SearchHistory
        console.log('local storage gp1SearchHistory already exists, rendering it');
        gp1SearchHistory = tempLocal;
    }
    renderSearchHistory (gp1SearchHistory);
}

function renderSearchHistory (userSearches) {
    searchList = document.querySelector(''); //get parent of search results
    removeAllChildren(searchList); //remove searchlist children
    for (var i=userSearches.length-1; i>=0; i--) {
        newSearchTerm = document.createElement('li'); //create list element
        newSearchTerm.textContent = userSearches[i]; //give list text from element i of gp1SearchHistory
        searchList.appendChild(searchlist); //append the list element to searchList
    }
}

function saveSearchHistory () {
    localStorage.setItem('gp1SearchHistory', JSON.stringify(gp1SearchHistory)); //save current gp1SearchHistory array
}

function updateSearchHistory (userPrompt) { //update user search terms
    var inputSearchItem = userPrompt.trim();
    gp1SearchHistory.push(inputSearchItem);
    saveSearchHistory();
    renderSearchHistory();
}

/*!uncomment if clear search history button is added!
function clearSearchHistory () {
    gp1SearchHistory = [];
    saveSearchHistory();
    renderSearchHistory(gp1SearchHistory);
 } */


//init() //initializes the page and renders the search history

// gArticleEx = grabGNewsArticle()
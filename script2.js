// initialize namespace
const footballStats = {};
// initialize apikey
footballStats.apikey = '216fc317fce14a3e92c6759cc84f2ceb';
footballStats.jsonData = {};

    // arguments for this function dates array which will be the unique type dates, locally sorted matches 
    // grab the template and go through the dates array with a for loop, display the content of the dates as each for our template, go through dated array for loop again and grab matches correspond to that date, and create a div and create a template 
footballStats.display = (dates, sortedMatches) => {
    const matchTemplate = document.querySelector("[data-match-template]")
    const matchContainer = document.querySelector(".matches")
    console.log(sortedMatches)


    // footballStats.matchesTable = document.querySelector('div.dates')
    // liElement.innerHTML = `<p> Date: ${content.date}, Group: ${content.group}, Matchday: ${content.matchday}</p>`

    for (let i=0; i<dates.length; i++){
        const dateElement = matchTemplate.content.cloneNode(true).children[0]
        const matchHeader = dateElement.querySelector("[data-match-header]")
        matchHeader.textContent = dates[i].substring(4,10)
        matchContainer.append(dateElement)

        const matchTable = dateElement.querySelector("[data-match-Table]")
        sortedMatches[dates[i]].forEach(match => {
            const matchDiv = document.createElement("div")
            matchDiv.textContent = `${match.team1.name} || ${match.team2.name}`
            matchDiv.classList.add("match")
        })

        // const matchTable = sortedMatches
        // console.log(dateElement)
        // console.log(matchHeader)
       
    }
    
}


footballStats.convertDate = (utcDate) => {
    date = new Date(utcDate)

    return date.toDateString()
}

footballStats.getDates = (matches) => {
    const dates = []
    footballStats.sortedByDateMatches = {}
    matches.forEach(match => {
        date = new Date(match.utcDate)
        dates.push(date.toDateString())
        footballStats.sortedByDateMatches.date = {team1:match.awayTeam.name, team2:match.homeTeam.name, winner:match[winner].name, date:date.toDateString()};
    })
    const uniqueDates = [...new Set(dates)]
    footballStats.uniqueDates = uniqueDates
    footballStats.display(uniqueDates)
    return uniqueDates
}

footballStats.getMatches = (matches) => {
    footballStats.matches = matches
    const resultsArray = []
  
    footballStats.matches.forEach(match => {
        // header = {date:match.utcDate, group:match.group, matchday:match.matchday}
        // footballStats.display(header)
        if(match.score.winner == 'HOME_TEAM'){
            winner = 'homeTeam'
        }
        if (match.score.winner == 'AWAY_TEAM'){
            winner = 'awayTeam' 
        }
       results = {
        team1: {name:match.awayTeam.name, flag:match.awayTeam.crest}, 
        team2: {name:match.homeTeam.name, flag:match.homeTeam.crest}, 
        winner: match[winner].name,
        date: footballStats.convertDate(match.utcDate)
    }
    
        resultsArray.push(results) 
    });

    return resultsArray
}

footballStats.sortByDate = (dates, matches) => {
    sortedMatches = {}
    for(let i = 0; i < dates.length; i++) {
        dateArray = matches.filter(match => match.date == dates[i])
        sortedMatches[dates[i]] = dateArray
    }
    
    console.log(sortedMatches)
    return sortedMatches
   
}

footballStats.getData = (url) => {
    // setup url: endpoint https://api.football-data.org/v4/competitions/WC
    footballStats.apiUrl = url
    // setup request header
    // footballStats.headers = new Headers();
    // footballStats.headers.append('X-Auth-Token', footballStats.apikey)
    // console.log(footballStats.headers)
    // setup request options
    // footballStats.requestOptions = {
    //     method:'GET',
    //     headers: footballStats.headers
    // }
    // setup url with params
    url = new URL(footballStats.apiUrl)
    url.search = new URLSearchParams({
        season: '2022',
        // dateFrom: '2022-01-01',
        // dateTo: '2022-12-31',
        mode: 'cors',
        cache: 'default'
    })
    // fetch, extract json, console log object 
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'X-Auth-Token': footballStats.apikey,
            },
        })
        .then((res) => {
            return res.json()
        })
        .then((jsonData) => {
            // footballStats.jsonData = jsonData;
            // footballStats.cupLogoHref = jsonData.competition.emblem
            // footballStats.seasonStart = jsonData.resultSet.first
            // footballStats.seasonEnd = jsonData.resultSet.last
            // footballStats.seasonTotal = jsonData.resultSet.played
        //     // console.log(footballStats.seasonStart, footballStats.seasonEnd, footballStats.seasonTotal)
        //     // console.log(footballStats.jsonData)
            if (jsonData){
                resolve(jsonData)
            }else{
                reject('data could not be loaded')
            }

    })
    
    })
}

footballStats.init = () => {
     footballStats.getData(`https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/competitions/WC/matches`)
    .then((promisedData) =>{
        // footballStats.jsonData = promisedData
        console.log(promisedData)
        footballStats.matchResultsArray = footballStats.getMatches(promisedData.matches)
        footballStats.dates = footballStats.getDates(promisedData.matches)
        console.log(footballStats.dates)
        // return promisedData.value
        footballStats.sortedMatches = footballStats.sortByDate(footballStats.dates,footballStats.matchResultsArray)
        console.log(footballStats.matchResultsArray)
        footballStats.display(footballStats.dates, footballStats.sortedMatches)
    })
    // .catch((message) => {
    //     return message
    // })
 
}

footballStats.init();





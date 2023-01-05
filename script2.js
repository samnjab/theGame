// initialize namespace
const footballStats = {};
// initialize apikey
footballStats.apikey = '216fc317fce14a3e92c6759cc84f2ceb';
footballStats.matchesTable = document.querySelector('ul.dates')

footballStats.getDates = (matches) => {
    const dates = []
    matches.forEach(match => {
        date = new Date(match.utcDate)
        dates.push(date.toDateString())
    })
    const uniqueDates = [...new Set(dates)]
    return uniqueDates
}

footballStats.display = (array) => {
    // liElement.innerHTML = `<p> Date: ${content.date}, Group: ${content.group}, Matchday: ${content.matchday}</p>`
    console.log(array)
    array.forEach(item => {
        const liElement  = document.createElement('li')
        liElement.textContent = `${item}`
        footballStats.matchesTable.appendChild(liElement)
    })
}

footballStats.getMatches = (matches) => {
    footballStats.matches = matches
    console.log(footballStats.matches)
    footballStats.matches.forEach(match => {
        // header = {date:match.utcDate, group:match.group, matchday:match.matchday}
        // footballStats.display(header)
        if(match.score.winner == 'HOME_TEAM'){
            winner = 'homeTeam'
        }
        if (match.score.winner == 'AWAY_TEAM'){
            winner = 'awayTeam' 
        }
        results = {team1:match.awayTeam.name, team2:match.homeTeam.name, winner:match[winner].name}
        // footballStats.display()
       
        console.log(match.awayTeam.name, match.homeTeam.name, match[winner].name)  
    });

}

footballStats.getData = () => {
    // setup url: endpoint https://api.football-data.org/v4/competitions/WC
    footballStats.apiUrl = `https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/competitions/WC/matches`
    // setup request header
    footballStats.headers = new Headers();
    footballStats.headers.append('X-Auth-Token', footballStats.apikey)
    console.log(footballStats.headers)
    // setup request options
    footballStats.requestOptions = {
        method:'GET',
        headers: footballStats.headers
    }
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
        console.log(jsonData)
        footballStats.cupLogoHref = jsonData.competition.emblem
        footballStats.seasonStart = jsonData.resultSet.first
        footballStats.seasonEnd = jsonData.resultSet.last
        footballStats.seasonTotal = jsonData.resultSet.played
        console.log(footballStats.seasonStart, footballStats.seasonEnd, footballStats.seasonTotal)
        footballStats.getMatches(jsonData.matches)
        footballStats.dates = footballStats.getDates(jsonData.matches)
        footballStats.display(footballStats.dates)
        console.log(footballStats.getDates(jsonData.matches))


        // look at the matches array, go through the array and console log utcDate, homeTeam, awayTeam, scores, winner, stage, status
        // go through the array, create an li for each utcDate and update it's textContent 

    })
}

footballStats.init = () => {
    footballStats.getData()
}

footballStats.init();



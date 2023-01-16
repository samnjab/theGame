// initialize namespace
const footballStats = {};
// initialize apikey
// footballStats.apikey = '70a843e5cf86426b9a1a9528ec8a7da7';
footballStats.randomizeApiKey = (array) => {
    return array[Math.floor(Math.random()*array.length)]
}


    // arguments for this function dates array which will be the unique type dates, locally sorted matches 
    // grab the template and go through the dates array with a for loop, display the content of the dates as each for our template, go through dated array for loop again and grab matches correspond to that date, and create a div and create a template 
footballStats.display = (dates, sortedMatches) => {
    return new Promise((resolve, reject) => {
    
        const matchTemplate = document.querySelector("[data-match-template]")
        const matchContainer = document.querySelector(".matches")
        const matchesWithElements = []

        for (let i=0; i<dates.length; i++){
            
            const dateElement = matchTemplate.content.cloneNode(true).children[0]
            const matchHeader = dateElement.querySelector("[data-match-header]")
            matchHeader.textContent = dates[i].substring(4,10)
            matchContainer.append(dateElement)
            
            const matchTable = dateElement.querySelector("[data-match-Table]")
            
            matchesWithElements[i] = sortedMatches[dates[i]].map(match => {
                const matchBoxTemplate = document.querySelector('[data-match-box]')
                const matchDiv = matchBoxTemplate.content.cloneNode(true).children[0]

                // <<<<<< Team 1 flag + information starts here >>>>>>>>>
   
               const matchTeam1FlagImg = matchDiv.querySelector('[data-flag-team1]')
               matchTeam1FlagImg.src = match.team1.flag 
               const matchTeam1Info = matchDiv.querySelector('[data-team1-info]')
               matchTeam1Info.textContent = `${match.team1.name} ${match.team1.score.fullTime}`
   
               // <<<<<< Team 2 flag + information starts here >>>>>>>>>
   
               const matchTeam2FlagImg = matchDiv.querySelector('[data-flag-team2]')
               matchTeam2FlagImg.src = match.team2.flag
               const matchTeam2Info = matchDiv.querySelector('[data-team2-info]')
               matchTeam2Info.textContent = `${match.team2.name} ${match.team2.score.fullTime}`
   
               // <<<<<< Winner >>>>>>>>>>>>>>>
            //    const winnerDiv = matchDiv.querySelector('[data-winner]')
            //    winnerDiv.textContent = `Winner : ${match.winner}`
               // <<<<<<<<<<< More Info addition >>>>>>>>
               matchDiv.querySelector('[data-competition-name]').textContent = `${match.competition.name}`
               matchDiv.querySelector('[data-competition-emblem]').src = `${match.competition.emblem}`
               matchDiv.querySelector('[data-match-date]').textContent = `${match.date}`
               matchDiv.querySelector('[data-group]').textContent = `${match.group}`
               matchDiv.querySelector('[data-stage]').textContent = `${(match.stage.charAt(0)+ match.stage.slice(1).toLowerCase()).replace('_', ' ')}`
               matchDiv.querySelector('[data-match-day]').textContent = `${match.matchDay}`
               matchDiv.querySelector('[data-status]').textContent = `${match.status.charAt(0) + match.status.slice(1).toLowerCase()}`
               matchDiv.querySelector('[data-winner]').textContent = `${match.winner}`
               



        
               // <<<<<<<< append >>>>>>>>>>>>>>
               matchTable.append(matchDiv)
               

               return {match:match, element:matchDiv}
            })


        }
        if (matchesWithElements){
            console.log('we got resolve')
            resolve(matchesWithElements)
        }else{
            reject('data could not be loaded')
        }
    }) 
    
}



footballStats.convertDate = (utcDate) => {
    date = new Date(utcDate)
    return date.toDateString()
}

footballStats.getDates = (matches) => {
    const dates = []
    footballStats.sortedByDateMatches = {}
    matches.forEach(match => {
        dates.push(footballStats.convertDate(match.utcDate))
    })
    const uniqueDates = [...new Set(dates)]
    footballStats.uniqueDates = uniqueDates
    return uniqueDates
}

footballStats.getMatches = (matches) => {
    footballStats.matches = matches
    const resultsArray = []
  
    footballStats.matches.forEach(match => {
        results = {
             team1: {name:match.awayTeam.name, flag:match.awayTeam.crest, score:{fullTime: match.score.fullTime.away, halfTime:match.score.halfTime.away}}, 
             team2: {name:match.homeTeam.name, flag:match.homeTeam.crest, score:{fullTime:match.score.fullTime.home, halfTime:match.score.halfTime.home}}, 
             date: footballStats.convertDate(match.utcDate),
             group: match.group,
             stage: match.stage,
             matchDay:match.matchday,
             competition: {name: match.competition.name, emblem:match.competition.emblem},
             season:{seasonStart: match.season.startDate, seasonEnd: match.season.endDate, currentMatchDay:match.season.currentMatchday},
             status:match.status
         }


        if(match.score.winner == 'HOME_TEAM'){
            winner = 'homeTeam'
            results.winner = match[winner].name
        }
        else if (match.score.winner == 'AWAY_TEAM'){
            winner = 'awayTeam' 
            results.winner = match[winner].name
        }
        else{
            results.winner = "Draw"
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
    footballStats.apikey = footballStats.randomizeApiKey(footballStats.apikeys)
    console.log('using key:', footballStats.apikey)
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
footballStats.eventListeners = (matchesWithElements) =>{
    offBySearch = [...Array(document.querySelectorAll('.date').length).fill(false)]
    offBySearchMatches =[...Array(document.querySelectorAll('.match').length).fill(false)]
    // console.log(offBySearchMatches)
    const hideOtherMatches = (clickMatches, clickedMatch) => {
        clickMatches.forEach((match, i) => {
            console.log(match)
            // match.classList.toggle('hide', match!=clickMatch)
            if (match != clickedMatch && !offBySearchMatches[i]){
                console.log(offBySearchMatches[i])
                match.classList.toggle('hide')
                // console.log(match.parentElement.parentElement.children[0])
                // match.parentElement.parentElement.children[0].classList.toggle('hide')
                
            }
        })

    }
    const getVisibilityStatus = (dateDivs) =>{
        dateDivsArray = [...dateDivs]
        // console.log(dateDivsArray)
        // <<<<<<<<<< dateDivsVisibility is an array collection of {dateDiv:address of the div, dateVisible:current visibility of that dateDiv}
        dateDivsVisible = dateDivsArray.map((dateDiv) => {
            // console.log(dateDiv.style.display)
            if (dateDiv.style.display == 'none'){
                dateVisible = false
                console.log(dateVisible)
            }else{
                dateVisible = true
            }
            return {dateDiv:dateDiv, dateVisible: dateVisible}
        })
        
        return dateDivsVisible

    }
    const hideOtherDates = (dateDivs, clickedMatch) => {
        dateDivs.forEach((dateDiv, i) => {
            matchDivs = [...dateDiv.children[1].children]
            matchFound = false
            matchDivs.forEach((matchDiv) => {
                if (matchDiv == clickedMatch){
                    matchFound = true
                }
            })
            if (!matchFound && !offBySearch[i]){
                dateDiv.classList.toggle('hide')
            }
        })
    }
    // <<<<<<<<< search bar event listener >>>>>>>>>>>>>>
    const userInput = document.getElementById('search')
    userInput.addEventListener('input', e => {
        e.preventDefault()
        const value = e.target.value.toLowerCase()
        const arrayWithIsVisible = []  
        for (let i =0; i < footballStats.dates.length; i++) {
            matchesWithIsVisible = matchesWithElements[i].map(matchWithElement => {
                const isVisible = matchWithElement.match.team1.name.toLowerCase().includes(value) || matchWithElement.match.team2.name.toLowerCase().includes(value)
                matchWithElement.element.classList.toggle('hide', !isVisible)
                if (!isVisible){
                    offBySearchMatches[i] = true
                }
                
                
                // matchWithElement.element.parentElement.parentElement.classList.toggle('hide', !isVisible)   
                return {matchWithElement:matchWithElement, isVisible:isVisible}
            })
            arrayWithIsVisible.push(matchesWithIsVisible)
        }
        const dateDivs = document.querySelectorAll('.date')
        arrayWithIsVisible.forEach((date, i) => {
            dateVisible = false
            offBySearch[i] = true
            date.forEach((match) => {
                if (match.isVisible){
                    dateVisible = true
                    offBySearch[i] = false
                }
            })
            dateDivs[i].classList.toggle('hide', !dateVisible)
        })
        
    })
    // <<<<<<<<< clickable match event listener >>>>>>>>>>>>>>
    const clickMatches = document.querySelectorAll('.match')
    clickMatches.forEach(clickedMatch => {
        clickedMatch.addEventListener('click', (e) => {
            e.preventDefault()
            clickedMatch.querySelector('.more-info').classList.toggle('hide')
            hideOtherMatches(clickMatches, clickedMatch)
            const dateDivs = document.querySelectorAll('.date')
            // console.log(offBySearch)
            hideOtherDates(dateDivs, clickedMatch)
        })

   })
    
}

footballStats.init = () => {
    footballStats.apikeys = ['ce76110580a24979bfb7ae9dabb81570','70a843e5cf86426b9a1a9528ec8a7da7', '216fc317fce14a3e92c6759cc84f2ceb', '6a015959a852460a971b3fe44d9ddd99']
     footballStats.getData(`https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/competitions/WC/matches`)
    .then((promisedData) =>{
        console.log(promisedData)
        footballStats.matchResultsArray = footballStats.getMatches(promisedData.matches)
        console.log(footballStats.matchResultsArray)
        footballStats.dates = footballStats.getDates(promisedData.matches)
        footballStats.sortedMatches = footballStats.sortByDate(footballStats.dates,footballStats.matchResultsArray)
        document.querySelector('.load-wrapp').classList.add('hide')
        footballStats.display(footballStats.dates, footballStats.sortedMatches)
        .then((matchesWithElements) => {
            footballStats.eventListeners(matchesWithElements)
        })

    // .catch((message) => {
    //     return message
    // })  
 
})
}
footballStats.init();


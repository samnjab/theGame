// initialize namespace
const footballStats = {};
// initialize apikey
footballStats.apikey = '216fc317fce14a3e92c6759cc84f2ceb';

footballStats.display = (dates, sortedMatches, stage) => {
    return new Promise((resolve, reject) => {
    
        const matchTemplate = document.querySelector("[data-match-template]")
        const matchContainer = document.querySelector(`.${stage}`)
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
            //    matchDiv.querySelector('[data-competition-name]').textContent = `${match.competition.name}`
            //    matchDiv.querySelector('[data-competition-emblem]').src = `${match.competition.emblem}`
            //    matchDiv.querySelector('[data-match-date]').textContent = `Date: ${match.date}`
            //    matchDiv.querySelector('[data-group]').textContent = `Group: ${match.group}`
            //    matchDiv.querySelector('[data-stage]').textContent = `Stage: ${match.stage}`
            //    matchDiv.querySelector('[data-match-day]').textContent = `Match day:${match.matchDay}`
            //    matchDiv.querySelector('[data-status]').textContent = `Status: ${match.status}`
            //    matchDiv.querySelector('[data-winner]').textContent = `Winner: ${match.winner}`
               



        
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
        date = new Date(match.utcDate)
        dates.push(date.toDateString())
        // footballStats.sortedByDateMatches.date = {team1:match.awayTeam.name, team2:match.homeTeam.name, date:date.toDateString()};
    })
    const uniqueDates = [...new Set(dates)]
    footballStats.uniqueDates = uniqueDates
    return uniqueDates
}


footballStats.sortByDate = (dates, matches) => {
    sortedMatches = {}
    for(let i = 0; i < dates.length; i++) {
        dateArray = matches.filter(match => match.date == dates[i])
        sortedMatches[dates[i]] = dateArray
        console.log('here sorted matches for', dates[i], sortedMatches[dates[i]])
    }
    console.log('here is sorted matches were returning as a whole:', sortedMatches)
    return sortedMatches 
}

footballStats.getMatches = (matches) => {
    const resultsArray = []
  
    matches.forEach(match => {
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

footballStats.getStageMatches = async (stage) => {
    const resObj = await fetch(`https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/competitions/WC/matches?stage=${stage}`, { method:'GET',
     headers: {
         'X-Auth-Token':footballStats.apikey
        }
    })
    console.log('fetch result is', resObj)

    const jsonData = await resObj.json()
    console.log('json result is:', jsonData)
    return jsonData
    
}

footballStats.init = () =>{
    stages = ['GROUP_STAGE', 'LAST_16','QUARTER_FINALS', 'SEMI_FINALS','BRONZE', 'FINAL']
    nextStep = async () => {
        stagesMatches = []
        matches = await footballStats.getStageMatches(stages[0])
        console.log('inside async:', matches)
        for (i=0;i<stages.length;i++){
            console.log('this is before await')
            matches = await footballStats.getStageMatches(stages[i])
            stageMatches = {stage:stages[i], matches:matches}
            console.log('this comes after await', stageMatches)
            stagesMatches.push(stageMatches)
        }

        console.log('stagesMatch array after the loop',stagesMatches)
        uniqueDatesOfStages = {}
        matches = {}
        stagesMatches.forEach(stageMatches => {
            uniqueDatesOfStages[stageMatches.stage] = footballStats.getDates(stageMatches.matches.matches)
            matches[stageMatches.stage] = footballStats.getMatches(stageMatches.matches.matches)
        })
        console.log('unique dates:', uniqueDatesOfStages)
        console.log('matches:', matches)

        footballStats.sortedMatchesforStages = {}
        for (i in stages){
            console.log('stage is:', stages[i])
            // console.log('sorted matches for stage', stages[i],footballStats.sortByDate(uniqueDatesOfStages[stages[i]], matches[stages[i]]))
            footballStats.sortedMatchesforStages[stages[i]] = footballStats.sortByDate(uniqueDatesOfStages[stages[i]], matches[stages[i]])
            console.log('sorted matches for', stages[i] , footballStats.sortedMatchesforStages[stages[i]])
        }

        stagesClassNames = ['group-stage', 'round16', 'quarter-finals', 'semi-finals','bronze','final']
        stagesClassNames.forEach((stageClassName,i) => {
            footballStats.display(uniqueDatesOfStages[stages[i]], footballStats.sortedMatchesforStages[stages[i]], stageClassName)
        })

    }

    nextStep(stages)
        


}
    
    
footballStats.init();
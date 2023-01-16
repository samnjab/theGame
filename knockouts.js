// initialize namespace
const footballStats = {};
// initialize apikey
footballStats.randomizeApiKey = (array) => {
    return array[Math.floor(Math.random()*array.length)]
}

footballStats.convertDate = (utcDate) => {
    date = new Date(utcDate)
    return date.toDateString()
}

footballStats.getStageMatches = async (stage) => {
    footballStats.apikey = footballStats.randomizeApiKey(footballStats.apikeys)
    console.log('using key:', footballStats.apikey)
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

footballStats.createMatchDivs = (matches) => {
    const matchesWithDivs = matches.map(match => {
        const matchTemplate = document.querySelector('[data-match-box]')
        const matchDiv = matchTemplate.content.firstElementChild.cloneNode(true)
        matchDiv.querySelector('[data-date-header]').textContent = match.date.substring(4,10)
        
        matchDiv.querySelector('[data-flag-team1]').src = match.team1.flag
        matchDiv.querySelector('[data-team1-name]').textContent = `${match.team1.name}`
        matchDiv.querySelector('[data-team1-score]').textContent = `${match.team1.score.fullTime}`
        
        matchDiv.querySelector('[data-flag-team2]').src = match.team2.flag
        matchDiv.querySelector('[data-team2-name]').textContent = `${match.team2.name}`
        matchDiv.querySelector('[data-team2-score]').textContent = `${match.team2.score.fullTime}`
        
        return {match:match, matchDiv:matchDiv}
    })
    return matchesWithDivs

}

footballStats.createStageDivs = (stages) => {
    stagesWithDivs = stages.map(stage => {
        const stageTemplate = document.querySelector('[data-stage]')
        const stageDiv = stageTemplate.content.firstElementChild.cloneNode(true)
        stageDiv.querySelector('[data-stage-header]').textContent = stage.replace('_', ' ')
        stageDiv.setAttribute('id', `${stage}`)
        return {stage:stage, stageDiv:stageDiv}
    })
    return stagesWithDivs

}

footballStats.populateStages = (stageWithDiv, matchesWithDivs) =>{
    matchesWithDivs.forEach(matchWithDiv => {
        stageWithDiv.stageDiv.append(matchWithDiv.matchDiv)
    })
    document.querySelector('.standings').append(stageWithDiv.stageDiv)
}

footballStats.init = () =>{
    stages = ['LAST_16','QUARTER_FINALS', 'SEMI_FINALS', 'FINAL']
    // 'THIRD_PLACE'

    footballStats.apikeys = ['ce76110580a24979bfb7ae9dabb81570','70a843e5cf86426b9a1a9528ec8a7da7', '216fc317fce14a3e92c6759cc84f2ceb', '6a015959a852460a971b3fe44d9ddd99', '6db1d2cbe8a747be8e975a3e6dd86a4f']
    asyncNextStep = async () => {
        stagesMatches = []
        for (i=0;i<stages.length;i++){
            console.log('this is before await')
            matches = await footballStats.getStageMatches(stages[i])
            stageMatches = {stage:stages[i], matches:matches}
            console.log('this comes after await', stageMatches)
            stagesMatches.push(stageMatches)
        }
        console.log('stagesMatch array after the loop',stagesMatches)
        // uniqueDatesOfStages = {}
        matches = {}
        stagesMatches.forEach(stageMatches => {
            // uniqueDatesOfStages[stageMatches.stage] = footballStats.getDates(stageMatches.matches.matches)
            matches[stageMatches.stage] = footballStats.getMatches(stageMatches.matches.matches)
        })

        console.log('matches:', matches)
        
        stagesWithDivs = footballStats.createStageDivs(stages)

        matchesWithDivs ={}
        stages.forEach(stage => {
            matchesWithDivs[stage] = footballStats.createMatchDivs(matches[stage])
        })

        stagesWithDivs.forEach(stageWithDiv => {
            footballStats.populateStages(stageWithDiv, matchesWithDivs[stageWithDiv.stage])
        })
        

    }

    asyncNextStep(stages)
        


}
    
    
footballStats.init();
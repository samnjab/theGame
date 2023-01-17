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
    try{
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
    catch (error){
        const errorElement = document.createElement('p')
       errorElement.textContent = `${error.message}. 60s before API is pinged again`
        document.querySelector('.load-wrapp').classList.add('hide')
        document.querySelector('.standings').append(errorElement)
        setTimeout(footballStats.init, 60000)

    }
    
    
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
footballStats.indexInPrevious = (matches, team) => {
    console.log('looking @ previous stage team is', team)
    pick = matches.filter(match => {
        console.log('winner is', match.winner)
        return match.winner == team 
    })
    console.log('pick is', pick, 'its index:', matches.indexOf(pick))


    return matches.indexOf(pick[0])
}
footballStats.setOrder = (matches, matchesWithDivs, stage, stages) =>{ 
    index = stages.indexOf(stage)
    if (index != 0 && index != stages.length - 1){
        console.log('stage is', stages[index])
         console.log('before sorting matcheswithdivs looks like', matchesWithDivs)
        for (i=0; i< matchesWithDivs.length - 1; i++){
            console.log('looking at team', matchesWithDivs[i].match.team1.name)
            winner1 = footballStats.indexInPrevious(matches[stages[index - 1]], matchesWithDivs[i].match.team1.name)
            if (winner1 == -1){
                console.log('winner1 was -1 switching to team2')
                winner1 = footballStats.indexInPrevious(matches[stages[index - 1]], matchesWithDivs[i].match.team2.name)
            }
            console.log('its winner was at', winner1)
            console.log('looking at team', matchesWithDivs[i + 1].match.team1.name)
            winner2 = footballStats.indexInPrevious(matches[stages[index - 1]], matchesWithDivs[i + 1].match.team1.name)
            if (winner2 == -1){
                console.log('winner2 was -1 switching to team2')
                winner2 = footballStats.indexInPrevious(matches[stages[index - 1]], matchesWithDivs[i].match.team2.name)
            }
            console.log('its winner was at', winner2)
            if (winner1 > winner2){
                console.log('switching order')
                temp = matchesWithDivs[i]
                matchesWithDivs[i] = matchesWithDivs[i + 1]
                matchesWithDivs[i + 1] = temp
            }
            console.log('after one step of sorting matcheswithdivs looks like', matchesWithDivs)

        }
        
    }

    return matchesWithDivs
}

footballStats.orderFirstStage = (secondStageMatches, matchesWithDivs, stages) => {
    orderedMatches = []
    secondStageMatches.forEach(match => {
        pick1 = matchesWithDivs.filter(matchWithDiv => {
            return (matchWithDiv.match.team1.name == match.match.team1.name || matchWithDiv.match.team2.name == match.match.team1.name)
        })
        console.log('pushing', pick1[0])
        orderedMatches.push(pick1[0])
        pick2 = matchesWithDivs.filter(matchWithDiv => {
            return (matchWithDiv.match.team1.name== match.match.team2.name || matchWithDiv.match.team2.name == match.match.team2.name)
        })
        console.log('pushing', pick1[0])
        orderedMatches.push(pick2[0])
    })
    console.log('ordered matches of first stage', orderedMatchDivs)
    return orderedMatches

}

footballStats.populateStages = (stageWithDiv, orderedMatchDivs) =>{
    orderedMatchDivs.forEach(matchDiv=>{
         stageWithDiv.stageDiv.children[1].append(matchDiv.matchDiv)
        
    })
    document.querySelector('.standings').append(stageWithDiv.stageDiv)
}
footballStats.eventListeners = (orderedMatchDivs) => {
    document.querySelector('.prev').addEventListener('click', e => {
        document.getElementById('LAST_16').classList.remove('hide')
        document.getElementById('FINAL').classList.add('hide')
    })
    document.querySelector('.next').addEventListener('click', e => {
        document.getElementById('LAST_16').classList.add('hide')
        document.getElementById('FINAL').classList.remove('hide')
    })

    const formElement = document.querySelector('form')
    formElement.addEventListener('input', e => {
        e.preventDefault()
        const value = e.target.value.toLowerCase()
        for(stage in orderedMatchDivs){
            orderedMatchDivs[stage].forEach(matchDiv =>{
                isVisible = false
                if (matchDiv.match.team1.name.toLowerCase().includes(value) || matchDiv.match.team2.name.toLowerCase().includes(value)){
                    isVisible = true
                }
                matchDiv.matchDiv.classList.toggle('hide', !isVisible)
            })
        }
        
    })
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

        orderedMatchDivs = {}
        stages.forEach(stage => {
            orderedMatchDivs[stage] = footballStats.setOrder(matches, matchesWithDivs[stage], stage, stages)
        })
        orderedMatchDivs[stages[0]] = footballStats.orderFirstStage(orderedMatchDivs[stages[1]], matchesWithDivs[stages[0]], stages)
        
        console.log('ordered match divs', orderedMatchDivs)
        document.querySelector('.load-wrapp').classList.add('hide')
        stagesWithDivs.forEach(stageWithDiv => {
            footballStats.populateStages(stageWithDiv, orderedMatchDivs[stageWithDiv.stage])
        })

        document.getElementById('LAST_16').classList.add('hide')
        footballStats.eventListeners(orderedMatchDivs)
        

    }

    asyncNextStep(stages)
        


}
    
    
footballStats.init();
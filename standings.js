// initialize namespace
const footballStats = {};
// initialize apikey
// footballStats.apikey = '70a843e5cf86426b9a1a9528ec8a7da7';
footballStats.randomizeApiKey = (array) => {
    return array[Math.floor(Math.random()*array.length)]
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

footballStats.convertDate = (utcDate) => {
    date = new Date(utcDate)
    return date.toDateString()
}

footballStats.constructGroups = (num) => {
    groups = []
    for (i=0;i<=num;i++){
        let chr = String.fromCharCode(65 + i)
        groups.push(`GROUP_${chr}`) 
    }
    return groups
}

footballStats.sortByGroup = (matches, group) => {
    filteredMatches = matches.filter(match => {
        return match.group === group
    })
    return filteredMatches

}
footballStats.extractTeams = (matches) =>{
    teams = []
    matches.forEach(match =>{
        teams.push(match.team1.name)
        teams.push(match.team2.name)
    })
    uniqueTeams = [...new Set(teams)]
    teamsPlusFlags = uniqueTeams.map(team => {
        thisTeamsMatches = matches.filter(match=>{
            return (match.team1.name == team)
        })
        return {name:team, flag: thisTeamsMatches[0].team1.flag}
    })
    return teamsPlusFlags
}

footballStats.assignCircle = (team, matches) => {
    const teamTemplate = document.querySelector('[data-team-template]')
    const teamDiv = teamTemplate.content.cloneNode(true)
    teamDiv.querySelector('[data-team-name]').textContent = team.name
    teamDiv.querySelector('[data-team-flag]').src = team.flag
    const circleTemplate = document.querySelector('[data-circle-template')
    const checkMark = '\u2713'
    const crossMark = '\u2715'
    const dashMark = '\u2212'
    
    matches.forEach(match => {
        if (match.team1.name == team.name || match.team2.name == team.name){
            const circleDiv = circleTemplate.content.cloneNode(true)
            
            if (match.winner == team.name){
                circleDiv.querySelector('.filler').textContent = checkMark
                circleDiv.children[0].classList.add('green')
            }else if(match.winner == 'Draw'){
                circleDiv.querySelector('.filler').textContent = dashMark
                circleDiv.children[0].classList.add('grey')
            }else{
                circleDiv.querySelector('.filler').textContent = crossMark
                circleDiv.children[0].classList.add('red')
            }
            teamDiv.querySelector('[data-team-scores]').append(circleDiv)
        }
    })
    return {team:team, teamDiv:teamDiv}

}
footballStats.display = (groups)=>{
    groups.forEach(group => {
        const groupTemplate = document.querySelector('[data-group-template]')
        // const groupDiv = groupTemplate.content.cloneNode(true)
        const groupDiv = groupTemplate.content.firstElementChild.cloneNode(true)
        groupDiv.setAttribute('id', `${group}`)
        groupDiv.querySelector('[data-group-header]').textContent = group.replace('_',' ')
        const groupTable = groupDiv.querySelector('[data-group-table]')
        footballStats.teamsWithDivs[group] = []
        footballStats.teams[group].forEach(team => {
            teamWithDiv = footballStats.assignCircle(team, footballStats.filteredMatches[group])
            footballStats.teamsWithDivs[group].push(teamWithDiv)
            groupTable.append(teamWithDiv.teamDiv)
        })
        document.querySelector('.standings').append(groupDiv)
        console.log('group Div is', groupDiv)
    })
}


footballStats.eventListeners = (groups) => {
    const formElement = document.querySelector('form')
    formElement.addEventListener('input', e => {
        e.preventDefault()
        const value = e.target.value.toLowerCase()
        groups.forEach(group => {
            isVisible = false
            footballStats.teamsWithDivs[group].forEach(teamWithDiv => {
                if (teamWithDiv.team.name.toLowerCase().includes(value)){
                    isVisible = true  
                }
            })
            document.getElementById(`${group}`).classList.toggle('hide', !isVisible) 
        })
        
    })

}




footballStats.init = () =>{
    stages = ['GROUP_STAGE']
    // , 'LAST_16','QUARTER_FINALS', 'SEMI_FINALS','THIRD_PLACE', 'FINAL']
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
        // console.log('unique dates:', uniqueDatesOfStages)
        console.log('matches:', matches)

        // footballStats.sortedMatchesforStages = {}
        // for (i in stages){
        //     console.log('stage is:', stages[i])
        //     // console.log('sorted matches for stage', stages[i],footballStats.sortByDate(uniqueDatesOfStages[stages[i]], matches[stages[i]]))
        //     footballStats.sortedMatchesforStages[stages[i]] = footballStats.sortByDate(uniqueDatesOfStages[stages[i]], matches[stages[i]])
        //     console.log('sorted matches for', stages[i] , footballStats.sortedMatchesforStages[stages[i]])
        // }

        groups = footballStats.constructGroups(7)
        console.log(groups)
        footballStats.filteredMatches = {}
        groups.forEach(group => {
            footballStats.filteredMatches[group] = footballStats.sortByGroup(matches.GROUP_STAGE, group)
        })
        console.log(footballStats.filteredMatches)
        footballStats.teams ={}
        for (group in footballStats.filteredMatches){
            footballStats.teams[group] = footballStats.extractTeams(footballStats.filteredMatches[group])
        }
        console.log('teams object is', footballStats.teams)
        footballStats.teamsWithDivs = {}
        footballStats.display(groups)
        console.log('here are teams with their divs', footballStats.teamsWithDivs)
        
        footballStats.eventListeners(groups);
        
        
    }

    asyncNextStep(stages)
        


}
    
    
footballStats.init();
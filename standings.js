// initialize namespace
const footballStats = {};
// initialize apikey
footballStats.apikey = '70a843e5cf86426b9a1a9528ec8a7da7';



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
    return [...new Set(teams)]

}




footballStats.init = () =>{
    stages = ['GROUP_STAGE']
    // , 'LAST_16','QUARTER_FINALS', 'SEMI_FINALS','THIRD_PLACE', 'FINAL']
    nextStep = async () => {
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


    }

    nextStep(stages)
        


}
    
    
footballStats.init();
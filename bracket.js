// initialize namespace
const footballStats = {};
// initialize apikey
footballStats.apikey = '216fc317fce14a3e92c6759cc84f2ceb';

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
    }
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

footballStats.extractStageMatches = async (stagesJsonDataPromise) => {
    stagesMatches = []
    
    await stagesJsonDataPromise.forEach((stageJsonDataPromise) => {
        
        stageJsonDataPromise.matchesPromise.then(stageJsonData => {
            // console.log(stageJsonData)
            stagesMatches.push( {stage:stageJsonDataPromise.stage, matches: stageJsonData})
            // console.log(stagesMatches)
        })

    })
    // console.log(stagesMatches)
    return stagesMatches
    
}
footballStats.unpackPromiseArray = (promiseArray) => {
    stageMatches =[]
    return new Promise((resolve, reject) =>{
        promiseArray.forEach((promiseObj) => {
            promiseObj.matchesPromise.then((matches)=>{
                console.log('here are the matches:', matches)
                stageMatches.push({stage:promiseObj.stage, matches:matches})
                console.log('pushed:', {stage:promiseObj.stage, matches:matches})
            })
        })
    if (stageMatches != []){
        console.log('we got resolve, here is stageMatches', stageMatches )
        resolve(stageMatches)
    }else{
        reject('could not unpack')
    }
    })

}


footballStats.init = () =>{
    stages = ['GROUP_STAGE', 'LAST_16','QUARTER_FINALS', 'SEMI_FINALS', 'FINAL']
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
        sortedMatches = {}
        for (i in stages){
            sortedMatches[stages[i]] = footballStats.sortByDate(uniqueDatesOfStages[stages[i]], matches[stages[i]])
            console.log('sorted matches:',sortedMatches)
        }


    }
    nextStep(stages)
        


}
    
    
footballStats.init();
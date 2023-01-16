// initialize namespace
const footballStats = {};
// initialize apikey
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

footballStats.init = () =>{
    stages = ['GROUP_STAGE']
    // , 'LAST_16','QUARTER_FINALS', 'SEMI_FINALS','THIRD_PLACE', 'FINAL']
    footballStats.apikeys = ['ce76110580a24979bfb7ae9dabb81570','70a843e5cf86426b9a1a9528ec8a7da7', '216fc317fce14a3e92c6759cc84f2ceb', '6a015959a852460a971b3fe44d9ddd99']
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
// initialize namespace
const footballStats = {};
// initialize apikey

// footballStats.apikey = '70a843e5cf86426b9a1a9528ec8a7da7';
footballStats.randomizeApiKey = (array) => {
    return array[Math.floor(Math.random()*array.length)]
}


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
footballStats.eventListeners = () => {
    const buttons = document.querySelectorAll('button')
    const slides = document.querySelectorAll('.slide')
    const activeSlide = document.querySelector('[data-active]')
    console.log('active slide was', activeSlide)
    const sideSlides = document.querySelectorAll('.side')
    console.log('here are the side slides before anything', sideSlides)
    const clickIndexArray = []
    oldActiveIndex = [...slides].indexOf(activeSlide)
    indexArray = [...sideSlides].map((sideSlide) =>{
        return [...slides].indexOf(sideSlide)
    })
    indexArray.splice(1, 0, oldActiveIndex)
    console.log('this is the current index array',indexArray)
    clickIndexArray.push(indexArray)
    buttons.forEach(button => {
        
        button.addEventListener('click', e =>{
            console.log('this is the current array inside event', clickIndexArray[clickIndexArray.length - 1])
            if (button.dataset.carouselButton == 'next'){
                shift = 1
            }else{
                shift = -1
            }
           
            if (shift == 1){
                slides[clickIndexArray[clickIndexArray.length - 1][0]].classList.remove('side')
                console.log('removed side from',slides[clickIndexArray[clickIndexArray.length - 1][0]])
                slides[clickIndexArray[clickIndexArray.length - 1][0]].classList.add('hide')
                console.log('added hide to',slides[clickIndexArray[clickIndexArray.length - 1][0]])
            }else if(shift == -1){
                slides[clickIndexArray[clickIndexArray.length - 1][clickIndexArray[clickIndexArray.length - 1].length - 1]].classList.remove('side')
                console.log('removed side from',  slides[clickIndexArray[clickIndexArray.length - 1][clickIndexArray[clickIndexArray.length - 1].length - 1]])
                slides[clickIndexArray[clickIndexArray.length - 1][clickIndexArray[clickIndexArray.length - 1].length - 1]].classList.add('hide')
                console.log('added hide to', slides[clickIndexArray[clickIndexArray.length - 1][clickIndexArray[clickIndexArray.length - 1].length - 1]])
            }

            newIndexArray = clickIndexArray[clickIndexArray.length - 1].map(index => {
               if (index + shift >= slides.length){
                   return 0

               }else if(index + shift < 0){
                   return slides.length - 1 
               }else{
                   return index + shift
               }
           })
           console.log('this is the new index array', newIndexArray)
           clickIndexArray.push(newIndexArray)
            
            newIndexArray.forEach(index => {
                console.log('class list to begin with is',[...slides[index].classList])
                console.log('active state of:', slides[index],'to begin with:', slides[index].dataset.active)
                const classes = [...slides[index].classList]
                
                if (classes.indexOf('hide') != -1){
                    slides[index].classList.remove('hide')
                    console.log('removed hide from', slides[index])
                    slides[index].classList.add('side')
                    console.log('added side to', slides[index])
                    
                }else if(classes.indexOf('side') != -1){
                    slides[index].classList.remove('side')
                    console.log('removed side from', slides[index])
                    slides[index].dataset.active = true
                    console.log('added active to', slides[index])
                    
                }else if(slides[index].dataset.active){
                    delete slides[index].dataset.active
                    console.log('removed active from', slides[index])
                    slides[index].classList.add('side')
                    console.log('added side to', slides[index])
    
                }

            })
            if (newIndexArray[1]== 5){
                console.log("we're swapping")
                document.querySelector('.carousel').insertBefore(document.querySelector('.bronze'), document.querySelector('.group-stage'))
                
            }
            if (newIndexArray[1] == 0){
                console.log("we're swapping")
                document.querySelector('.carousel').insertBefore(document.querySelector('.final'), document.querySelector('.round16'))

            }
            
        })
    })
}

footballStats.init = () =>{
    stages = ['GROUP_STAGE', 'LAST_16','QUARTER_FINALS', 'SEMI_FINALS','THIRD_PLACE', 'FINAL']
    footballStats.apikeys = ['ce76110580a24979bfb7ae9dabb81570','70a843e5cf86426b9a1a9528ec8a7da7', '216fc317fce14a3e92c6759cc84f2ceb', '6a015959a852460a971b3fe44d9ddd99']
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
            document.querySelector('.load-wrapp').classList.add('hide')
            footballStats.display(uniqueDatesOfStages[stages[i]], footballStats.sortedMatchesforStages[stages[i]], stageClassName)
        })
        const activeSlide = document.querySelector('[data-active]')
        console.log('active slide is', activeSlide)
        const sideSlides = document.querySelectorAll('.side')
        console.log('these are the side slides', sideSlides)


        footballStats.eventListeners()

    }

    nextStep(stages)
        


}
    
    
footballStats.init();
// initialize namespace
const footballStats = {};
// initialize apikey
footballStats.apikey = '216fc317fce14a3e92c6759cc84f2ceb';
footballStats.getData = (url) => {
    // setup url: endpoint https://api.football-data.org/v4/competitions/WC/matches?stage=${stage}
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


const getStage = async (stage) => {

    const resObj = await fetch(`https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/competitions/WC/matches?${stage}`, { method:'GET',
     headers: {
         'X-Auth-Token':footballStats.apikey
        }
    })

    const jsonData = await resObj.json()
    return jsonData
    
}

footballStats.init = () =>{
    stages = ['GROUP_STAGE', 'QUARTER_FINALS', 'SEMI_FINALS', 'FINAL']
    stagesJsonData = stages.map((stage) => {
        return getStage(stage)
    })
    console.log(stagesJsonData)


}
footballStats.init();
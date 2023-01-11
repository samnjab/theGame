// initialize namespace
const footballStats = {};
// initialize apikey
footballStats.apikey = '216fc317fce14a3e92c6759cc84f2ceb';

const getStage = async (stage) => {

    const resObj = await fetch(`https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/competitions/WC/matches?stage=${stage}`, { method:'GET',
     headers: {
         'X-Auth-Token':footballStats.apikey
        }
    })

    const jsonData = await resObj.json()
    return jsonData
    
}

footballStats.init = () =>{
    stages = ['GROUP_STAGE', 'QUARTER_FINALS', 'SEMI_FINALS', 'FINAL']
    stagesJsonDataPromise = stages.map((stage) => {
        return getStage(stage)
    })
    Promise.all(stagesJsonDataPromise).then(stageJsonData => {
        console.log(stageJsonData)

    })


}
footballStats.init();
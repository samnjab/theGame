const plSchedule = {};

plSchedule.getSchedule = () => {

    fetch('https://proxy-ugwolsldnq-uc.a.run.app/?url=https://api.football-data.org/v4/competitions/CL/matches', {
        method: 'GET',
        headers: {
            'X-Auth-Token': '216fc317fce14a3e92c6759cc84f2ceb',
        },
        mode: 'cors',
        cache: 'default',
    })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            console.log(res)
  
        })
}


plSchedule.init = () => {
    // console.log(imageGallery);
    plSchedule.getSchedule();
    
};

plSchedule.init();
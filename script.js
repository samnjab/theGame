const plSchedule = {};

plSchedule.apiKey = '216fc317fce14a3e92c6759cc84f2ceb';

plSchedule.getSchedule = () => {

    
    // url = 'https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/teams/86/matches'
    // headers = {'X-Auth-Token': plSchedule.apiKey}

    // fetch(url, headers=headers)
    fetch('https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/competitions/WC', {
        method: 'GET',
        headers: {
            'X-Auth-Token': '216fc317fce14a3e92c6759cc84f2ceb',
        }, 
        // status: 'SCHEDULED'
    })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            console.log(res);
        })
}


plSchedule.init = () => {
    // console.log(imageGallery);
    plSchedule.getSchedule();
    
};

plSchedule.init();
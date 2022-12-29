const plSchedule = {};

plSchedule.apiKey = 'Auth-token';

plSchedule.getSchedule = () => {

    
    // url = 'https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/teams/86/matches'
    // headers = {'X-Auth-Token': plSchedule.apiKey}

    // fetch(url, headers=headers)
    fetch('https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/competitions/WC/standings', {
        method: 'GET',
        headers: {
            'X-Auth-Token': '216fc317fce14a3e92c6759cc84f2ceb',
        },
        competitions: '2021',
        dateFrom: '2022-01-01',
        DateTo: '2022-10-31',
        mode: 'cors',
        cache: 'default',
    })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            console.log(res);
        })
}


plSchedule.init = () => {
     plSchedule.getSchedule();
    
};

plSchedule.init();

const plSchedule = {};

plSchedule.apiKey = 'Auth-token';

plSchedule.getSchedule = () => {

    
    // url = 'https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/teams/86/matches'
    // headers = {'X-Auth-Token': plSchedule.apiKey}

    // fetch(url, headers=headers)
    fetch('https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/competitions/WC', {
        method: 'GET',
        headers: {
            'X-Auth-Token': 'Auth-token',
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
    // console.log(imageGallery);
    plSchedule.getSchedule();
    
};

plSchedule.init();
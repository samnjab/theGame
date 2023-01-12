const fifaMatch = {};
fifaMatch.apiKey = '216fc317fce14a3e92c6759cc84f2ceb';

fifaMatch.getData = () => {
    //endpoint url
    const urls = [
        'https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/competitions/WC/matches',
        'https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/competitions/WC/teams'
    ];
    
    //header params
    urls.search = new URLSearchParams({
        season: '2022',
        cache: 'default'
    })

const teamsAndPlayers = urls.map(url => {
    return fetch(url, {
        method: 'GET',
        headers: {
            'X-Auth-Token': fifaMatch.apiKey,
        },
    })
        .then((res) => {
            return res.json();
        })
        .then((resData) => {
            // console.log(res);
            return resData;
        })
    } // End of getSchedule/Fetch

    )

    Promise.all(teamsAndPlayers)
            .then((teamData => { //opens access through the promise wrapper
              console.log(teamData);
              fifaMatch.displayMatches(teamData);
            //   this is how you can access the json results in pokemonPromiseObjects
            }))

}
    

fifaMatch.displayMatches = function(teamData) {

    console.log(teamData[1].teams);
    teamObject = teamData[1].teams;

    console.log(teamObject[2].crest)

    for (let i = 0; i <teamObject.length; i++) {

        // Header-title for Match Dates
            const teamContainer = document.createElement('div');
            teamContainer.classList.add('teamBox');
 
        // Team div
            // const getSquad = document.createElement('a')
            // getSquad.src = 

            const teamDiv = document.createElement('div');
            teamDiv.classList.add('team');
            teamContainer.appendChild(teamDiv); //append team1 div to matches div

            const imageTeamDiv = document.createElement('div');
            imageTeamDiv.classList.add('img-box')
            teamDiv.appendChild(imageTeamDiv); //append image div into away team div

            const teamFlag = document.createElement('img');
            teamFlag.src = teamObject[i].crest;
            teamFlag.alt = 'team flag';
            imageTeamDiv.appendChild(teamFlag); //append team1 flag to team1 div

            const teamInfoBox = document.createElement('div');
            teamInfoBox.classList.add('teamInfo');
            teamDiv.appendChild(teamInfoBox);

            const countryName = document.createElement('p');
            countryName.innerText = 
                `Country : ${teamObject[i].name}
                Team Founded : ${teamObject[i].founded}
                Coach : ${teamObject[i].coach.name}`;
            teamInfoBox.appendChild(countryName);

            // const coachName = document.createElement('p');
            // countryName.innerText = `Coach : ${teamObject[i].coach.name}`;
            // teamInfoBox.appendChild(coachName);


        // appends everything to the team container efter every element is created and loaded
        document.querySelector('.container').appendChild(teamContainer); //Appends the team container to the page
        
    }
    
}


fifaMatch.init = () => {
     fifaMatch.getData();
   
}; //end of init function

fifaMatch.init();



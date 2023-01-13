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
              fifaMatch.displayTeams(teamData);
            }))

}
    

fifaMatch.displayTeams = function(teamData) {

    const squadData = teamData[1];
    const teamObject = teamData[1].teams;
    

    for (let i = 0; i <teamObject.length; i++) {

            const teamContainer = document.createElement('div');
            teamContainer.classList.add('teamBox');

            const teamDiv = document.createElement('div');
            teamDiv.classList.add('team');
            teamContainer.appendChild(teamDiv); //append team1 div to matches div

            const imageTeamDiv = document.createElement('div');
            imageTeamDiv.classList.add('img-box')
            imageTeamDiv.setAttribute("data-index",[i]);
            teamDiv.appendChild(imageTeamDiv); //append image div into away team div

            const teamFlag = document.createElement('img');
            teamFlag.src = teamObject[i].crest;
            teamFlag.alt = 'team flag';
            imageTeamDiv.appendChild(teamFlag); //append team1 flag to team1 div

            const teamInfoBox = document.createElement('div');
            teamInfoBox.classList.add('teamInfo');
            teamInfoBox.setAttribute("data-index",[i]);
            teamDiv.appendChild(teamInfoBox);

            const countryName = document.createElement('p');
            countryName.innerText = 
                `${teamObject[i].name}
                Team Founded : ${teamObject[i].founded}
                Coach : ${teamObject[i].coach.name}`;
            teamInfoBox.appendChild(countryName);

            // const coachName = document.createElement('p');
            // countryName.innerText = `Coach : ${teamObject[i].coach.name}`;
            // teamInfoBox.appendChild(coachName);


        // appends everything to the team container efter every element is created and loaded
        document.querySelector('.container').appendChild(teamContainer); //Appends the team container to the page
        
    }
    fifaMatch.getTeamIndex(squadData);
    
}

//add search to Player Page
//use the input box to seacrh squad from array
//clear the page
//append the player and info to the page

//get the index number of team that is being clicked on
//use the index number to get the array of the same teams 'squad' from the data
//target the atheletes page
//append squad to athletes page

fifaMatch.getSquad = (arrayIndex, squadData) => {
    const container = document.querySelector('.container');
    container.innerHTML = "";

    const squadIndex = arrayIndex;
    const squadObject = squadData;
    
    
    const squadList = squadObject.teams[squadIndex].squad;
    console.log(squadList);
    

    for (let i = 0; i < squadList.length; i++) {
        
        //container for athlete profile
        const athleteContainer = document.createElement('div');
        athleteContainer.classList.add('athleteBox');
        container.appendChild(athleteContainer);

        //display the athlete profile
        const playerInfo = document.createElement('div');
        playerInfo.classList.add('player');
        athleteContainer.appendChild(playerInfo);

        //display the name, position, birthdate
        const profileText = document.createElement('p');
        // playerText.classList.add('profile');
        profileText.innerText =
            `Player : ${squadList[i].name}
            Nationality : ${squadList[i].nationality}
            Position : ${squadList[i].position}
            Date Of Birth : ${squadList[i].dateOfBirth}
            `;
        playerInfo.appendChild(profileText);

    }
    
}


fifaMatch.getTeamIndex = (squadData) => {
    const teamIndex = document.querySelectorAll('.teamInfo');
    // const FlagIndex = document.querySelectorAll('.img-box');

        teamIndex.forEach(teamIndex => {
        teamIndex.addEventListener('click', (e) => {
        const arrayIndex = teamIndex.getAttribute('data-index');
        // console.log(arrayIndex);

        fifaMatch.getSquad(arrayIndex, squadData);
        })
    
    })
    
}

fifaMatch.init = () => {
     fifaMatch.getData();
   
}; //end of init function

fifaMatch.init();



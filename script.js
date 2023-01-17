const fifaMatch = {};
// fifaMatch.apiKey = '216fc317fce14a3e92c6759cc84f2ceb';
fifaMatch.randomizeApiKey = (array) => {
    return array[Math.floor(Math.random()*array.length)]
}

fifaMatch.getData = () => {
    //endpoint url
    const urls = [
        'https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/competitions/WC/matches',
        'https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/competitions/WC/teams',
        'https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/competitions/WC/scorers'
    ];
    
    //header params
    urls.search = new URLSearchParams({
        season: '2022',
        cache: 'default'
    })
    fifaMatch.apikey = fifaMatch.randomizeApiKey(fifaMatch.apikeys)
    // console.log('using key:', fifaMatch.apikey)
    
    const teamsAndPlayers = urls.map(url => {
        return fetch(url, {
            method: 'GET',
            headers: {
                'X-Auth-Token': fifaMatch.apikey,
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((resData) => {
                // console.log(res);
                document.querySelector('.load-wrapp').classList.add('hide')
                return resData;
            })
        } // End of getSchedule/Fetch
    
        )

    Promise.all(teamsAndPlayers)
            .then((teamData => { //opens access through the promise wrapper
              fifaMatch.displayTeams(teamData);
              fifaMatch.getAllPlayers(teamData);
              fifaMatch.displayTopScorers(teamData);
            }))

}

fifaMatch.getAllPlayers = function(teamData) {
    const teamArray = teamData[1].teams;
    let allPlayers = [];
    for(let i = 0; i < teamArray.length; i++) {
        allPlayers.push(teamArray[i].squad);
    }
   
    //List of 835 players from WC 2022!
    mergedList = allPlayers.flat(1);

    fifaMatch.displayAllPlayers(teamArray);
    fifaMatch.searchPlayers(mergedList);

} 

fifaMatch.searchPlayers = (mergedList) => {
    const theList = mergedList;
    console.log(theList);

    const textToSearch = document.querySelector('form');
    console.log(textToSearch);
    textToSearch.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const input = document.querySelector('input');

        const value = input.value;
        console.log(value);
        const responseList = [];

        for(let i = 0; i < theList.length; i++) {
            
            const player = theList[i].name.toLowerCase();
            // console.log(player);

            if(player.includes(value)) {
                console.log(player);
                responseList.push(theList[i]);
            } 
            
    }
    console.log(responseList);
    fifaMatch.searchDisplay(responseList)
    })

}

fifaMatch.searchDisplay = (responseList) => {
    const container = document.querySelector('.wc-flexBox');
    container.innerHTML = "";
    const inputList = responseList;

        inputList.forEach(squadList => {
            //container for athlete profile
        const athleteContainer = document.createElement('div');
        athleteContainer.classList.add('athleteBox');
        container.appendChild(athleteContainer);

        // const imageTeamDiv = document.createElement('div');
        // imageTeamDiv.classList.add('img-box');
        // athleteContainer.appendChild(imageTeamDiv); 

        // const teamCrest = squadObject.teams[squadIndex].crest;
        // const teamFlag = document.createElement('img');
        // teamFlag.src = teamCrest;
        // teamFlag.alt = 'team flag';
        // imageTeamDiv.appendChild(teamFlag); 

        //display the athlete profile
        const playerInfo = document.createElement('div');
        playerInfo.classList.add('player');
        athleteContainer.appendChild(playerInfo);
        
        //display the name, position, birthdate
        const date = new Date(squadList.dateOfBirth);
        const bornOn = date.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
        const profileText = document.createElement('p');
        // playerText.classList.add('profile');
        profileText.innerText = 
            `Player : ${squadList.name}
             Country : ${squadList.nationality}            
             Position : ${squadList.position}
             Date Of Birth : ${bornOn}
            `;
        playerInfo.appendChild(profileText);

        })
    

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


        // appends everything to the team container efter every element is created and loaded
        document.querySelector('.main-container').appendChild(teamContainer); //Appends the team container to the page
        
    }
    fifaMatch.getTeamIndex(squadData);
    
}

fifaMatch.getSquad = (arrayIndex, squadData) => {
    const container = document.querySelector('.main-container');
    container.innerHTML = "";

    const buttonBox = document.createElement('div');
    buttonBox.classList.add('refreshBox');
    container.appendChild(buttonBox);

    const refresh = document.createElement('button');
    refresh.innerText = "< Back to teams"
    refresh.setAttribute("type", "button")
    refresh.setAttribute("value", " Back to teams")
    refresh.setAttribute("onClick", "window.location.reload()")
    buttonBox.appendChild(refresh);

    const squadIndex = arrayIndex;
    const squadObject = squadData;

    const squadList = squadObject.teams[squadIndex].squad;

    for (let i = 0; i < squadList.length; i++) {
        
        //container for athlete profile
        const athleteContainer = document.createElement('div');
        athleteContainer.classList.add('athleteBox');
        container.appendChild(athleteContainer);

        const imageTeamDiv = document.createElement('div');
        imageTeamDiv.classList.add('img-box');
        athleteContainer.appendChild(imageTeamDiv); 

        const teamCrest = squadObject.teams[squadIndex].crest;
        const teamFlag = document.createElement('img');
        teamFlag.src = teamCrest;
        teamFlag.alt = 'team flag';
        imageTeamDiv.appendChild(teamFlag); 

        //display the athlete profile
        const playerInfo = document.createElement('div');
        playerInfo.classList.add('player');
        athleteContainer.appendChild(playerInfo);
        
        //display the name, position, birthdate
        const date = new Date(squadList[i].dateOfBirth);
        const bornOn = date.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
        const profileText = document.createElement('p');
        // playerText.classList.add('profile');
        profileText.innerText = 
            `Player : ${squadList[i].name}
             Position : ${squadList[i].position}
             Date Of Birth : ${bornOn}
            `;
        playerInfo.appendChild(profileText);
    }

}

fifaMatch.displayAllPlayers = (teamArray) => {
    const container = document.querySelector('.scorer-container');
    container.innerHTML = "";
    const allArray = teamArray;
    // console.log(allArray);
    let randomArray = [];
    // console.log(randomArray);

for (let i = 0; i < 25; i++) {
   
    const teamIndex = Math.floor(Math.random() * allArray.length);
   const team = allArray[teamIndex];
   const flag = team.crest;
   const country = team.name;
   const playerIndex = Math.floor(Math.random() * team.squad.length);
   const player = team.squad[playerIndex];
    // console.log(country);

    //container for athlete profile
   const allTab = document.querySelector('.wc-flexBox');
  
   const playerBox = document.createElement('div');
   playerBox.classList.add('playerBox');
   allTab.appendChild(playerBox);
  
   const imageTeamDiv = document.createElement('div');
   imageTeamDiv.classList.add('img-box');
   playerBox.appendChild(imageTeamDiv); 

   const teamCrest = flag; //stopped here
   const teamFlag = document.createElement('img');
   teamFlag.src = teamCrest;
   teamFlag.alt = 'team flag';
   imageTeamDiv.appendChild(teamFlag); 

   //display the athlete profile
   const playerInfo = document.createElement('div');
   playerInfo.classList.add('player');
   playerBox.appendChild(playerInfo);
   
   //display the name, position, birthdate
   const date = new Date(player.dateOfBirth);
   const bornOn = date.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
   const profileText = document.createElement('p');
   // playerText.classList.add('profile');
   profileText.innerText = 
       `Country : ${country}
        Player : ${player.name}
        Position : ${player.position}
        Date Of Birth : ${bornOn}
       `;
   playerInfo.appendChild(profileText);
}
        //end of random player plus flag
    
    }


fifaMatch.displayTopScorers = (teamData) => {
    const container = document.querySelector('.scorer-container');
    container.innerHTML = "";

    const topArray = teamData[2];
    const scoreArray = topArray.scorers;
    const topTab = document.getElementById('top-scorers');
    const topContainer = document.createElement('div');
    topTab.appendChild(topContainer);

    scoreArray.forEach(stats => {
        
         //container for athlete profile
        const athleteContainer = document.createElement('div');
        athleteContainer.classList.add('statsBox');
        topContainer.appendChild(athleteContainer);

        const imageTeamDiv = document.createElement('div');
        imageTeamDiv.classList.add('img-box');
        athleteContainer.appendChild(imageTeamDiv); 

        const teamCrest = stats.team.crest;
        const teamFlag = document.createElement('img');
        teamFlag.src = teamCrest;
        teamFlag.alt = 'team flag';
        imageTeamDiv.appendChild(teamFlag); 

         //display the athlete profile
        const playerInfo = document.createElement('div');
        playerInfo.classList.add('player');
        athleteContainer.appendChild(playerInfo);

        //display the name, position, birthdate
        const date = new Date(stats.player.dateOfBirth);
        const bornOn = date.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
        const profileText = document.createElement('p');
        
        profileText.innerText = 
            `Country : ${stats.team.name}
             Player : ${stats.player.name}
             Position : ${stats.player.position}
             Date Of Birth : ${bornOn}
            `;
        playerInfo.appendChild(profileText);

        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cellDiv');
        athleteContainer.appendChild(cellDiv);

        const goalDiv = document.createElement('div')
        goalDiv.classList.add('statsCell');
        cellDiv.appendChild(goalDiv);
        goalDiv.innerText = `Goals: ${stats.goals}`;

        const assistsDiv = document.createElement('div')
        assistsDiv.classList.add('statsCell');
        cellDiv.appendChild(assistsDiv);
        assistsDiv.innerText = `Assists: ${(stats.assists === null ? '0' : stats.assists)}`;

        const penaltyDiv = document.createElement('div')
        penaltyDiv.classList.add('statsCell');
        cellDiv.appendChild(penaltyDiv);
        penaltyDiv.innerText = `Penalties: ${(stats.penalties === null ? '0' : stats.penalties)}`;

    })

}

fifaMatch.getTeamIndex = (squadData) => {
    const teamIndex = document.querySelectorAll('.teamInfo, .img-box');

        teamIndex.forEach(teamIndex => {
        teamIndex.addEventListener('click', (e) => {
        const arrayIndex = teamIndex.getAttribute('data-index');
            // console.log(arrayIndex);

        fifaMatch.getSquad(arrayIndex, squadData);
        })
    
    })
    
}

const tabs = document.querySelectorAll('[data-tab-target]')
const tabContents = document.querySelectorAll('[data-tab-content]')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget)
       
        tabContents.forEach(tabContent => {
        tabContent.classList.remove('active')
        })

        tabs.forEach(tab => {
        tab.classList.remove('active')
        })
        
        tab.classList.add('active')
        target.classList.add('active')
    })
})

fifaMatch.init = () => {
    fifaMatch.apikeys = ['ce76110580a24979bfb7ae9dabb81570','70a843e5cf86426b9a1a9528ec8a7da7', '216fc317fce14a3e92c6759cc84f2ceb', '6a015959a852460a971b3fe44d9ddd99', '6db1d2cbe8a747be8e975a3e6dd86a4f']
    fifaMatch.getData();
   
}; //end of init function

fifaMatch.init();



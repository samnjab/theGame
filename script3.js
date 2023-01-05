const footballApi = {}

footballApi.apiUrl = 'https://v3.football.api-sports.io/status'
footballApi.apiKey = ''
footballApi.headers = new Headers();
footballApi.headers.append('x-rapidapi-key', 'e85f6f8efa9f74e2373302764ff148df')
footballApi.headers.append('x-rapidapi-host', 'v3.football.api-sports.io')
requestOptions = {
    method:'GET',
    headers:footballApi.headers,
    redirect:'follow'
}



footballApi.getData = () => {
    const url = new URL(footballApi.apiUrl)
    // url.search = {
    // }
    fetch(url, requestOptions)
    .then((res)=>{
        return res.json()
    })
    .then((jsonData)=>{
        console.log(jsonData)
    })
    .catch((error) => {
        console.log('error', error)
    })

}

footballApi.init = () =>{
    footballApi.getData()
}

footballApi.init()
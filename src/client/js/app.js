const axios = require('axios');

// Current object
const obj={
    temp_max: 0,
    temp_min: 0,
    description: "",
    bool: true
}

// Saved element array
let saved=[];

// Obtain city's coordinate
export const getCoordinatesAPI = async (city = '', country = '', date = '') => {

    // Time Array
    const timeArr = date.split('-');
    const currentTime = new Date().getTime();
    const futureTime = new Date(parseInt(timeArr[0]),parseInt(timeArr[1])-1,parseInt(timeArr[2])).getTime();
    obj.daysLeft = parseInt((futureTime - currentTime)/86400000)+1;

    // Get data geonames
    const url = `http://api.geonames.org/searchJSON?q=${city}&countryName=${country}&maxRows=1&username=jahongirhacking`;
    axios.get(url)
    .then((res) => res.data)
    .then((data) => {
        if(data.totalResultsCount>0 && city!='' && date!='' && obj.daysLeft>=0 && obj.daysLeft<=16){
            
            // During the searching, -> blur
            Client.hide("blur");
            axios.post('/newPlacePost',data.geonames[0])
            // After posting Geo data
            .then((el)=>{
                // Receive precious data from server
                axios.get('/newPlaceGet')
                .then((res) => res.data)
                .then((data) => {
                    obj.lat = data.lat;
                    obj.lng = data.lng;
                    obj.geonameId = data.geonameId;
                    obj.name = data.name;
                    obj.countryName = data.countryName;
                    obj.date = date;
                })
                // Obtain Weather Data
                .then((e) => {
                    getWeather(obj.lat, obj.lng, obj.daysLeft);
                })
                // Obtain Image
                .then((e) => {
                    getImageAPI(`${obj.name}+${obj.countryName}`);
                })
                .catch(err => console.error(err))
            })

        }else{
            alert("Sorry, the data was not found or expired, please try again!");
            //Then delete the expired data on saved list
        }
        
    })
    .catch(err => console.log(err))
    
}

const getWeather = async (lat, lng, daysLeft) => {

    const openWeatherApiKey="62f5922de50fd90ff14ef5af29eb8380";
    const weatherbitKey="a7a672cba2b04eef8d1752ccbc13b6bd";
    //if within a week
    if(daysLeft<=7){
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${openWeatherApiKey}`)
        .then(res => res.data)
        .then(data => {
            obj.temp_min = parseInt(data.main.temp_min-273.15);
            obj.temp_max = parseInt(data.main.temp_max-273.15);
            obj.description = data.weather[0].description;
            return 1;
        })
        .catch(err => console.error(err)); 
    }else{
        const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${weatherbitKey}`;
        axios(url)
        .then(res => res.data)
        .then(newres => newres.data)
        .then(data => {
            for(let i=0;i<data.length;i++){
                if(data[i].valid_date==obj.date){
                    obj.temp_max=data[i].max_temp;
                    obj.temp_min=data[i].min_temp;
                    obj.description=data[i].weather.description;
                    break;
                }
            }
            return 1;
        })
        .catch(err => console.error(err));
    }
    
    
}

const getImageAPI = async (keyword) => {

    const PIXABAY_API_KEY="25767911-929028c939b438b835216b326";
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${keyword}&image_type=photo&pretty=true`;
    axios.get(url)
    .then(res => res.data)
    .then(data => {
        if(data.totalHits>0) obj.image = data.hits[0].largeImageURL;
        else obj.image = './img/no_img.png';
        
    })
    .then((e) => {
        // Update the UI
        setTimeout(updateUI,1500);
    })
    .catch(err => console.error(err))
    
}

function updateUI(){
    Client.hide("blur");
    // clear
    document.getElementById('city').value = "";
    document.getElementById('country').value = "";
    document.getElementById('date').value = "";
    // update
    const where=document.querySelectorAll(".where_info");
    for(let el of where) el.textContent = `${obj.name}, ${obj.countryName}`;
    document.querySelector("h2>.date_info").textContent = obj.date;
    document.querySelector('p>.how_much_time').textContent = obj.daysLeft;
    document.querySelector('#temp>.high').textContent = obj.temp_max+" C";
    document.querySelector('#temp>.low').textContent = obj.temp_min+" C";
    document.querySelector('#situation>span').textContent = obj.description;
    document.querySelector("#img>img").src = `${obj.image}`;
    
    if(saved.includes(obj.geonameId)) obj.bool=false;
    else obj.bool=true; 
    // Save and remove Buttons
    if(obj.bool) {
        document.querySelector(".info>.buttons>.remove").classList.add("__passive");
        document.querySelector(".info>.buttons>.save").classList.remove("__passive");

        document.querySelector(".info>.buttons>.save").addEventListener("click",saveEvent);
    }else{
        document.querySelector(".info>.buttons>.remove").classList.remove("__passive");
        document.querySelector(".info>.buttons>.save").classList.add("__passive");

        document.querySelector(".info>.buttons>.remove").addEventListener("click",removeEvent);
    }
}

function saveEvent(e){
    document.getElementById("saved_places").appendChild(Client.saved_place(obj.name, obj.countryName, obj.date, obj.bool));
    obj.bool=false;
    saved.push(obj.geonameId);
    document.querySelector(".info>.buttons>.remove").classList.remove("__passive");
    document.querySelector(".info>.buttons>.save").classList.add("__passive");   
    document.querySelector(".info>.buttons>.save").removeEventListener("click",saveEvent);
    document.querySelector(".info>.buttons>.remove").addEventListener("click",removeEvent);
}

function removeEvent(e){
    document.querySelectorAll("#saved_places>div.places")[saved.indexOf(obj.geonameId)].remove();
    obj.bool=true;
    saved.splice(saved.indexOf(obj.geonameId),1);
    document.querySelector(".info>.buttons>.remove").classList.add("__passive");
    document.querySelector(".info>.buttons>.save").classList.remove("__passive");
    document.querySelector(".info>.buttons>.remove").removeEventListener("click",removeEvent);
    document.querySelector(".info>.buttons>.save").addEventListener("click",saveEvent);
}

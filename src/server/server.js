const dotenv = require('dotenv');
dotenv.config();
const geonames_username=process.env.GEONAMES_USERNAME;
const weatherbit_key=process.env.WEATHERBIT_KEY;
const open_weather_api_key=process.env.OPEN_WEATHER_API_KEY;
const pixabay_api_key=process.env.PIXABAY_API_KEY;

function index(req, res) {
    res.send('hello world!');
}

// Call express
const express = require('express');
const app = express();
// Middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

const axios = require('axios');
// Cors
const cors = require('cors');
app.use(cors());

const port = 3001;

app.use(express.static('dist'));

app.listen(port, (err)=>{
    if(err) console.error(err);
    else console.log(`Server is running on port ${port}`);
})

app.get('/',(req,res)=>{
    res.send("Hello World");
    res.end();
})

app.get('/keys',(req,res) => {
    res.send({
        geonames_username: geonames_username,
        weatherbit_key: weatherbit_key,
        open_weather_api_key: open_weather_api_key,
        pixabay_api_key: pixabay_api_key
    });
    res.end();
})

const newObj={}
app.post('/newPlacePost',(req,res)=>{
    newObj.lat = req.body.lat;
    newObj.lng = req.body.lng;
    newObj.geonameId = req.body.geonameId;
    newObj.name = req.body.name;
    newObj.countryName = req.body.countryName;
    console.log(newObj.lat, newObj.lng, newObj.geonameId, newObj.name, newObj.countryName);
    res.end();
})

app.get('/newPlaceGet',(req,res)=>{
    res.send(newObj);
    res.end();
})
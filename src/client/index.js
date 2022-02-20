// js
import { saved_place} from './js/saved_place';
import { hide } from './js/hide';
import { getCoordinatesAPI } from './js/app'
// styles
import './style/style.scss';
import './style/nav.scss';
import './style/saved.scss';
import './style/search.scss';
import './style/main.scss';
// img
import Icon from '../img/icon.jpg';
import noImg from '../img/no_img.png';

//Variables
let city, country, date;

// hide or reveal favorite section
document.getElementById("menu").addEventListener("click",(e)=>{hide("saved")})
// if find button is clicked then call api functions
document.getElementById("find").addEventListener("click",(e)=>{
    city = document.getElementById("city").value;
    country = document.getElementById("country").value;
    date = document.getElementById("date").value;
    getCoordinatesAPI(city, country, date);
})

export {
    hide,
    saved_place,
    getCoordinatesAPI
}

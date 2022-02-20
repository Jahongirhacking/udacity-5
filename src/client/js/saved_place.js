//first letter capitalize
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Favorite div element
export function saved_place(city, country, date, bool=true){
    const element = document.createElement("div");
    element.classList.add("places");
    element.setAttribute('data-city', city);
    element.setAttribute('data-country', country);
    element.setAttribute('data-date', date);
    element.textContent=capitalizeFirstLetter(city);
    element.addEventListener("click",(e) => {
        Client.getCoordinatesAPI(city, country, date);
    })
    return element;
}

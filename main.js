let loginForm = document.getElementById('loginForm');
const countriesList = document.getElementById('countries');
let countries; // will contain "fetched countries data"

let loginData = document.getElementById('loginData');

fetch("https://restcountries.eu/rest/v2/all")
.then(res => res.json())
.then(data => initializeCountries(data))
.catch(err => console.log("Error:", err));

function initializeCountries(countriesData) {
  countries = countriesData;
  let options = "";
  countries.forEach(country => options+=`<option value="${country.alpha3Code}">${country.name}</option>`);
  countriesList.innerHTML = options;
}

countriesList.oninput = handleInput;

function handleInput(e) {
    let newElement = `<br id="stateBr"><label id="stateLabel">State : </label><select id="states" name="states" required autocomplete="off"></select>`;
    if(e.target.value === "USA") {
        countriesList.insertAdjacentHTML("afterend", newElement);
        displayStates();
    }else{
        if(document.getElementById('states')) {
            document.getElementById('states').remove();
            document.getElementById('stateLabel').remove();
            document.getElementById('stateBr').remove();
        }
    }
}

//Shown as dropdown only if the country is US
function displayStates() {
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        body: JSON.stringify({
            "country": "United States"
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => initializeState(data))
    .catch(err => console.log("Error:", err));
    
    function initializeState(stateData) {
      state = stateData.data.states;
      let options = "";
      state.forEach(state => options+=`<option value="${state.state_code}">${state.name}</option>`);
      const statesList = document.getElementById('states');
      statesList.innerHTML = options;
    }
}




// Form submit event

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    console.log({ data });
    displayLoginData(data);
});

function displayLoginData(data) {
    let formDataHtml = "<hr>";
    formDataHtml+=`<li><First Name : ${data.get('firstName')}</li>`
        + `<li>Last Name : ${data.get('lastName')}</li>`
        + `<li>Middle Name : ${data.get('middleName')}</li>`
        + `<li>Address : ${data.get('address')}, ${data.get('countries')}, `;
    if(document.getElementById('states')){
        formDataHtml+= `${data.get('states')}, `
    }
    formDataHtml+= `${data.get('zipCode')}</li>`
        + `<li>Email : ${data.get('email')}. `
        + `Phone Number : ${data.get('phNumber')}.</li>`
        + `<li>Height : ${data.get('height')} `
        + `Weight : ${data.get('weight')}</li><hr>`
    loginData.insertAdjacentHTML("beforeend", formDataHtml)
}
/* 
TODO:
- select all elements from ui
- load country at browser
- show all of country at UI
*/

/* step 1. Select all element from UI  */
const countryWrapper = document.querySelector(".country-content");
const modal = document.getElementById('modal');
/* step 2. load country at browser */
const loadCountries = async () => {
    let response = await fetch(`https://restcountries.com/v3.1/all`);
    let data = await response.json();
    displayCountry(data);
}

/* step 3. display country at UI  */

const displayCountry = (countries) => {

    countries.forEach((country) => {
        let langObject = country.languages;
        let language;
        for (let langs in langObject) {
            language = langObject[langs].slice(0, 10);
        }
        countryWrapper.innerHTML += `<div class="country" capital='${country.cca2}'>
                                    <img src="${country.flags.png}" alt="">
                                    <div class="flex">
                                        <div class="info">
                                            <h3>${country.name.common.slice(0, 15)}.</h3>
                                            <span>${country.capital ? country.capital : 'Not Available'}</span>
                                        </div>
                                        <span>${language}</span>
                                    </div>
                                    </div>`;


    });
    openModal();
}


/* step 4 click to open modal for each country list  */
const openModal = () => {
    const countriesName = document.querySelectorAll('.country');
    countriesName.forEach((country) => {
        country.addEventListener('click', () => {
            let capital = country.getAttribute('capital');
            modal.classList.add('active');
            setTimeout(() => {
                loadModalData(capital);
            }, 3000)
        })
    })

    searchCountry();

}

/* step 5 load modal information */
const loadModalData = (capital) => {
    fetch(`https://restcountries.com/v3.1/alpha/${capital}`)
        .then(response => response.json())
        .then(data => displayModalInfo(data[0]))
}



/* step 6 display modal info  */
const displayModalInfo = (info) => {
    const modalContent = document.getElementById("modal-content");
    // for currencies 
    let currencies = info.currencies;
    for (let currency in currencies) {
        var {
            name,
            symbol
        } = info.currencies[currency];
    }

    // for languages 
    let languages = info.languages;
    let languagesOf = '';
    for (let lang in languages) {
        languagesOf = languagesOf + languages[lang] + ',';
    }

    // for nativeName 
    let nativeName = info.name.nativeName;
    for (let key in nativeName) {
        var {
            official,
            common
        } = nativeName[key]
    }
    // for borders 
    let borders = info.borders;
    let borderText = '';
    if (borders) {
        borders.forEach((border) => {
            borderText = borderText + border + ' ,';
        })
    } else {
        borderText = 'Not available';
    }
    modalContent.innerHTML = `
                    <div class="modal-header">
                        <h3>${info.name.official}</h3>
                        <img width="50px" src="${info.coatOfArms.png}" alt="images of">
                    </div>
                    <div class="modal-body" id="modal-body">
                        <table>
                            <tr>
                                <th>Country Name</th>
                                <td>${info.name.common}</td>
                                <th>Capital</th>
                                <td>${info.capital}</td>
                            </tr>
                            <tr>
                                <th>Currency Name</th>
                                <td>${name}</td>
                                <th>Currency Symbol</th>
                                <td>${symbol}</td>
                            </tr>
                            <tr>
                                <th>Area</th>
                                <td>${info.area}</td>
                                <th>Population</th>
                                <td>${info.population}</td>
                            </tr>
                            <tr>
                                <th>Languages</th>
                                <td>${languagesOf}</td>
                                <th>Native Name</th>
                                <td>${official}, ${common}</td>
                            </tr>
                            <tr>
                                <th>Borders</th>
                                <td>${borderText}</td>
                                <th>Sub Region</th>
                                <td>${info.subregion}</td>
                            </tr>
                            <tr>
                                <th>Timezones</th>
                                <td>${info.timezones}</td>
                                <th>Independent</th>
                                <td>${info.independent ? 'Yeah' : 'No'}</td>
                            </tr>
                            <tr>
                                <th>Start Of Week</th>
                                <td>${info.startOfWeek}</td>
                                <th>Short Form</th>
                                <td>${info.flag}</td>
                            </tr>
                            <tr>
                                <th>Map</th>
                                <td><a href="${info.maps.googleMaps}" target="_blank">Click Here</a></td>
                                <th>Open Street Map</th>
                                <td><a href="${info.maps.openStreetMaps}" target="_blank">Click Here</a></td>
                            </tr>
                            <tr>
                                <th>Flags</th>
                                <td><img width="100" src="${info.flags.png}" alt=""></td>
                            </tr>
                        </table>
                    </div>`;

}

/* step 6 close modal by clicking outside in modal  */
document.addEventListener('click', (event) => {
    let targeted = event.target.id;
    if (targeted === 'modal') {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.querySelector('#modal-content').innerHTML = `
                            <div class="preloader">
                            <img src="./assets/image/preloader.gif" alt="preloader">
                            </div>`;
        }, 2000);
    }
})


/* step 7 work with search fields  */
const searchField = document.getElementById('search-field');
const searchCountry = () => {
    let searchTerms = searchField.value.toLowerCase();
    const countryList = document.querySelectorAll('.country');
    countryList.forEach((country) => {
        let terms = country.querySelector('h3').innerText.toLowerCase();
        if (!terms.includes(searchTerms)) {
            country.style.display = 'none';
        } else {
            country.style.display = 'block';
        }
    })

}
searchField.addEventListener('input', searchCountry);

/* last step calling all required function  */
loadCountries();
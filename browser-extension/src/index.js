import axios from '../node_modules/axios';
// form fields
const form = document.querySelector('.form-data');
const region = document.querySelector('.region-name1');
const region2 = document.querySelector('.region-name2');
const region3 = document.querySelector('.region-name3');
const apiKey = document.querySelector('.api-key');

// results
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const clearBtn = document.querySelector('.clear-btn');


const results = [
    {
        usage: document.querySelector('.carbon-usage1'),
        fossilfuel: document.querySelector('.fossil-fuel1'),
        myregion: document.querySelector('.my-region1')
    },
    {
        usage: document.querySelector('.carbon-usage2'),
        fossilfuel: document.querySelector('.fossil-fuel2'),
        myregion: document.querySelector('.my-region2')
    },
    {
        usage: document.querySelector('.carbon-usage3'),
        fossilfuel: document.querySelector('.fossil-fuel3'),
        myregion: document.querySelector('.my-region3')
    }
];

const calculateColor = async (value) => {
    let co2Scale = [0, 150, 600, 750, 800];
    let colors = ['#2AA364', '#F5EB4D', '#9E4229', '#381D02', '#381D02'];
    
    let closestNum = co2Scale.sort((a, b) => {
        return Math.abs(a - value) - Math.abs(b - value);
    })[0];
    console.log(value + ' is closest to ' + closestNum);
    let num = (element) => element > closestNum;
    let scaleIndex = co2Scale.findIndex(num);
    
    let closestColor = colors[scaleIndex];
    console.log(scaleIndex, closestColor);
    
    chrome.runtime.sendMessage({ action: 'updateIcon', value: { color: closestColor } });
};

const displayCarbonUsage = async (apiKey, region, results) => {
    try {
        await axios
            .get('https://api.co2signal.com/v1/latest', {
                params: {
                    countryCode: region,
                },
                headers: {
                    //please get your own token from CO2Signal https://www.co2signal.com/
                    'auth-token': apiKey,
                },
            })
            .then((response) => {
                let CO2 = Math.floor(response.data.data.carbonIntensity);
                
                calculateColor(CO2);

                loading.style.display = 'none';
                form.style.display = 'none';
                
                results.myregion.textContent = region;
                results.usage.textContent = Math.round(response.data.data.carbonIntensity) + ' grams (grams C02 emitted per kilowatt hour)';
                results.fossilfuel.textContent = response.data.data.fossilFuelPercentage.toFixed(2) + '% (percentage of fossil fuels used to generate electricity)';
                
                document.querySelector('.result-container').style.display = 'block';
            });
    } catch (error) {
        console.log(error);
        loading.style.display = 'none';
        document.querySelector('.result-container').style.display = 'none';
        errors.textContent = 'Sorry, we have no data for the region you have requested.';
    }
};

function setUpUser(apiKey, regionNames) {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('regionNames', JSON.stringify(regionNames));

    loading.style.display = 'block';
    errors.textContent = '';
    clearBtn.style.display = 'block';
    displayCarbonUsage(apiKey, regionNames[0], results[0]);
    displayCarbonUsage(apiKey, regionNames[1], results[1]);
    displayCarbonUsage(apiKey, regionNames[2], results[2]);
};

function handleSubmit(e) {
    e.preventDefault();
    const regionsArray = [region.value, region2.value, region3.value];
    setUpUser(apiKey.value, regionsArray);

};

function init() {
    const storedApiKey = localStorage.getItem('apiKey');
    const storedRegions = JSON.parse(localStorage.getItem('regionNames')) || [];
 
    //set icon to be generic green
    //todo
    chrome.runtime.sendMessage({
        action: 'updateIcon',
            value: {
                color: 'green'
            },
    });

    if (storedApiKey === null || storedRegion === null) {
        form.style.display = 'block';
        document.querySelector('.result-container').style.display = 'none';
        loading.style.display = 'none';
        clearBtn.style.display = 'none';
        errors.textContent = '';
    } else {
        displayCarbonUsage(storedApiKey, storedRegions[0], results[0]);
        displayCarbonUsage(storedApiKey, storedRegions[1], results[1]);
        displayCarbonUsage(storedApiKey, storedRegions[2], results[2]);
        document.querySelector('.result-container').style.display = 'none';
        form.style.display = 'none';
        clearBtn.style.display = 'block';
    }
};


function reset(e) {
    e.preventDefault();
    localStorage.removeItem('apiKey');
    localStorage.removeItem('regionNames');
    init();
};

form.addEventListener('submit', (e) => handleSubmit(e));
clearBtn.addEventListener('click', (e) => reset(e));

init();
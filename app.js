let covidData;
let covidStateData;


axios.get('https://api.covid19india.org/state_district_wise.json')
    .then((response) => {
        covidStateData = response.data;
        // console.log(covidStateData);
    });

axios.get('https://api.covid19india.org/data.json')
    .then((response) => {
        covidData = response.data;
    })
    .then(() => {
        // total confirmed div
        const totalCasesEl = document.getElementById('total-cases');
        totalCasesEl.innerText = "Cases: " + covidData.cases_time_series[covidData.cases_time_series.length - 1].totalconfirmed;

        // total recovered div
        const totalRecoveredEl = document.getElementById('total-recovered');
        totalRecoveredEl.innerText = "Recovered: " + covidData.cases_time_series[covidData.cases_time_series.length - 1].totalrecovered;

        //total deceased div
        const totalDeceasedEl = document.getElementById('total-deceased');
        totalDeceasedEl.innerText = "Death: " + covidData.cases_time_series[covidData.cases_time_series.length - 1].totaldeceased;

        // new confirmed div
        const newCasesEl = document.getElementById('new-cases');
        newCasesEl.innerText = "Cases: " + covidData.cases_time_series[covidData.cases_time_series.length - 1].dailyconfirmed;

        // new  recovered div
        const newRecoveredEl = document.getElementById('new-recovered');
        newRecoveredEl.innerText = "Recovered: " + covidData.cases_time_series[covidData.cases_time_series.length - 1].dailyrecovered;

        // new deceased
        const newDeceasedEl = document.getElementById('new-deceased');
        newDeceasedEl.innerText = "Deaths: " + covidData.cases_time_series[covidData.cases_time_series.length - 1].dailydeceased;
    });

const stateSelector = document.getElementById('state-drpdown');
// adding event listener to select tag to get the value on change
stateSelector.addEventListener('change', (e) => {
    let currentState = e.target.value;
    // looping over the statewise data and getting the index of the current state selected by user
    let currentStateIndex;
    stateTotalCase.parentElement.style.display = "flex";
    covidData.statewise.forEach((s, i) => {
        if (s.state === currentState) {
            currentStateIndex = i;
            return;
        }
    });

    // state-total-case div
    const stateTotalCasesEl = document.getElementById('state-total-case');
    stateTotalCasesEl.innerText = "Cases: " + covidData.statewise[currentStateIndex].confirmed;

    // state-total-recovered div
    const stateTotalRecoveredEl = document.getElementById('state-total-recovered');
    stateTotalRecoveredEl.innerText = "Recovered: " + covidData.statewise[currentStateIndex].recovered;

    // state-total-deceased div
    const stateTotalDeceasedEl = document.getElementById('state-total-deceased');
    stateTotalDeceasedEl.innerText = "Deaths: " + covidData.statewise[currentStateIndex].deaths;

    // removing previous state data 
    const stateDataDiv = document.getElementById('state-data');
    while (stateDataDiv.hasChildNodes()) {
        stateDataDiv.removeChild(stateDataDiv.lastChild);
    }

    // creating the labels for state data
    const districtLabelEl = document.createElement('div');
    districtLabelEl.classList.add('state-data-container')
    districtLabelEl.innerHTML = `<div class="state-data-labels">
    <div class="district">District</div>
    <div class="">Cases</div>
    <div class="">Recovered</div>
    <div class="">Deaths</div>
    </div>`;
    stateDataDiv.appendChild(districtLabelEl);

    // adding state data
    for (key in covidStateData[currentState].districtData) {
        const districtEl = document.createElement('div');
        districtEl.innerHTML =
            `<div class="state-data-labels">
            <div class="district">${key}</div>
            <div class="">${covidStateData[currentState].districtData[key].confirmed}</div>
            <div class="">${covidStateData[currentState].districtData[key].recovered}</div>
            <div class="">${covidStateData[currentState].districtData[key].deceased}</div>
            </div>`;
        stateDataDiv.appendChild(districtEl);
    }
})

// overall cases chart
let chartDataArray;
axios.get('https://api.covid19india.org/data.json')
    .then((response) => {
        chartDataArray = response.data.cases_time_series.reverse();
        console.log(chartDataArray);

        // making the chart

    }).then(() => {
        let chartEl = document.getElementById('data-chart').getContext('2d');

        let dataChart = new Chart(chartEl, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Confirmed Cases',
                    data: [],
                    backgroundColor: '#331427',
                    borderWidth: '1',
                    borderColor: '#ff073a'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: 'Infection Rate Graph (last 30 Days)',
                    fontSize: 18
                },
                legend: {
                    display: false
                }
            }
        });
        for (let i = 0; i < 30; i++) {
            dataChart.data.labels.push(chartDataArray[i].date);
            dataChart.data.datasets[0].data.push(chartDataArray[i].totalconfirmed);
        }
        dataChart.data.labels.reverse();
        dataChart.data.datasets[0].data.reverse();
        dataChart.update();

        // line chart button
        const lineChartBtn = document.getElementById('line-chart');
        lineChartBtn.addEventListener('click', (e) => {
            // recreating the entire chart as CHART.JS doesn't allow to update chart type after instantializing
            dataChart.destroy();
            dataChart = new Chart(chartEl, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Confirmed Cases',
                        data: [],
                        backgroundColor: '#331427',
                        borderWidth: '1',
                        borderColor: '#ff073a'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Infection Rate Graph (last 30 Days)',
                        fontSize: 18
                    },
                    legend: {
                        display: false
                    }
                }
            });
            for (let i = 0; i < 30; i++) {
                dataChart.data.labels.push(chartDataArray[i].date);
                dataChart.data.datasets[0].data.push(chartDataArray[i].totalconfirmed);
            }
            dataChart.data.labels.reverse();
            dataChart.data.datasets[0].data.reverse();
            dataChart.update();
            console.log(dataChart)
        });

        // line chart button
        const barChartBtn = document.getElementById('bar-chart');
        barChartBtn.addEventListener('click', (e) => {
            // recreating the entire chart as CHART.JS doesn't allow to update chart type after instantializing
            dataChart.destroy();
            dataChart = new Chart(chartEl, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Confirmed Cases',
                        data: [],
                        backgroundColor: '#331427',
                        borderWidth: '1',
                        borderColor: '#ff073a'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Infection Rate Graph (last 30 Days)',
                        fontSize: 18
                    },
                    legend: {
                        display: false
                    }
                }
            });
            for (let i = 0; i < 30; i++) {
                dataChart.data.labels.push(chartDataArray[i].date);
                dataChart.data.datasets[0].data.push(chartDataArray[i].totalconfirmed);
            }
            dataChart.data.labels.reverse();
            dataChart.data.datasets[0].data.reverse();
            dataChart.update();
            console.log(dataChart)
        });

    });


// state cases chart
let stateWiseChartArray;
axios.get('https://api.covid19india.org/data.json')
    .then((response) => {
        stateWiseChartArray = response.data.statewise;
        console.log(stateWiseChartArray);

        // making the chart

    }).then(() => {
        let chartEl = document.getElementById('state-data-chart').getContext('2d');

        let statedataChart = new Chart(chartEl, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    label: 'Confirmed Cases',
                    data: [],
                    backgroundColor: ['#e53935', '#651fff', '#303f9f', '#795548', '#ffff00',
                        '#ef5350', '#004d40', '#6a1b9a', '#99FF99', '#B34D4D',
                        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
                        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
                        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
                        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
                        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'],
                    borderWidth: '1',
                    borderColor: '#ff073a'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: 'State Wise Graph',
                    fontSize: 18
                },
                legend: {
                    display: true,
                    fontSize: 5
                }
            }
        });
        for (let i = 1; i < 30; i++) {
            statedataChart.data.labels.push(stateWiseChartArray[i].state);
            statedataChart.data.datasets[0].data.push(stateWiseChartArray[i].confirmed);
        }
        // dataChart.data.labels.reverse();
        // dataChart.data.datasets[0].data.reverse();
        statedataChart.update();
    })

/*Hiding the state info divs when it is empty*/

let stateTotalCase = document.getElementById('state-total-case');
if (!stateTotalCase.hasChildNodes()) {
    stateTotalCase.parentElement.style.display = "none";
}
if (!stateTotalCase.innerText === "") {
    stateTotalCase.parentElement.style.display = "flex";
}

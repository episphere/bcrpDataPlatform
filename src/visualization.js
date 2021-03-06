import { hideAnimation, getFile, csvJSON, numberWithCommas, summaryStatsFileId, getFileInfo, mapReduce, summaryStatsCasesFileId, reSizePlots } from './shared.js';
import { variables } from './variables.js';
import { addEventSummaryStatsFilterForm } from './event.js';
const plotTextSize = 10.5;

const chartLabels = {
    'yes': 'Yes',
    'no': 'No',
    'DK': 'Don\'t know',
    'pos': 'Positive',
    'neg': 'Negative'
}

export const getFileContent = async () => {
    const {jsonData, headers} = csvJSON(await getFile(summaryStatsFileId)); // Get summary level data
    const lastModified = (await getFileInfo(summaryStatsFileId)).modified_at;
    document.getElementById('dataLastModified').innerHTML = `Data last modified at - ${new Date(lastModified).toLocaleString()}`;
    hideAnimation();
    if(jsonData.length === 0) {
        document.getElementById('confluenceDiv').innerHTML = `You don't have access to summary level data, please contact NCI for the access.`
        return;
    };
    renderAllCharts(jsonData, headers);
    allFilters(jsonData, headers, false);
};

export const getFileContentCases = async () => {
    const {jsonData, headers} = csvJSON(await getFile(summaryStatsCasesFileId)); // Get summary level data
    const lastModified = (await getFileInfo(summaryStatsCasesFileId)).modified_at;
    document.getElementById('dataLastModified').innerHTML = `Data last modified at - ${new Date(lastModified).toLocaleString()}`;
    hideAnimation();
    if(jsonData.length === 0) {
        document.getElementById('confluenceDiv').innerHTML = `You don't have access to summary level data, please contact NCI for the access.`
        return;
    };
    renderAllCasesCharts(jsonData, headers);
    allFilters(jsonData, headers, false);
};

const allFilters = (jsonData, headers) => {
    document.getElementById('allFilters').innerHTML = '';
    const div1 = document.createElement('div')
    div1.classList = ['row select'];
    const obj = aggegrateData(jsonData);
    let template =`
        <div style="width: 100%;">
            
            <div class="form-group">
                <label class="filter-label font-size-13" for="ethnicitySelection">Ethnicity</label>
                <select class="form-control font-size-15" id="ethnicitySelection" data-variable='ethnicity'>
                    <option selected value='all'>All</option>
                    <option value='Non-Hispanic/Non-Latino'>Non-Hispanic/Non-Latino</option>
                    <option value='Hispanic/Latino'>Hispanic/Latino</option>
                </select>
            </div>
        
            <div class="form-group">
                <label class="filter-label font-size-13" for="raceSelection">Race</label>
                <select class="form-control font-size-15" id="raceSelection" data-variable='race'>
                    <option selected value='all'>All</option>
                    <option value='American Indian/Alaska Native'>American Indian/Alaska Native</option>
                    <option value='Asian'>Asian</option>
                    <option value='Black/African American'>Black/African American</option>
                    <option value='Native Hawaiian/ Pacific Islander'>Native Hawaiian/ Pacific Islander</option>
                    <option value='Other including multiracial'>Other including multiracial</option>
                    <option value='White'>White</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="filter-label font-size-13" for="studySelection">Cohort</label>
                <select class="form-control font-size-15" id="studySelection" data-variable='study'>
                    <option selected value='all'>All</option>
                    <option value='NHS'>NHS</option>
                    <option value='NHS2'>NHS2</option>
                    <option value='CPS2'>CPS2</option>
                    <option value='CPS3'>CPS3</option>
                </select>
            </div>
    `;
    // template += `
    // <div class="form-group" style="display: none">
    //     <label class="filter-label font-size-13" for="consortiumTypeSelection">Consortium</label>
    //     <select class="form-control font-size-15" id="consortiumTypeSelection">
    //         <option value='allOther'>Non-CIMBA</option>
    //     </select>
    // </div>
    // `
    //console.log(obj)
    // for(let consortium in obj){
    //     let innerTemplate = `
    //                 <ul class="remove-padding-left font-size-15 consortium-ul" data-consortium="${consortium}">
    //                     <li class="custom-borders filter-list-item">
    //                         <button type="button" class="consortium-selection consortium-selection-btn" data-toggle="collapse" href="#toggle${consortium.replace(/ /g, '')}">
    //                             <i class="fas fa-caret-down"></i>
    //                         </button>
    //                         <input type="checkbox" data-consortia="${consortium}" id="label${consortium}" class="select-consortium"/>
    //                         <label for="label${consortium}" class="consortia-name">${consortium}</label>
    //                     </li>
    //                     <ul class="collapse no-list-style custom-padding allow-overflow max-height-study-list" id="toggle${consortium.replace(/ /g, '')}">`;
    //     for(let study in obj[consortium]){
    //         if(study !== 'consortiumTotal') {
    //             const total = obj[consortium][study].total;
    //             innerTemplate += `<li class="filter-list-item">
    //                             <input type="checkbox" data-study="${study}" data-consortium="${consortium}" id="label${study}" class="select-study"/>
    //                             <label for="label${study}" class="study-name" title="${study}">${study.length > 10 ? `${study.substr(0,10)}...`:study}</label>
    //                         </li>`;
    //         }
    //     }
    //     innerTemplate += `</ul></ul>`
    //     template += innerTemplate;
        
    // }
    template += `</br>
    </div>`;
    div1.innerHTML = template;
    document.getElementById('allFilters').appendChild(div1);
    addEventSummaryStatsFilterForm(jsonData, headers);
    addEventConsortiumSelect();
}

const aggegrateData = (jsonData) => {
    let obj = {};
    jsonData.forEach(value => {
        if(obj[value.consortium] === undefined) obj[value.consortium] = {};
        if(obj[value.consortium]){
            if(obj[value.consortium]['consortiumTotal'] === undefined) obj[value.consortium]['consortiumTotal'] = 0;
            obj[value.consortium]['consortiumTotal'] += parseInt(value.total);
            if(obj[value.consortium][value.study] === undefined) {
                obj[value.consortium][value.study] = {};
                obj[value.consortium][value.study].total= 0;
            }
            obj[value.consortium][value.study].total += parseInt(value.total);
        }
    });
    return obj;
}

export const addEventConsortiumSelect = () => {
    const elements = document.getElementsByClassName('consortium-selection');
    Array.from(elements).forEach(element => {
        element.addEventListener('click', () => {
            if (element.lastElementChild.classList.contains('fa-caret-up')){
                element.lastElementChild.classList.add('fa-caret-down');
                element.lastElementChild.classList.remove('fa-caret-up');

            } else {
                element.lastElementChild.classList.add('fa-caret-up');
                element.lastElementChild.classList.remove('fa-caret-down');
            }
        });
    });

    const consortiums = document.getElementsByClassName('select-consortium');
    Array.from(consortiums).forEach(el => {
        el.addEventListener('click', () => {
            if(el.checked){
                Array.from(el.parentNode.parentNode.querySelectorAll('.select-study')).forEach(btns => btns.checked = true);
            }
            else {
                Array.from(el.parentNode.parentNode.querySelectorAll('.select-study')).forEach(btns => btns.checked =  false);
            }
        });
    });

    const studies = document.querySelectorAll('.select-study');
    Array.from(studies).forEach(element => {
        element.addEventListener('click', () => {
            const allStudiesInConsortium = element.parentElement.parentElement.querySelectorAll('.select-study').length
            const selectedStudiesInConsortium = element.parentElement.parentElement.querySelectorAll('input:checked.select-study').length
            if(allStudiesInConsortium === selectedStudiesInConsortium) {
                element.parentElement.parentElement.parentElement.querySelector('.select-consortium').checked = true;
            }
            else {
                element.parentElement.parentElement.parentElement.querySelector('.select-consortium').checked = false;
            }
        });
    })
}

export const renderAllCharts = (data) => {
    document.getElementById('chartRow1').innerHTML = '';
    document.getElementById('chartRow2').innerHTML = '';
    let finalData = {};
    finalData = data;
    generateBirthBarChart('bYear', 'dataSummaryVizChart1', 'dataSummaryVizLabel1', finalData, 'chartRow1');
    generateAgeBarChart('ageInt', 'dataSummaryVizChart2', 'dataSummaryVizLabel2', finalData, 'chartRow1');
    generateMenarcheBarChart('ageMenarche', 'dataSummaryVizChart3', 'dataSummaryVizLabel3', finalData, 'chartRow1');
    generateParityBarChart('parous', 'dataSummaryVizChart4', 'dataSummaryVizLabel4', finalData, 'chartRow2');
    generatePregnaciesBarChart('parity', 'dataSummaryVizChart5', 'dataSummaryVizLabel5', finalData, 'chartRow2');
    generateBMIBarChart('BMI', 'dataSummaryVizChart6', 'dataSummaryVizLabel6', finalData, 'chartRow2');
}

export const renderAllCasesCharts = (data) => {
    document.getElementById('chartRow1').innerHTML = '';
    document.getElementById('chartRow2').innerHTML = '';
    let finalData = {};
    finalData = data;
    generateYearsDiagBarChart('dxdate_primary', 'dataSummaryVizChart1', 'dataSummaryVizLabel1', finalData, 'chartRow1');
    generateCancerInvBarChart('invasive_primary', 'dataSummaryVizChart2', 'dataSummaryVizLabel2', finalData, 'chartRow1')
    generateDetectionPrimBarChart('Detection_screen', 'dataSummaryVizChart3', 'dataSummaryVizLabel3', finalData, 'chartRow1');
    generateERTumorStatusBarChart('ER_statusIndex', 'dataSummaryVizChart4', 'dataSummaryVizLabel4', finalData, 'chartRow2');
    generateTumorGradeBarChart('Grade1', 'dataSummaryVizChart5', 'dataSummaryVizLabel5', finalData, 'chartRow2');
}

export const updateCounts = (data) => {
    const obj = aggegrateData(data);
    for(let consortium in obj){
        const elements = document.querySelectorAll(`[data-consortia="${consortium}"]`);
        Array.from(elements).forEach(element => {
            element.innerHTML = numberWithCommas(obj[consortium].consortiumTotal);
        });
        for(let study in obj[consortium]){
            const studyElements = document.querySelectorAll(`[data-consortia-study="${consortium}@#$${study}"]`);
            Array.from(studyElements).forEach(element => {
                element.innerHTML = numberWithCommas(obj[consortium][study].total);
            });
        };
    };
}

export const getSelectedStudies = () => {
    const elements = document.querySelectorAll(`input:checked.select-study`);
    const array = [];
    Array.from(elements).forEach(element => {
        const consortium = element.dataset.consortium;
        const study = element.dataset.study;
        const value = `${consortium}@#$${study}`
        if(array.indexOf(value) === -1) array.push(value);
    })
    return array;
};

const generateAgeBarChart = (parameter, id, labelID, jsonData, chartRow) => {
    const div = document.createElement('div');
    div.classList = ['col-xl-4 pl-2 padding-right-zero mb-3'];
    div.innerHTML = dataVisulizationCards({cardHeaderId: labelID, cardBodyId: id});
    document.getElementById(chartRow).appendChild(div);
    const data = [
        {
            x: ['<20','20 to 29', '30 to 39', '40 to 49', '50 to 59', '60 to 69', '70 to 79', '80 to 89', '>90'],
            y: [ mapReduce(jsonData, '<20'), mapReduce(jsonData, '20 to 29'), mapReduce(jsonData, '30 to 39'), mapReduce(jsonData, '40 to 49'), mapReduce(jsonData, '50 to 59'), mapReduce(jsonData, '60 to 69'), mapReduce(jsonData, '70 to 79'), mapReduce(jsonData, '80 to 89'), mapReduce(jsonData, '90 to 99') + mapReduce(jsonData, '>99') ],
            marker:{
                color: ['#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe', '#8bc1e8']
            },
          type: 'bar'
        }
    ];
    const layout = {
        xaxis: {fixedrange: true, automargin: true, tickangle: 45, tickfont: {size : plotTextSize}},
        yaxis: {title:`Count`, fixedrange: true, tickformat:',d', tickfont: {size : plotTextSize}},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.newPlot(`${id}`, data, layout, {responsive: true, displayModeBar: false});
    document.getElementById(labelID).innerHTML = `${variables.BCRPP[parameter]['label']}`;
}

const generateDetectionPrimBarChart = (parameter, id, labelID, jsonData, chartRow) => {
    const div = document.createElement('div');
    div.classList = ['col-xl-4 pl-2 padding-right-zero mb-3'];
    div.innerHTML = dataVisulizationCards({cardHeaderId: labelID, cardBodyId: id});
    document.getElementById(chartRow).appendChild(div);
    const data = [
        {
            x: ['Screen-detected','Non-screen detected', 'Unknown'],
            y: [ mapReduce(jsonData, 'detection_primary11'), mapReduce(jsonData, 'detection_primary12'), mapReduce(jsonData, 'detection_primary1DK') ],
            marker:{
                color: ['#8bc1e8', '#319fbe', '#8bc1e8']
            },
          type: 'bar'
        }
    ];
    const layout = {
        xaxis: {fixedrange: true, automargin: true, tickangle: 45, tickfont: {size : plotTextSize}},
        yaxis: {title:`Count`, fixedrange: true, tickformat:',d', tickfont: {size : plotTextSize}},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.newPlot(`${id}`, data, layout, {responsive: true, displayModeBar: false});
    document.getElementById(labelID).innerHTML = `${variables.BCRPP[parameter]['label']}`;
}

const generateCancerInvBarChart = (parameter, id, labelID, jsonData, chartRow) => {
    const div = document.createElement('div');
    div.classList = ['col-xl-4 pl-2 padding-right-zero mb-3'];
    div.innerHTML = dataVisulizationCards({cardHeaderId: labelID, cardBodyId: id});
    document.getElementById(chartRow).appendChild(div);
    const data = [
        {
            x: ['Invasive', 'In-situ', 'Unknown'],
            y: [ mapReduce(jsonData, 'invasive_primary11'), mapReduce(jsonData, 'invasive_primary12'), mapReduce(jsonData, 'invasive_primary1DK') ],
            marker:{
                color: ['#8bc1e8', '#319fbe', '#8bc1e8']
            },
          type: 'bar'
        }
    ];
    const layout = {
        xaxis: {fixedrange: true, automargin: true, tickangle: 45, tickfont: {size : plotTextSize}},
        yaxis: {title:`Count`, fixedrange: true, tickformat:',d', tickfont: {size : plotTextSize}},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.newPlot(`${id}`, data, layout, {responsive: true, displayModeBar: false});
    document.getElementById(labelID).innerHTML = `${variables.BCRPP[parameter]['label']}`;
}

const generateERTumorStatusBarChart = (parameter, id, labelID, jsonData, chartRow) => {
    const div = document.createElement('div');
    div.classList = ['col-xl-4 pl-2 padding-right-zero mb-3'];
    div.innerHTML = dataVisulizationCards({cardHeaderId: labelID, cardBodyId: id});
    document.getElementById(chartRow).appendChild(div);
    const data = [
        {
            x: ['Negative', 'Positive', 'Unknown'],
            y: [ mapReduce(jsonData, 'er_primary10'), mapReduce(jsonData, 'er_primary11'), mapReduce(jsonData, 'er_primaryDK') ],
            marker:{
                color: ['#8bc1e8', '#319fbe', '#8bc1e8']
            },
          type: 'bar'
        }
    ];
    const layout = {
        xaxis: {fixedrange: true, automargin: true, tickangle: 45, tickfont: {size : plotTextSize}},
        yaxis: {title:`Count`, fixedrange: true, tickformat:',d', tickfont: {size : plotTextSize}},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.newPlot(`${id}`, data, layout, {responsive: true, displayModeBar: false});
    document.getElementById(labelID).innerHTML = `${variables.BCRPP[parameter]['label']}`;
}

const generateTumorGradeBarChart = (parameter, id, labelID, jsonData, chartRow) => {
    const div = document.createElement('div');
    div.classList = ['col-xl-4 pl-2 padding-right-zero mb-3'];
    div.innerHTML = dataVisulizationCards({cardHeaderId: labelID, cardBodyId: id});
    document.getElementById(chartRow).appendChild(div);
    const data = [
        {
            x: ['Well differentiated', 'Moderately differentiated', 'Poorly/un-differentiated', 'Unknown'],
            y: [ mapReduce(jsonData, 'grade_primary11'), mapReduce(jsonData, 'grade_primary12'), mapReduce(jsonData, 'grade_primary13'), mapReduce(jsonData, 'grade_primary1DK') ],
            marker:{
                color: ['#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe']
            },
          type: 'bar'
        }
    ];
    const layout = {
        xaxis: {fixedrange: true, automargin: true, tickangle: 45, tickfont: {size : plotTextSize}},
        yaxis: {title:`Count`, fixedrange: true, tickformat:',d', tickfont: {size : plotTextSize}},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.newPlot(`${id}`, data, layout, {responsive: true, displayModeBar: false});
    document.getElementById(labelID).innerHTML = `${variables.BCRPP[parameter]['label']}`;
}

const generateBirthBarChart = (parameter, id, labelID, jsonData, chartRow) => {
    const div = document.createElement('div');
    div.classList = ['col-xl-4 pl-2 padding-right-zero mb-3'];
    div.innerHTML = dataVisulizationCards({cardHeaderId: labelID, cardBodyId: id});
    document.getElementById(chartRow).appendChild(div);
    const data = [
        {
            x: ['1900 to 1909','1910 to 1919', '1920 to 1929', '1930 to 1939', '1940 to 1949', '1950 to 1959', '1960 to 1969', '1970 to 1979', '1980 to 1989', '1990 to 1999'],
            y: [ mapReduce(jsonData, '1900-1909'), mapReduce(jsonData, '1910-1919'), mapReduce(jsonData, '1920-1929'), mapReduce(jsonData, '1930-1939'), mapReduce(jsonData, '1940-1949'), mapReduce(jsonData, '1950-1959'), mapReduce(jsonData, '1960-1969'), mapReduce(jsonData, '1970-1979'), mapReduce(jsonData, '1980-1989'), mapReduce(jsonData, '1990-1999') ],
            marker:{
                color: ['#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe']
            },
          type: 'bar'
        }
    ];
    const layout = {
        xaxis: {fixedrange: true, automargin: true, tickangle: 45, tickfont: {size : plotTextSize}},
        yaxis: {title:`Count`, fixedrange: true, tickformat:',d', tickfont: {size : plotTextSize}},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.newPlot(`${id}`, data, layout, {responsive: true, displayModeBar: false});
    document.getElementById(labelID).innerHTML = `${variables.BCRPP[parameter]['label']}`;
}

const generateMenarcheBarChart = (parameter, id, labelID, jsonData, chartRow) => {
    const div = document.createElement('div');
    div.classList = ['col-xl-4 pl-2 padding-right-zero mb-3'];
    div.innerHTML = dataVisulizationCards({cardHeaderId: labelID, cardBodyId: id});
    document.getElementById(chartRow).appendChild(div);
    const data = [
        {
            x: ["???12", "13", "14", "15", ">15", "Unknown"],
            y: [mapReduce(jsonData, 'agemenarcheLE12'), mapReduce(jsonData, 'agemenarche13'), mapReduce(jsonData, 'agemenarche14'), mapReduce(jsonData, 'agemenarche15'), mapReduce(jsonData, 'agemenarcheGT15'), mapReduce(jsonData, 'agemenarcheDK')],
            marker:{
                color: ['#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe']
            },
          type: 'bar'
        }
    ];
    const layout = {
        xaxis: {type: 'category', fixedrange: true, automargin: true, tickangle: 45, tickfont: {size : plotTextSize}},
        yaxis: {title:`Count`, fixedrange: true, tickformat:',d', tickfont: {size : plotTextSize}},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.newPlot(`${id}`, data, layout, {responsive: true, displayModeBar: false});
    document.getElementById(labelID).innerHTML = `${variables.BCRPP[parameter]['label']}`;
}

const generateParityBarChart = (parameter, id, labelID, jsonData, chartRow) => {
    const div = document.createElement('div');
    div.classList = ['col-xl-4 pl-2 padding-right-zero mb-3'];
    div.innerHTML = dataVisulizationCards({cardHeaderId: labelID, cardBodyId: id});
    document.getElementById(chartRow).appendChild(div);
    const data = [
        {
            x: ["Nullparous","Parous","Unknown"],
            y: [mapReduce(jsonData, 'parous0'), mapReduce(jsonData, 'parous1'), mapReduce(jsonData, 'parousDK')],
            marker:{
                color: ['#8bc1e8', '#319fbe', '#8bc1e8']
            },
          type: 'bar'
        }
    ];
    const layout = {
        xaxis: {type: 'category', fixedrange: true, automargin: true, tickangle: 45, tickfont: {size : plotTextSize}},
        yaxis: {title:`Count`, fixedrange: true, tickformat:',d', tickfont: {size : plotTextSize}},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.newPlot(`${id}`, data, layout, {responsive: true, displayModeBar: false});
    document.getElementById(labelID).innerHTML = `${variables.BCRPP[parameter]['label']}`;
}

const generatePregnaciesBarChart = (parameter, id, labelID, jsonData, chartRow) => {
    const div = document.createElement('div');
    div.classList = ['col-xl-4 pl-2 padding-right-zero mb-3'];
    div.innerHTML = dataVisulizationCards({cardHeaderId: labelID, cardBodyId: id});
    document.getElementById(chartRow).appendChild(div);
    const data = [
        {
            x: ["1", "2", "3", "4", "5", "6+", "Unknown"],
            y: [mapReduce(jsonData, 'parity1'), mapReduce(jsonData, 'parity2'), mapReduce(jsonData, 'parity3'), mapReduce(jsonData, 'parity4'), mapReduce(jsonData, 'parity5'), mapReduce(jsonData, 'parity6+'), mapReduce(jsonData, 'parityDK')],
            marker:{
                color: ['#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe', '#8bc1e8']
            },
          type: 'bar'
        }
    ];
    const layout = {
        xaxis: {type: 'category', fixedrange: true, automargin: true, tickangle: 45, tickfont: {size : plotTextSize}},
        yaxis: {title:`Count`, fixedrange: true, tickformat:',d', tickfont: {size : plotTextSize}},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.newPlot(`${id}`, data, layout, {responsive: true, displayModeBar: false});
    document.getElementById(labelID).innerHTML = `${variables.BCRPP[parameter]['label']}`;
}

const generateBMIBarChart = (parameter, id, labelID, jsonData, chartRow) => {
    const div = document.createElement('div');
    div.classList = ['col-xl-4 pl-2 padding-right-zero mb-3'];
    div.innerHTML = dataVisulizationCards({cardHeaderId: labelID, cardBodyId: id});
    document.getElementById(chartRow).appendChild(div);
    const data = [
        {
            x: ["<18.5", "18.5 to 24.9", "25.0 to 29.9", "30.0 to 34.9", "35.0 to 39.9", ">40.0", "Unkown"],
            y: [mapReduce(jsonData, 'bmiLT18_5'), mapReduce(jsonData, 'bmi18_5_24_9'), mapReduce(jsonData, 'bmi25_0_29_9'), mapReduce(jsonData, 'bmi30_0_34_9'), mapReduce(jsonData, 'bmi35_0_39_9'), mapReduce(jsonData, 'bmiGE40_0'), mapReduce(jsonData, 'bmiDK')],
            marker:{
                color: ['#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe', '#8bc1e8']
            },
          type: 'bar'
        }
    ];
    const layout = {
        xaxis: {type: 'category', fixedrange: true, automargin: true, tickangle: 45, tickfont: {size : plotTextSize}},
        yaxis: {title:`Count`, fixedrange: true, tickformat:',d', tickfont: {size : plotTextSize}},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.newPlot(`${id}`, data, layout, {responsive: true, displayModeBar: false});
    document.getElementById(labelID).innerHTML = `${variables.BCRPP[parameter]['label']}`;
}

const generateYearsDiagBarChart = (parameter, id, labelID, jsonData, chartRow) => {
    const div = document.createElement('div');
    div.classList = ['col-xl-4 pl-2 padding-right-zero mb-3'];
    div.innerHTML = dataVisulizationCards({cardHeaderId: labelID, cardBodyId: id});
    document.getElementById(chartRow).appendChild(div);
    const data = [
        {
            x: ['1970 to 1979','1980 to 1989', '1990 to 1999', '2000 to 2009', '2010 to 2019', 'Unknown'],
            y: [mapReduce(jsonData, 'dxdate_primary11970_1979'), mapReduce(jsonData, 'dxdate_primary11980_1989'), mapReduce(jsonData, 'dxdate_primary11990_1999'), mapReduce(jsonData, 'dxdate_primary12000_2009'), mapReduce(jsonData, 'dxdate_primary12010_2019'), mapReduce(jsonData, 'dxdate_primary1DK') ],
            marker:{
                color: ['#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe']
            },
          type: 'bar'
        }
    ];
    const layout = {
        xaxis: {fixedrange: true, automargin: true, tickangle: 45, tickfont: {size : plotTextSize}},
        yaxis: {title:`Count`, fixedrange: true, tickformat:',d', tickfont: {size : plotTextSize}},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.newPlot(`${id}`, data, layout, {responsive: true, displayModeBar: false});
    document.getElementById(labelID).innerHTML = `${variables.BCRPP[parameter]['label']}`;
}

const generateModeDetCountBarChart = (parameter, id, labelID, jsonData, chartRow) => {
    const div = document.createElement('div');
    div.classList = ['col-xl-4 pl-2 padding-right-zero mb-3'];
    div.innerHTML = dataVisulizationCards({cardHeaderId: labelID, cardBodyId: id});
    document.getElementById(chartRow).appendChild(div);
    const data = [
        {
            x: ['1970 to 1979','1980 to 1989', '1990 to 1999', '2000 to 2009', '2010 to 2019', 'Unknown'],
            y: [mapReduce(jsonData, 'dxdate_primary11970_1979'), mapReduce(jsonData, 'dxdate_primary11980_1989'), mapReduce(jsonData, 'dxdate_primary11990_1999'), mapReduce(jsonData, 'dxdate_primary12000_2009'), mapReduce(jsonData, 'dxdate_primary12010_2019'), mapReduce(jsonData, 'dxdate_primary1DK') ],
            marker:{
                color: ['#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe', '#8bc1e8', '#319fbe']
            },
          type: 'bar'
        }
    ];
    const layout = {
        xaxis: {fixedrange: true, automargin: true, tickangle: 45, tickfont: {size : plotTextSize}},
        yaxis: {title:`Count`, fixedrange: true, tickformat:',d', tickfont: {size : plotTextSize}},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.newPlot(`${id}`, data, layout, {responsive: true, displayModeBar: false});
    document.getElementById(labelID).innerHTML = `${variables.BCRPP[parameter]['label']}`;
}

const generateBarSingleSelect = (parameter, id, labelID, jsonData, headers, chartRow) => {
    const div = document.createElement('div');
    div.classList = ['col-xl-4 pl-2 padding-right-zero mb-3'];
    div.innerHTML = dataVisulizationCards({cardHeaderId: labelID, cardBodyId: id});
    document.getElementById(chartRow).appendChild(div);
    document.getElementById(id).innerHTML = '';
    let x = headers.filter(dt => /famHist_/.test(dt))
    let y = x.map(dt => mapReduce(jsonData, dt));
    x = x.map(dt => chartLabels[dt.replace(/famHist_/, '')] ? chartLabels[dt.replace(/famHist_/, '')] : dt.replace(/famHist_/, ''));
    
    let tmpObj = {};
    x.forEach((l,i) => tmpObj[l] = y[i])
    for(let obj in tmpObj) {
        if(tmpObj[obj] === 0) delete tmpObj[obj];
    }
    x = Object.keys(tmpObj);
    y = Object.values(tmpObj);
    const data = [
        {
            x: x,
            y: y,
            marker:{
                color: ['#BF1B61', '#f7b6d2', '#7F7F7F', '#cccccc']
            },
          type: 'bar'
        }
    ];
    const layout = {
        xaxis: {fixedrange: true, automargin: true, tickangle: 45, tickfont: {size : plotTextSize}},
        yaxis: {title:`Count`, fixedrange: true, tickformat:',d', tickfont: {size : plotTextSize}},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.newPlot(`${id}`, data, layout, {responsive: true, displayModeBar: false});

    document.getElementById(labelID).innerHTML = `${variables.BCAC[parameter]['label']}`;
}

const renderPlotlyPieChart = (jsonData, parameter, id, labelID, headers, chartRow) => {
    const div = document.createElement('div');
    div.classList = ['col-xl-4 pl-2 padding-right-zero mb-3'];
    div.innerHTML = dataVisulizationCards({cardHeaderId: labelID, cardBodyId: id});
    document.getElementById(chartRow).appendChild(div);
    let pieLabel = ''
    if(variables.BCAC[parameter] && variables.BCAC[parameter]['label']){
        pieLabel = variables.BCAC[parameter]['label'];
    }else{
        pieLabel = parameter;
    }
    
    document.getElementById(labelID).innerHTML = `${pieLabel}`;
    let values = headers.filter(dt => /ER_statusIndex_/.test(dt)).map(dt => mapReduce(jsonData, dt));
    let labels = headers.filter(dt => /ER_statusIndex_/.test(dt)).map(dt => chartLabels[dt.replace(/ER_statusIndex_/, '')] ? chartLabels[dt.replace(/ER_statusIndex_/, '')] : dt.replace(/ER_statusIndex_/, ''));
    let tmpObj = {};
    labels.forEach((l,i) => tmpObj[l] = values[i])
    for(let obj in tmpObj) {
        if(tmpObj[obj] === 0) delete tmpObj[obj];
    }
    values = Object.values(tmpObj);
    labels = Object.keys(tmpObj);
    const d3 = Plotly.d3
    const format = d3.format(',3f')
    const total = values.reduce((a, b) => a + b)
    const text = values.map((v, i) => `
            ${labels[i]}<br>
            ${format(v)}<br>
            ${v / total * 100}%
        `)
    const data = [
        {
            y: values,
            x: labels,
            type: 'bar',
            marker:{
                color: ['#BF1B61', '#f7b6d2','#7F7F7F', '#cccccc']
            }
        }
    ];
    const layout = {
        xaxis: {fixedrange: true, automargin: true, tickangle: 45, tickfont: {size : plotTextSize}},
        yaxis: {title:`Count`, fixedrange: true, tickformat:',d', tickfont: {size : plotTextSize}},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.newPlot(`${id}`, data, layout, {responsive: true, displayModeBar: false});
}

const countStatus = (value, jsonData, parameter) => {
    let tmpArray = jsonData.filter(dt => {if(dt[parameter] === value) return dt}).map(dt => dt['total']);
    if(tmpArray.length === 0) return 0;
    return tmpArray.reduce((a,b) => a+b);
}


const renderStatusBarChart = (jsonData, parameter, id, labelID, xarray, chartRow) => {
    let pieLabel = ''
    if(variables.BCAC[parameter] && variables.BCAC[parameter]['label']){
        pieLabel = variables.BCAC[parameter]['label'];
    }else{
        pieLabel = parameter;
    }
    const div = document.createElement('div');
    div.classList = ['col-xl-4 pl-2 padding-right-zero mb-3'];
    div.innerHTML = dataVisulizationCards({cardHeaderId: labelID, cardBodyId: id});
    document.getElementById(chartRow).appendChild(div);

    document.getElementById(labelID).innerHTML = `${pieLabel}`;
    const yvalues = [...xarray.map(x => countStatus(x, jsonData, parameter))];
    const data = [
        {
            x: xarray,
            y: yvalues,
            type: 'bar',
            marker:{
                color: ['#BF1B61', '#f7b6d2','#BF1B61', '#f7b6d2']
            }
        }
    ];
    const layout = {
        xaxis: {fixedrange: true, automargin: true, tickangle: 45, tickfont: {size : plotTextSize}},
        yaxis: {title:`Count`, fixedrange: true, tickformat:',d', tickfont: {size : plotTextSize}},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.newPlot(`${id}`, data, layout, {responsive: true, displayModeBar: false});
}

const dataVisulizationCards = (obj) => `
        <div style="height:100%" class="card div-border background-white">
            <div class="card-header">
                ${obj.cardHeaderId ? `<span class="data-summary-label-wrap"><label class="font-size-17 font-bold" id="${obj.cardHeaderId}"></label></span>`: ``}
            </div>
            <div class="card-body viz-card-body">
                <div class="dataSummary-chart" id="${obj.cardBodyId}"></div>
            </div>
        </div>
    `;


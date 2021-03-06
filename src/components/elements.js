import { config } from "../config.js";
import { template } from "../pages/dataGovernance.js";
import { getFileInfo, showComments } from "../shared.js";
 

export const studyDropDownTemplate = (entries) => {
    let template = '';
    
    for(let studyId in entries){
        template += `<li>
                        <label><input type="checkbox" class="chk-box-margin" name="studiesCheckBox" data-study-name="${entries[studyId].name}" value="${studyId}"/>${entries[studyId].name}</label>
                    </li>`
    }
    
    return template;
};

export const renderConsortium = () => {
    let obj = JSON.parse(localStorage.data_summary);
    let template = '';
    for(let ID in obj){
        template += `
                    <li><input type="radio" aria-labelledby="labelConsortia" class="chk-box-margin" name="consortiaCheckBox" value="${ID}"/><label>${obj[ID].name}</label></li>
                    `;
    }
    return template;
}

export const parameterListTemplate = (jsonData) => {
    let parameters = [];
    let template = ''
    let selectedVariable = '';
    const dataSummaryVizChart2 = document.getElementById('dataSummaryVizChart2');
    if(dataSummaryVizChart2.dataset.selectedVariable && dataSummaryVizChart2.dataset.selectedVariable !== ""){
        selectedVariable = dataSummaryVizChart2.dataset.selectedVariable
    }
    if(!jsonData){
        document.getElementById('variableLabel').innerHTML = 'Most useful variables';
        document.getElementById('parameterList').classList.remove('list-variables');
        if(document.getElementById('toggleVariable')){
            document.getElementById('toggleVariable').innerHTML = 'Show All <i class="fas fa-caret-down"></i>';
        }else{
            document.getElementById('showAllVariables').innerHTML = '<a href="#" id="toggleVariable">Show All <i class="fas fa-caret-down"></i></a>';
        }
        parameters = ['ER_statusIndex', 'ethnicityClass', 'famHist', 'contrType'];
        parameters.forEach((param) => {
            template += `<a class="list-group-item variableItem ${param === selectedVariable ? `active`: ``}" href="#">${param}</a>`
        });
    }
    else{
        const parametersLength = jsonData.map(d => Object.keys(d).length);
        if(parametersLength.length === 0) return;
        // let maximumparameters = Math.max(...parametersLength);
        let maximumparameters = Math.max.apply(parametersLength);
        parameters = Object.keys(jsonData[parametersLength.indexOf(maximumparameters)]);
        parameters.sort();
        
        document.getElementById('variableLabel').innerHTML = 'All variables';
        document.getElementById('parameterList').classList.add('list-variables');
        if(document.getElementById('toggleVariable')){
            document.getElementById('toggleVariable').innerHTML = 'Show Less <i class="fas fa-caret-up"></i>';
        }else{
            document.getElementById('showAllVariables').innerHTML = '<a href="#" id="toggleVariable">Show Less <i class="fas fa-caret-up"></i></a>';
        }

        parameters.forEach((param) => {
            if(config.invalidVariables.indexOf(param.trim().toLowerCase()) !== -1) return;
            template += `<a class="list-group-item variableItem ${param === selectedVariable ? `active`: ``}" href="#">${param}</a>`
        });
    }    
    return template;
}

export const alertTemplate = (className, message) => {
    return `
        <div class="alert ${className} alert-dismissible">
            <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
            ${message}
        </div>
    `;
}

export const renderForm = () => {
    return `
        <div class="col">
            <form id="consortiaIdForm">
                <label>Consortia Id / Box Folder Id
                    <div class="form-group">
                        <input type="text" class="form-control" required id="boxFolderId" placeholder="Enter Consortia ID / Box Folder ID" title="Consortia ID / Box Folder ID">
                    </div>
                    <div class="form-group">
                        <button id="submit" title="Submit" class="btn btn-light" title="Submit">Submit</button>
                    </div>
                </label>
            </form>
        </div>
    `;
}

export function renderFilePreviewDropdown(files, tab){
    let template = '';
    if(!Array.isArray(files)){
    console.log('Not an array');
    return
    }
//if(files.length != 0){
//   
//    template += `<div class='card-body'>
//            <div class='card-title'>
//            <label for='${tab}selectedDoc'>Choose the file you'd like to preview</label><br>
//            <select id='${tab}selectedDoc'>
//            
//            `;
//    
//    for (const file of files) { 
//      //console.log('File', file);
//      template += `
//              <option value='${file.id}'>
//              ${file.name}</option>`;
//    }
//=======
    if(files.length != 0){
        //console.log('Param is array length: ' + files.length);
        template += `<div class='card-body'>
                <div class='card-title'>
                <label for='${tab}selectedDoc'><b>Select Document:</b></label>
                <br>
                <select id='${tab}selectedDoc'>
            `;

        for (const file of files) { 
        //console.log('File', file);
        template += `
                <option value='${file.id}'>
                ${file.name}</option>`;
        }
//>>>>>>> master

        template += `
                </select>
                </div>
                </div>  
            </div>`
    } else {
    template += `
              No files to show.            
    </div>
    
    `
    }

//   console.log(tab, template);
  
  return template;
  
}
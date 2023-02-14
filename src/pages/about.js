import { addEventConsortiaFilter } from "../event.js";
import {
  getPublicFile,
  numberWithCommas,
  publicDataFileId,
} from "./../shared.js";
import { pageNavBar } from "../components/navBarMenuItems.js";

export const aboutConfluence = (activeTab, showDescripton) => {
  let navBarItems = showDescripton
    ? pageNavBar(
        "about",

        activeTab,

        "Overview",

        "Description of Studies",

        "Scientific Committee"
      )
    : `<div id='overview'></div>`;
  console.log({ navBarItems });
  let template = `
        <div class="general-bg body-min-height padding-bottom-1rem">
            <div class="container">
                ${navBarItems}
                    <button class="sub-menu-btn"><a class="nav-link ${
                      activeTab === "contact" ? "active" : ""
                    } black-font font-size-14" href="#about/contact"> <strong> </strong></a></button>
               
            </div>
        </div>
    `;
  document.getElementById("confluenceDiv").innerHTML = template;
};

// Changes needed here for definitions
export const renderOverView = async () => {
  let template = `
    <div class="main-summary-row">
      <div class="align-left">
           <h1 class="page-header">BCRPP Overview</h1>
      </div>
   </div>
      <div class="home-page-stats font-size-18">
        <div class="main-summary-row">
          <div class="col align-left">
                        </br>
                      <span>
                      Breast cancer is the most diagnosed non-skin cancer and the second most common cause of cancer death among U.S. women. Breast cancer is a complex disease influenced by inherited genetic factors, behaviors, and extrinsic exposures.  Breast cancer is also a heterogeneous disease: survival rates and treatments vary across biologically distinct tumor subtypes, and incidence and survival rates vary across racial and ethnic groups and internationally. 
                      </span>
                      </br></br>
                      <span>
                      The Breast Cancer Risk Prediction Project will bring together data on over 1.5 million women from the NCI Cohort Consortium Study and other large cohort studies to develop an integrated model that will predict breast cancer risk, overall and by sub-types, across racial and ethnic groups. This model will include data on family history; common genetic variation (polygenic risk scores); anthropometric, lifestyle and reproductive factors; and mammographic density. The aims of the BCRP are:
                      </span><br></br>
                      <div style="margin-left: 40px"> <b></b><ul><li> Develop a comprehensive and multi-ethnic model for estimating absolute risk of breast cancer by incorporating information on known breast cancer risk factors </li><ul></div>
                    
                      <div style="margin-left: 40px"> <b></b><ul> <li>Extend the multi-ethnic risk model for the risk prediction of estrogen receptor definced breast cancer </li> <ul></div>
                    
                      <div style="margin-left: 40px"> <b></b><ul> <li>Evaluate the validity of the risk models developed in the first and second steps in integrated health care systems, mammography, registries, and an ongoing risk-based mammographic screening trail in the US </li></div>
                      </br>
                
                      <div class="align-left">Explore the number of study participants and breast cancer cases for each cohort checked:</div>
                
          </div>
        </div>
          <div class="align-left" id="confluenceDataSummary"></div>
    `;
    
  document.getElementById("overview").innerHTML = template;
  const response = await fetch("./publicDataSet.json");
  countPublicStatistics(await response.json(), true);
};

const countPublicStatistics = (d, caseControl) => {
  const data = JSON.parse(JSON.stringify(d));
  const element = document.getElementById("confluenceDataSummary");
  let totalConsortia = 0;
  let totalPatients = 0;
  let totalWomen = 0;
  let summary = `
    </br>
        <div class="align-center">
            <div class="main-summary-row" style="margin: 0px 15px;margin-bottom:10px">
                <div class="col-md-3" style="padding: 0px">
                    <div class="custom-border allow-overflow align-left" style="height:100%; padding-left: 5px !important; margin-right: 15px;">
                    <span class="font-size-17 font-bold"> <span class="required">*</span>Cohort:</span></br>
                    <!---<span class="font-size-15">Cohort:</span></br>--->
                    <ul class="about-consortia" id='about-consortia-check'>
    `;
  for (let key in data) {
    if (!caseControl && key !== "CIMBA") continue;
    if (key === "dataModifiedAt") continue;
    ++totalConsortia;
    totalPatients += data[key].numPatients;
    totalWomen += data[key].numWomen;
    summary += `<div class="row font-size-16" style="margin:2px 2px;">
            ${
              key !== "CIMBA"
                ? `
                <input type="checkbox" data-consortia="${
                  data[key].name
                }" id="label${data[key].name}" class="checkbox-consortia"/>
                    <label for="label${
                      data[key].name
                    }" class="study-name" title="${data[key].name}">${
                    data[key].name.length > 10
                      ? `${data[key].name.substr(0, 10)}...`
                      : data[key].name
                  }</label>
            `
                : ``
            }
            </div>`;
  }
  summary += `</ul></div></div>
                <div class="col-md-9 align-center" style="padding: 0px">
                
                    <div class="custom-border" style="margin-right: 15px; height: 100%;" id="renderDataSummaryCounts"></div>
                    
                    
                </div></div>
                <div class="col align-left">
                  <span class="required">*</span><span>If no boxes are checked, the data is for all cohorts combined.
                </div>
                <div class="col data-last-modified align-left">Data last modified at - ${new Date(
                  data["dataModifiedAt"]
                ).toLocaleString()}</div></div>
                `;
  element.innerHTML = summary;
  addEventOverviewConsortiumSelection(d);
  addEventConsortiaFilter(d);
  renderDataSummary({ totalConsortia, totalWomen, totalPatients }, caseControl);
};

const addEventOverviewConsortiumSelection = (data) => {
  const select = document.getElementById("overviewConsortiumSelection");
  if (!select) return;
  select.addEventListener("change", () => {
    const selectedValue = select.value;
    countPublicStatistics(data, true);
  });
};
export const renderDataSummary = (obj, caseControl) => {
  document.getElementById("renderDataSummaryCounts").innerHTML = `
        <div class="row">
            <div class="col">
                <span class="font-size-22">Cohorts</span></br>
                <span class="font-size-32">${numberWithCommas(
                  obj.totalConsortia
                )}</span>
                <br><br>     
            </div>
            <div class="col">
                <span class="font-size-22">Study Participants</span></br>
                <span class="font-size-32">${numberWithCommas(
                  obj.totalWomen
                )}</span>
            </div>
            <div class="col">
                <span class="font-size-22">Breast Cancer Cases</span></br>
                <span class="font-size-32">${numberWithCommas(
                  obj.totalPatients
                )}</span><br>               
            </div>
            <div class="row" style="margin:0;  padding-left: 1rem; padding-right: 1rem;"><div class="col align-left"><span>Input information about how the total number of breast cancer cases is calculated: Numbers for invasive and in situ cases? </span></div></div>
            
        </div>
    `;
};

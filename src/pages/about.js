import { addEventConsortiaFilter } from "../event.js";
import {
  getPublicFile,
  numberWithCommas,
  publicDataFileId,
} from "./../shared.js";
import { pageNavBar } from "../components/navBarMenuItems.js";

export const aboutConfluence = (activeTab, showDescription) => {
  let navBarItems = showDescription
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
                    The Breast Cancer Risk Prediction Project (BCRPP) is developing a comprehensive tool that will predict breast cancer risk – 
                    overall breast cancer and tumor subtypes of the disease – across racial and ethnic groups.
                    </span>
                    </br></br>
                    <span>
                    The BCRPP is an international collaborative effort that includes data on over 1.5 million women from the National Cancer Institute's 
                    Cohort Consortium Study, and other large cohort studies. The project is harmonizing information on breast cancer risk factors including, 
                    breast cancer family history, anthropometric, life-style and reproductive factors, hormonal biomarkers, mammographic density, and polygenic risk scores.
                    </span>
                    </br></br>
                    <span>
                    The broad scientific goals of the project:
                    </span>
                    </br></br>
                    <div style="margin-left: 40px"> <b>Aim 1:</b> <i>Develop a comprehensive and multi-ethnic model for estimating absolute risk of breast cancer by incorporating information on known breast cancer risk factors </i> </div>
                    </br>
                    <div style="margin-left: 40px"> <b>Aim 2:</b> <i>Extend the multi-ethnic risk model for the risk prediction of breast cancer defined by tumor estrogen receptor status </i> </div>
                    </br>
                    <div style="margin-left: 40px"> <b>Aim 3:</b> <i>Evaluate the validity of the risk models developed in Aim 1 and Aim 2 in integrated health care systems, mammography registries, and an ongoing risk-based mammographic screening trail in the US </i> </div>
                    </br>
                    <span>
                    In addition to these broad scientific goals, this BCRPP will also allow researchers to address a broad range of scientific questions. A description of the process for requesting access to data shared with the BCRPP can be found on the <a href="#data_access/overview">Data Access</a> page.
                    </span>
                    </br>
                </div>
            </div>
            <div class="align-left" id="confluenceDataSummary"></div>
        </div>
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
                    <span class="font-size-17 font-bold">Cohort:</span></br>
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
                <div class="col data-last-modified align-left">Data current as of - ${new Date(
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
                )}</span>
            </div>
        </div>
    `;
};

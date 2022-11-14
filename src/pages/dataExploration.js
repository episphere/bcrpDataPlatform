import {
  getFile,
  hideAnimation,
  csv2Json,
  numberWithCommas,
  emailsAllowedToUpdateData,
  getFileInfo,
  missingnessStatsFileId,
  reSizePlots,
  applicationURLs,
} from "../shared.js";
import {
  addEventConsortiumSelect,
  getSelectedStudies,
} from "../visualization.js";
import {
  addEventVariableDefinitions,
  addEventFilterBarToggle,
  addEventMissingnessFilterBarToggle,
} from "../event.js";
import { variables as CONSTANTS } from "../variables.js";

import { pageNavBar } from "../components/navBarMenuItems.js";

export const dataSummary = (
  pageHeader,
  showPages,
  subCases,
  showUpdateButton,
  publicAccess
) => {
  return `
        <div class="general-bg">
            <div class="container body-min-height">
        
            
                
                ${
                  publicAccess
                    ? pageNavBar("data_exploration", "dictionary", "Dictionary")
                    : pageNavBar(
                        "data_exploration",
                        "summary",
                        "Summary Statistics",
                        "Subset Statistics",
                        "Dictionary"
                      )
                } 
                
                <div class="main-summary-row">
                    <div class="row align-left w-100 m-0">
                        <h1 class="col page-header pl-0 pt-2">${pageHeader}</h1>
                        ${
                          showPages
                            ? `
                            <div class="ml-auto allow-overflow mr-2" style="margin:1rem 0" id="pagesContainer"></div>
                            <div class="ml-auto mt-3 mb-3 mr-2" id="pageSizeContainer"></div>
                            <div class="ml-auto mt-3 mb-3" id="downloadContainer">
                                <div class="col-md-12 p-0 dropdown">
                                    <div class="grid-elements ">
                                        <button title="Download" class="transparent-btn form-control dropdown-toggle dropdown-btn" data-toggle="dropdown" id="downloadDictionary" style="color:#000000 !important">
                                            Download <i class="fas fa-download" style="color:#000000 !important"></i>
                                        </button>
                                        <div class="dropdown-menu navbar-dropdown" aria-labelledby="downloadDictionary">
                                            <button class="transparent-btn dropdown-item dropdown-menu-links" title="Download dictionary as csv" id="downloadDictionaryCSV">CSV</button>
                                            <button class="transparent-btn dropdown-item dropdown-menu-links" title="Download dictionary as tsv" id="downloadDictionaryTSV">TSV</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `
                            : ``
                        }   
                    </div>
                </div>
                
                ${
                  showUpdateButton &&
                  localStorage.parms &&
                  JSON.parse(localStorage.parms).login &&
                  emailsAllowedToUpdateData.indexOf(
                    JSON.parse(localStorage.parms).login
                  ) !== -1
                    ? `
                    <div class="main-summary-row"><button id="updateSummaryStatsData" class="btn btn-outline-dark" aria-label="Update summary stats data" data-keyboard="false" data-backdrop="static" data-toggle="modal" data-target="#confluenceMainModal">Update data</button></div>
                `
                    : ``
                }
                <div class="main-summary-row" id="dataSummaryStatistics"></div>
                <div class="main-summary-row">
                    <div class="col p-0">
                        <div class="offset-xl-2 pl-4 align-left" id="dataLastModified"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export const dataSummaryStatisticsTemplate = () => {
  let template = "";
  template = `
    <div class="col-xl-2 filter-column" id="summaryFilterSiderBar">
        <div class="card">
            <div class="card-header align-left card-filter-header">
                <strong class="side-panel-header font-size-17">Filter</strong>
            </div>
            <div id="cardContent" class="card-body">
                <div id="allFilters" class="align-left"></div>
                <!---<p id='participantCount'></p>--->
            </div>
        </div>
    </div>
    <div class="col-xl-10 padding-right-zero" id="summaryStatsCharts">
        <button id="filterBarToggle"><i class="fas fa-lg fa-caret-left"></i></button>
        <div class="main-summary-row pl-2" style="min-height: 10px;margin-bottom: 1rem;">
            <div class="col white-bg div-border align-left font-size-17" style="padding: 0.5rem;" id="participantCount">
                <p id='participantCount'></p>
            </div>
        </div>

        <div class="main-summary-row" id="chartRow1"></div>
        <div class="main-summary-row" id="chartRow2"></div>

    </div>
    `;
  document.getElementById("dataSummaryStatistics").innerHTML = template;
  addEventFilterBarToggle();
};

export const dataSummaryMissingTemplate = async () => {
  //   const div1 = document.createElement("div");
  //   // div1.classList = ['row'];
  //   div1.innerHTML = `
  //     <div class='row'>
  //         <div class='col-12'>
  //             <div class="card">
  //                 <div class="card-header align-left card-filter-header">
  //                     <strong class="side-panel-header font-size-17">Disclaimer</strong>
  //                 </div>
  //                 <div id="cardContent" class="card-body">
  //                     <p>We are currently working on creating a new file with subset statistics for BCRPP</p>
  //                     <p class='text-left'>Check back soon!</p>
  //                 </div>
  //             </div>
  //         </div>
  //     </div>`;
  //   document.getElementById("dataSummaryStatistics").appendChild(div1);
  // };
  const response = await getFile(missingnessStatsFileId);
  const lastModified = (await getFileInfo(missingnessStatsFileId)).modified_at;
  document.getElementById(
    "dataLastModified"
  ).innerHTML = `Data last modified at - ${new Date(
    lastModified
  ).toLocaleString()}`;
  const { data, headers } = csv2Json(response);
  console.log({ data });
  const variables = headers.filter(
    (dt) => !dt.match(/ethnicity|race|cohort/i)
    // /status_/i.test(dt) === false &&
    // /study/i.test(dt) === false &&
    // /consortia/i.test(dt) === false &&
    // /ethnicityClass_/i.test(dt) === false &&
    // /bcac_id/i.test(dt) === false
    // /cohort/i.test(dt) === false &&
    // /race/i.test(dt) === false &&
    // /ethnicity/i.test(dt) === false
  );
  //const status = headers.filter((dt) => /status_/i.test(dt) === true);
  console.log({ headers });
  const initialSelection =
    variables.length > 5 ? variables.slice(0, 5) : variables;
  // const studies = data.map(dt => dt['study']).filter((item, i, ar) => ar.indexOf(item) === i);
  // const studies = {};
  // data.forEach((dt) => {
  //   // console.log({ dt: dt.Cohort });
  //   if (studies[dt["Cohort"]] === undefined) studies[dt["Cohort"]] = {};
  //   // if (dt["Cohort"] && studies[dt["Consortia"]][dt["Cohort"]] === undefined)
  //   //   studies[dt["Consortia"]][dt["Cohort"]] = {};
  // });

  const cohorts = {};
  data.forEach((dataOption) => {
    if (cohorts[dataOption.Cohort]) return;
    cohorts[dataOption.Cohort] = {};
  });
  console.log("keys", Object.keys(cohorts));
  console.log(cohorts);
  // const ancestory = headers.filter(
  //   (dt) => /ethnicityClass_/i.test(dt) === true
  // );

  const race = {};
  data.forEach((dataOption) => {
    if (race[dataOption.race]) return;
    race[dataOption.race] = CONSTANTS.BCRPP.raceM[dataOption.race];
  });
  // console.log("race", Object.keys(race));
  console.log({ race });

  const ethnicity = {};
  data.forEach((dataOption) => {
    if (ethnicity[dataOption.ethnicity]) return;
    ethnicity[dataOption.ethnicity] =
      CONSTANTS.BCRPP.ethnicityClass[dataOption.ethnicity];
  });
  // console.log("ethnicity", Object.keys(ethnicity));
  console.log({ ethnicity });

  const div1 = document.createElement("div");
  div1.classList = ["col-xl-2 filter-column"];
  div1.id = "missingnessFilter";

  const div2 = document.createElement("div");
  div2.classList = ["col-xl-10"];
  div2.innerHTML = `
        <button id="filterBarToggle">
            <i class="fas fa-lg fa-caret-left"></i>
        </button>
        <div class="main-summary-row" style="min-height: 10px;margin-bottom: 1rem;margin-left: 1rem;">
            <div class="col white-bg div-border align-left font-size-17" style="padding: 0.5rem;" id="listFilters">
                <!---<span class="font-bold">Status:</span> All<span class="vertical-line"></span>--->
                <span class="font-bold">Cohort:</span> All
                ${
                  initialSelection.length > 0
                    ? `
                    <span class="vertical-line"></span><span class="font-bold">Variable: </span>${
                      initialSelection[0]
                    } ${
                        initialSelection.length > 1
                          ? `and <span class="other-variable-count">${
                              initialSelection.length - 1
                            } other</span>`
                          : ``
                      }
                `
                    : ``
                }
            </div>
        </div>
        `;

  const row = document.createElement("div");
  row.classList = ["main-summary-row div-border overflow-x mb-2"];
  row.id = "missingnessTable";

  div2.appendChild(row);
  document.getElementById("dataSummaryStatistics").appendChild(div1);
  document.getElementById("dataSummaryStatistics").appendChild(div2);

  renderFilter(
    data,
    initialSelection,
    Object.keys(cohorts),
    variables,
    //status,
    //cohorts,
    //ancestory,
    race,
    // Object.keys(ethnicity)
    ethnicity
  );
  midset(data, initialSelection);
  addEventMissingnessFilterBarToggle();
};

const renderFilter = (
  data,
  acceptedVariables,
  acceptedCohorts,
  headers,
  //status,
  //cohorts,
  //ancestory,
  race,
  ethnicity
) => {
  console.log({ acceptedCohorts });
  let template = "";
  template += `
    <div class="card midset-card">
        <div class="card-header align-left card-filter-header">
            <strong class="side-panel-header">Filter</strong>
            
        </div>
        <div class="card-body" id="cardContent">
            <div id="midsetFilterData" class="row ethnicity-select align-left"></div>
        </div>
    </div>
    `;
  document.getElementById("missingnessFilter").innerHTML = template;
  renderMidsetFilterData(
    data,
    acceptedVariables,
    acceptedCohorts,
    headers,
    race,
    ethnicity
  );
};

const renderMidsetFilterData = (
  data,
  acceptedVariables,
  acceptedCohorts,
  headers,
  // status,
  // cohorts,
  // ancestory,
  race,
  ethnicity
) => {
  let template = "";
  //ancestory.splice(ancestory.indexOf("ethnicityClass_Other"), 1);
  //ancestory.sort();
  //ancestory.push("ethnicityClass_Other");
  // race.push("All");

  const transformRace = Object.entries(race);
  console.log({ transformRace });
  transformRace.push(["all", "All"]);
  const transformEthnicity = Object.entries(ethnicity);
  console.log({ transformEthnicity });

  // ethnicity.push("All"); ['all', 'All']
  transformEthnicity.push(["all", "All"]);

  template += `
        <div style="width:100%;">
            `;
  // ancestory.forEach((anc) => {
  //   template += `<option value="${anc}" ${
  //     anc === "All" ? "selected" : ""
  //   }>${anc.replace(new RegExp("ethnicityClass_", "i"), "")}</option>`;
  // });

  // Data transformation
  // Display
  // Add All option

  // <option value="10" selected>
  //   Test
  // </option>;

  template += `
            <div class="form-group" id="raceList">
            <label class="filter-label font-size-13" for="raceSelection">Race</label>
            <select class="form-control font-size-15" id="raceSelection">`;
  transformRace.forEach((anc) => {
    if (anc[0] === "undefined") return;

    template += `<option value="${anc[0]}" ${
      anc[1] === "All" ? "selected" : ""
    }>${anc[1]}</option>`;
  });
  template += `</select>
        </div>
          <div class="form-group" id="ethnicityList">
              <label class="filter-label font-size-13" for="ethnicitySelection">Ethnicity</label>
              <select class="form-control font-size-15" id="ethnicitySelection">`;
  transformEthnicity.forEach((anc) => {
    if (anc[0] === "undefined") return;
    template += `<option value="${anc[0]}" ${
      anc[1] === "All" ? "selected" : ""
    }>${anc[1]}</option>`;
  });
  template += `</select>
          </div>
            <div class="form-group" id='midsetCohorts'>
                <label class="filter-label font-size-13" for="studiesList">Cohort</label>`;

  let cohortsTemplate = "<ul class='remove-padding-left font-size-15'>";
  console.log(acceptedCohorts);
  for (let cohort of acceptedCohorts) {
    //${acceptedCohorts.indexOf(cohort) !== -1 ? "checked" : ""}
    cohortsTemplate += `
  <li class="filter-list-item">
      <input
        type="checkbox"
        data-variable="${cohort}"
        id="label${cohort}"
        class="select-cohort"
        ${acceptedCohorts.indexOf(cohort) !== -1 ? "checked" : ""}
      />
      <label for="label${cohort}" class="cohort-name" title="${cohort}">${
      cohort.length > 10 ? `${cohort.substr(0, 10)}...` : cohort
    }</label>
  </li>`;
  }
  cohortsTemplate += "</ul>";
  // for (let consortium in studies) {
  //   let innerTemplate = `
  //           <ul class="remove-padding-left">
  //               <li class="custom-borders filter-list-item consortia-study-list" data-consortia="${consortium}">
  //                   <input type="checkbox" data-consortia="${consortium}" id="label${consortium}" class="select-consortium"/>
  //                   <label for="label${consortium}" class="consortia-name">${consortium}</label>
  //                   <div class="ml-auto">
  //                       <button type="button" ${
  //                         Object.keys(studies[consortium]).length !== 0
  //                           ? ``
  //                           : `disabled title="Doesn't have any study data."`
  //                       } class="consortium-selection consortium-selection-btn" data-toggle="collapse" href="#toggle${consortium.replace(
  //     / /g,
  //     ""
  //   )}">
  //                           <i class="fas fa-caret-down"></i>
  //                       </button>
  //                   </div>
  //               </li>
  //       `;
  //   if (Object.keys(studies[consortium]).length !== 0) {
  //     innerTemplate += `<ul class="collapse no-list-style custom-padding allow-overflow max-height-study-list" id="toggle${consortium.replace(
  //       / /g,
  //       ""
  //     )}">`;

  // for (let study in studies[consortium]) {
  //   innerTemplate += `
  //               <li class="filter-list-item">
  //                   <input type="checkbox" data-study="${study}" data-consortium="${consortium}" id="label${study}" class="select-study"/>
  //                   <label for="label${study}" class="study-name" title="${study}">${
  //     study.length > 10 ? `${study.substr(0, 10)}...` : study
  //   }</label>
  //               </li>`;
  // }
  //     innerTemplate += `</ul>`;
  //   }
  //   innerTemplate += "</ul>";
  //   template += innerTemplate;
  // }

  template += `${cohortsTemplate}

            </div>
            <div class="form-group" id="midsetVariables">
                <label class="filter-label font-size-13" for="variableSelectionList">Variable Selection</label>
                <ul class="remove-padding-left font-size-15" id="variableSelectionList">
            `;
  headers.forEach((variable) => {
    template += `<li class="filter-list-item">
                        <input type="checkbox" ${
                          acceptedVariables.indexOf(variable) !== -1
                            ? "checked"
                            : ""
                        } data-variable="${variable}" id="label${variable}" class="select-variable"/>
                        <label for="label${variable}" class="variable-name" title="${variable}">${
      variable.replace("_Data available", "").length > 20
        ? `${variable.replace("_Data available", "").slice(0, 20)}...`
        : `${variable.replace("_Data available", "")}`
    }</label>
                    </li>`;
  });
  template += `</ul></div></br>
        </div>
    `;
  document.getElementById("midsetFilterData").innerHTML = template;
  addEventConsortiumSelect();
  addEventMidsetFilterForm(data);
};

const addEventMidsetFilterForm = (data) => {
  // const status = document.getElementById('statusSelection');
  // status.addEventListener('change', () => {
  //     filterMidsetData(data)
  // });

  // const ancestry = document.getElementById("ancestrySelection");
  // ancestry.addEventListener("change", () => {
  //   filterMidsetData(data);
  // });
  const race = document.getElementById("raceSelection");
  race.addEventListener("change", () => {
    filterMidsetData(data);
  });
  const ethnicity = document.getElementById("ethnicitySelection");
  ethnicity.addEventListener("change", () => {
    filterMidsetData(data);
  });
  const variables = document.getElementsByClassName("select-variable");
  Array.from(variables).forEach((ele) => {
    ele.addEventListener("click", () => {
      filterMidsetData(data);
    });
  });

  const cohorts = document.getElementsByClassName("select-cohort");
  Array.from(cohorts).forEach((ele) => {
    ele.addEventListener("click", () => {
      filterMidsetData(data);
    });
  });

  // const consortias = document.getElementsByClassName("select-consortium");
  // Array.from(consortias).forEach((ele) => {
  //   ele.addEventListener("click", () => {
  //     filterMidsetData(data);
  //   });
  // });

  // const studies = document.getElementsByClassName("select-study");
  // console.log({ studies });
  // Array.from(studies).forEach((ele) => {
  //   ele.addEventListener("click", () => {
  //     console.log({ data });
  //     filterMidsetData(data);
  //   });
  // });
};

const filterMidsetData = (data) => {
  //const status = document.getElementById("statusSelection").value;
  //const ancestry = document.getElementById("ancestrySelection").value;
  const race = document.getElementById("raceSelection").value;
  const ethnicity = document.getElementById("ethnicitySelection").value;
  const selectedVariables = getSelectedVariables("midsetVariables");
  const selectedCohorts = getSelectedVariables("midsetCohorts");

  let newData = data;
  console.log(newData);
  if (selectedCohorts.length > 0) {
    newData = newData.filter(({ Cohort }) => {
      return selectedCohorts.indexOf(Cohort) > -1;
    });
  }
  // if (status !== "All") {
  //   newData = newData.filter((dt) => dt[status] === "1");
  // }

  // if (ancestry !== "All") {
  //   newData = newData.filter((dt) => dt[ancestry] === "1");
  // }

  newData = newData.filter(
    (dt) =>
      dt.ethnicity === (ethnicity.toLowerCase() !== "all" ? ethnicity : "0")
  );

  newData = newData.filter(
    (dt) => dt.race === (race.toLowerCase() !== "all" ? race : "1")
  );

  // document.getElementById("listFilters").innerHTML =
  // `
  //   <!---<span class="font-bold">Status: </span>${status.replace(
  //     "status_",
  //     ""
  //   )}<span class="vertical-line"></span>--->
  //   <span class="font-bold">Ancestry: </span>${ancestry.replace(
  //     "ethnicityClass_",
  //     ""
  //   )}
  //   ${
  //     selectedVariables.length > 0
  //       ? `
  //       <span class="vertical-line"></span><span class="font-bold">Variable: </span>${
  //         selectedVariables[0]
  //       } ${
  //           selectedVariables.length > 1
  //             ? `and <span class="other-variable-count">${
  //                 selectedVariables.length - 1
  //               } other</span>`
  //             : ``
  //         }
  //   `
  //       : ``
  //   }
  //   ${
  //     selectedCohorts.length > 0
  //       ? `
  //       <span class="vertical-line"></span><span class="font-bold">Cohort: </span>${
  //         selectedCohorts[0]
  //       } ${
  //           selectedCohorts.length > 1
  //             ? `and <span class="other-variable-count">${
  //                 selectedCohorts.length - 1
  //               } other</span>`
  //             : ``
  //         }
  //   `
  //       : ``
  //   }
  //   `;
  midset(newData, selectedVariables);
};
const getSelectedVariables = (parentId) => {
  const selections = [];
  let cardBody = document.getElementById(parentId);
  const variables = cardBody.querySelectorAll("input:checked");
  Array.from(variables).forEach((el) => selections.push(el.dataset.variable));
  return selections;
};

const midset = (data, acceptedVariables) => {
  let template = "";
  let plotData = [];
  let headerData = "";

  if (acceptedVariables.length === 0) {
    template += "No variable selected.";
    hideAnimation();
    document.getElementById("missingnessTable").innerHTML = template;
    return;
  }
  if (data.length > 0) {
    console.log("MIAD INJA");
    template +=
      '<table class="table table-hover table-borderless missingness-table table-striped"><thead class="midset-table-header">';
    const headerCount = computeHeader(data, acceptedVariables);
    headerData = headerCount;
    const result = computeSets(data, acceptedVariables);
    template += `<tr class="midset-header"><th class="missing-column"><p>Number of subjects with data based on the selection of variables</p><button class="info-btn variable-definition" aria-label="More info" data-keyboard="false" data-backdrop="static" data-toggle="modal" data-target="#confluenceMainModal" data-variable='midsetTopBars'><i class="fas fa-question-circle cursor-pointer"></i></button></th><th class='bar-chart-cell' colspan="${
      Object.keys(headerCount).length
    }"><div id="midsetHeader"></div></th><th class="missing-column"></th></tr>`;

    template += `<tr><th class="missing-column"></th>`;
    for (let variable in headerCount) {
      template += `<th class="missing-column cell-equal-width">${numberWithCommas(
        headerCount[variable]
      )}</th>`;
    }
    template += `<th class="missing-column"></th></tr><tr><td class="missing-column"></td>`;
    for (let variable in headerCount) {
      template += `<th class="missing-column cell-equal-width">${variable.replace(
        "_Data available",
        ""
      )}</th>`;
    }
    template += `<th class="missing-column"></th>
                    <th class="missing-column"><button class="info-btn variable-definition" aria-label="More info" data-keyboard="false" data-backdrop="static" data-toggle="modal" data-target="#confluenceMainModal"  data-variable='midsetSideBars'><i class="fas fa-question-circle cursor-pointer"></i></button></th>
                    </tr></thead><tbody>
                    <tr>
                        <td class="missing-column set-label">
                            All subjects 
                            <button class="info-btn variable-definition" aria-label="More info" data-keyboard="false" data-backdrop="static" data-toggle="modal" data-target="#confluenceMainModal"  data-variable='allSubjects'><i class="fas fa-question-circle cursor-pointer"></i></button>
                        </td>`;

    const set0 = data.length;
    acceptedVariables.forEach((variable, index) => {
      template += `<td class="missing-column">&#9898</td>`;
      if (index === acceptedVariables.length - 1)
        template += `<td class="missing-column">${numberWithCommas(
          set0
        )}</td><td id="midsetChart" rowspan="${
          Object.keys(result).length + 2
        }"></td>`;
    });
    template += `</tr>
                    <tr>
                        <td class="missing-column set-label">
                            Complete set 
                            <button class="info-btn variable-definition" aria-label="More info" data-keyboard="false" data-backdrop="static" data-toggle="modal" data-target="#confluenceMainModal"  data-variable='completeSet'><i class="fas fa-question-circle cursor-pointer"></i></button>
                        </td>`;
    const set1 = setLengths(data, acceptedVariables);
    acceptedVariables.forEach((variable, index) => {
      template += `<td class="missing-column">&#9899</td>`;
      if (index === acceptedVariables.length - 1)
        template += `<td class="missing-column">${numberWithCommas(set1)}</td>`;
    });
    template += "</tr>";
    let ignore = "";
    acceptedVariables.forEach((v, i) => {
      if (i === 0) ignore += v;
      else ignore += `@#$${v}`;
      delete result[v];
    });
    delete result[ignore];
    plotData = Object.values(result);
    plotData.unshift(set1);
    plotData.unshift(set0);

    let variableDisplayed = {};
    for (let key in result) {
      const allVariables = key.split("@#$");
      const firstVar = key.split("@#$")[0];
      template += "<tr>";
      if (variableDisplayed[firstVar] === undefined) {
        template += `<td class="missing-column set-label">${firstVar.replace(
          "_Data available",
          ""
        )}</td>`;
        variableDisplayed[firstVar] = "";
      } else {
        template += '<td class="missing-column"></td>';
      }
      acceptedVariables.forEach((variable, index) => {
        if (variable === firstVar) {
          template += '<td class="missing-column">&#9899</td>';
        } else if (
          variable !== firstVar &&
          allVariables.indexOf(variable) !== -1
        ) {
          template += '<td class="missing-column">&#9899</td>';
        } else if (
          variable !== firstVar &&
          allVariables.indexOf(variable) === -1
        ) {
          template += '<td class="missing-column">&#9898</td>';
        }
        if (index === acceptedVariables.length - 1) {
          template += `<td class="missing-column">${numberWithCommas(
            result[key]
          )}</td>`;
        }
      });
      template += "</tr>";
    }

    template += "</tbody></table>";
  } else template += "Data not available.";

  hideAnimation();
  document.getElementById("missingnessTable").innerHTML = template;
  addEventVariableDefinitions();
  renderMidsetPlot(plotData.reverse(), "midsetChart");
  renderMidsetHeader(
    acceptedVariables,
    Object.values(headerData),
    "midsetHeader"
  );
  reSizePlots();
};

const renderMidsetHeader = (x, y, id) => {
  x = x.map((dt) => dt.replace("_Data available", ""));
  const data = [
    {
      type: "bar",
      x,
      y,
      marker: {
        color: "#7F7F7F",
        //color: '#319fbe'
      },
    },
  ];

  const layout = {
    xaxis: {
      autorange: true,
      showgrid: false,
      zeroline: false,
      showline: false,
      autotick: true,
      ticks: "",
      showticklabels: false,
      fixedrange: true,
    },
    yaxis: {
      autorange: true,
      showgrid: false,
      showline: false,
      autotick: true,
      fixedrange: true,
      tickformat: ",d",
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0,
    },
  };

  const options = {
    responsive: true,
    displayModeBar: false,
    useResizeHandler: true,
    style: {
      width: "100%",
      height: "100%",
    },
  };
  Plotly.newPlot(id, data, layout, options);
};

const renderMidsetPlot = (x, id) => {
  const data = [
    {
      type: "bar",
      x: x,
      hoverinfo: "x",
      orientation: "h",
      marker: {
        color: "#8bc1e8",
      },
    },
  ];

  const layout = {
    xaxis: {
      showgrid: false,
      zeroline: false,
      fixedrange: true,
      tickformat: ",d",
    },
    yaxis: {
      autorange: true,
      showgrid: false,
      zeroline: false,
      showline: false,
      autotick: true,
      ticks: "",
      showticklabels: false,
      fixedrange: true,
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
    },
  };

  const options = {
    responsive: true,
    displayModeBar: false,
    useResizeHandler: true,
    style: {
      width: "100%",
      height: "100%",
    },
  };
  Plotly.newPlot(id, data, layout, options);
};

const computeSets = (data, acceptedVariables) => {
  let obj = {};
  const allCombinations = getCombinations(acceptedVariables);
  allCombinations.forEach((combination) => {
    const setLength = setLengths(data, combination.split("@#$"));
    if (setLength > 0) {
      obj[combination] = setLength;
    }
  });
  return obj;
};

const setLengths = (data, arr) => {
  arr.forEach((variable) => {
    if (variable) {
      data = data.filter((dt) => dt[variable] === "1");
    }
  });
  return data.length;
};

const getCombinations = (array) => {
  const result = [];
  const sets = (prefix, array) => {
    for (var i = 0; i < array.length; i++) {
      const str = `${prefix}${prefix ? "@#$" : ""}${array[i]}`;
      result.push(str);
      sets(str, array.slice(i + 1));
    }
  };
  sets("", array);
  return result;
};

const computeHeader = (data, acceptedVariables) => {
  let obj = {};
  acceptedVariables.forEach((variable) => {
    obj[variable] = data.filter((dt) => dt[variable] === "1").length;
  });
  return obj;
};

export const clearGraphAndParameters = () => {
  document.getElementById("dataSummaryVizBarChart").innerHTML = "";
  document.getElementById("dataSummaryVizPieChart").hidden = true;
  document.getElementById("dataSummaryVizChart2").innerHTML = "";
  document.getElementById("barChartLabel").innerHTML = "";
  document.getElementById("pieChartLabel").innerHTML = "";
  document.getElementById("statusPieChart").innerHTML = "";
};

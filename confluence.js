import { navBarMenutemplate } from "./src/components/navBarMenuItems.js";
import { infoDeck, infoDeckAfterLoggedIn } from "./src/pages/homePage.js";
import {
  dataSubmissionTemplate,
  lazyload,
  userSubmissionsView,
  userSubmissionTemplate,
} from "./src/pages/dataSubmission.js";
import {
  dataSummary,
  dataSummaryMissingTemplate,
  dataSummaryStatisticsTemplate,
  dataSummaryMissingTopBarTemplate,
} from "./src/pages/dataExploration.js";
import {
  dataAccess as dataRequestTemplate,
  dataAccessNotSignedIn,
  dataForm,
  dataApproval,
  formSection,
  approveRejectSection,
  daccSection,
  chairSection,
  chairFileView,
  daccFileView,
  formSectionOther,
  formFunctions,
  importDictVars,
  amendFormSelect,
  populateAmendSelect,
  acceptedStudiesSection,
  acceptedStudiesView,
} from "./src/pages/dataRequest.js";
import {
  checkAccessTokenValidity,
  loginAppDev,
  loginObs,
  loginAppEpisphere,
  logOut,
  loginAppProd,
  //loginMail,
} from "./src/manageAuthentication.js";
import {
  storeAccessToken,
  removeActiveClass,
  showAnimation,
  getCurrentUser,
  inactivityTime,
  filterConsortiums,
  getFolderItems,
  filterProjects,
  amIViewer,
  getCollaboration,
  hideAnimation,
  assignNavbarActive,
  getFileInfo,
  handleRangeRequests,
  applicationURLs,
  checkDataSubmissionPermissionLevel,
  uploadFormFolder,
  uploadFile,
  uploadWordFile,
  getFile
} from "./src/shared.js";
import {
  addEventConsortiaSelect,
  addEventUploadStudyForm,
  addEventStudyRadioBtn,
  addEventDataGovernanceNavBar,
  addEventMyProjects,
  addEventUpdateSummaryStatsData,
  addEventcreateaccessStats,
} from "./src/event.js";
import { dataAnalysisTemplate } from "./src/pages/dataAnalysis.js";
import { getFileContent, getFileContentCases, getFileContentNL, getFileContentCasesNL } from "./src/visualization.js";
import { aboutConfluence, renderOverView } from "./src/pages/about.js";
import { confluenceResources } from "./src/pages/join.js";
import { confluenceContactPage } from "./src/pages/contact.js";
import { footerTemplate } from "./src/components/footer.js";
import { renderDescription, renderDescriptionNotSignedIn } from "./src/pages/description.js";
import { dataDictionaryTemplate } from "./src/pages/dictionary.js";
import { showPreview } from "./src/components/boxPreview.js";
import { confluenceEventsPage, eventsBody } from './src/pages/events.js';
import { acceptedDocs, acceptedDocsView } from './src/pages/accepteddocs.js';

/**
 * 1. add Scientifix comitte to menu
 * 2. add corresponsing page
 * 3.
 */

export const confluence = async () => {
  // if ("serviceWorker" in navigator) {
  //   try {
  //     navigator.serviceWorker.register("./serviceWorker.js");
  //   } catch (error) {}
  // }
  if(window.navigator && navigator.serviceWorker) {
    navigator.serviceWorker.getRegistrations()
    .then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
        console.log("Service worker removed.")
      }
    });
  }
  if (window.location.href.includes("index.html")){
    location.href = location.href.replace("index.html", "");
  };
  const confluenceDiv = document.getElementById("confluenceDiv");
  const navBarOptions = document.getElementById("navBarOptions");
  document
    .getElementById("loginBoxAppDev")
    .addEventListener("click", loginAppDev);//loginAppDev);
  document
    .getElementById("loginBoxAppStage")
    .addEventListener("click", loginObs);
  document
    .getElementById("loginBoxAppEpisphere")
    .addEventListener("click", loginAppEpisphere);
  document
    .getElementById("loginBoxAppProd")
    .addEventListener("click", loginAppProd);

  if (localStorage.parms === undefined) {
    const loginBoxAppDev = document.getElementById("loginBoxAppDev");
    const loginBoxAppEpisphere = document.getElementById(
      "loginBoxAppEpisphere"
    );
    const loginBoxAppProd = document.getElementById("loginBoxAppProd");
    const loginBoxAppStage = document.getElementById("loginBoxAppStage");
    //let urltest = location.origin + location.pathname;
    if (location.origin.match("localhost")) loginBoxAppDev.hidden = false;
    if (location.origin.match("epidataplatforms-stage"))
      loginBoxAppStage.hidden = false;
    if (location.origin.match("epidataplatforms"))
      loginBoxAppProd.hidden = false;
    if (location.origin.match("episphere")) loginBoxAppEpisphere.hidden = false;

    await storeAccessToken();

    manageRouter();
  }
  if (localStorage.parms && JSON.parse(localStorage.parms).access_token) {
    const response = await getCurrentUser();
    showAnimation();
    if (response) {
      const lclStr = JSON.parse(localStorage.parms);
      localStorage.parms = JSON.stringify({
        ...lclStr,
        ...response,
      });
    }
    navBarOptions.innerHTML = navBarMenutemplate();
    document.getElementById("logOutBtn").addEventListener("click", logOut);
    const viewUserSubmissionElement =
      document.getElementById("userSubmissions");

    
    const dataSubmissionElement = document.getElementById("dataSubmission");
    const dataSummaryElement = document.getElementById("dataSummary");
    const dataSummarySubsetElement = document.getElementById("dataSummarySubset");
    const dataDictionaryElement = document.getElementById("dataDictionary");
    const dataRequestElement = document.getElementById("dataRequest");
    const dataFormElement = document.getElementById("dataForm");
    const studyAcceptedElement = document.getElementById("studyAccepted");
    const chairViewElement = document.getElementById("chairView");
    const daccViewElement = document.getElementById("daccView");
    const acceptedFormsElement = document.getElementById('acceptedForms');
    const acceptedStudiesElement = document.getElementById('acceptedStudiesViewnav')
    // const platformTutorialElement = document.getElementById('platformTutorial');
    // const dataAnalysisElement = document.getElementById('dataAnalysis');

    dataSubmissionElement.addEventListener("click", async () => {
      if (dataSubmissionElement.classList.contains("navbar-active")) return;
      showAnimation();
      assignNavbarActive(dataSubmissionElement, 1);
      document.title = "BCRPP - Data Submit";
      confluenceDiv.innerHTML = await dataSubmissionTemplate();
      lazyload();
      addEventStudyRadioBtn();
      addEventConsortiaSelect();
      addEventUploadStudyForm();
      hideAnimation();
    });

    dataSummaryElement.addEventListener("click", async () => {
      if (dataSummaryElement.classList.contains("navbar-active")) return;
      assignNavbarActive(dataSummaryElement, 1);
      document.title = "BCRPP - Summary Statistics";
      confluenceDiv.innerHTML = dataSummary("Summary Statistics", false, true, true);
      addEventUpdateSummaryStatsData();
      addEventcreateaccessStats();
      dataSummaryStatisticsTemplate();
      await getFileContent();
      const subcasesSelection = document.getElementById("subcasesSelection");
      subcasesSelection.addEventListener("change", function (event) {
        if (event.target.value == "all") getFileContent();
        if (event.target.value == "cases") getFileContentCases();
      });
    });

    if (dataSummarySubsetElement) {
      dataSummarySubsetElement.addEventListener("click", async () => {
        if (dataSummarySubsetElement.classList.contains("navbar-active")) return;
        const confluenceDiv = document.getElementById("confluenceDiv");
        assignNavbarActive(dataSummarySubsetElement, 1);
        document.title = "BCRPP - Subset Statistics";
        confluenceDiv.innerHTML = dataSummary("Subset Statistics", false, true, true);
        addEventUpdateSummaryStatsData();
        addEventcreateaccessStats();
        removeActiveClass("nav-link", "active");
        document.querySelectorAll('[href="#data_exploration/subset"]')[1].classList.add("active");
        dataSummaryMissingTopBarTemplate();
        await dataSummaryMissingTemplate("Full Cohort");
        
        const popSelection = document.getElementById("populationSelection");
        popSelection.addEventListener("change", function (event) {
          console.log("popSelection Changed");
          if (event.target.value == "Full Cohort") {
            dataSummaryMissingTemplate("Full Cohort");
          }
          if (event.target.value == "Cases") {
            console.log("Cases");
            dataSummaryMissingTemplate("Cases");
          }
        })
      });
    }
    if (viewUserSubmissionElement) {
      viewUserSubmissionElement.addEventListener("click", async () => {
        if (viewUserSubmissionElement.classList.contains("navbar-active"))
          return;
        showAnimation();
        assignNavbarActive(viewUserSubmissionElement, 1);
        document.title = "BCRPP - Your Submissions";
        await userSubmissionTemplate("Your Submissions", "User Submissions");
        hideAnimation();
      });
    }
    if (dataDictionaryElement) {
      dataDictionaryElement.addEventListener("click", () => {
        if (dataDictionaryElement.classList.contains("navbar-active")) return;
        const confluenceDiv = document.getElementById("confluenceDiv");
        showAnimation();
        assignNavbarActive(dataDictionaryElement, 1);
        document.title = "BCRPP - Data Dictionary";
        confluenceDiv.innerHTML = dataSummary(
          "Data Dictionary",
          true,
          false,
          false
        );
        addEventUpdateSummaryStatsData();
        addEventcreateaccessStats();
        removeActiveClass("nav-link", "active");
        document
          .querySelectorAll('[href="#data_exploration/dictionary"]')[1]
          .classList.add("active");
        dataDictionaryTemplate();
      });
    }
    if (dataFormElement) {
      dataFormElement.addEventListener("click", async () => {
        if (dataFormElement.classList.contains("navbar-active")) return;
        const element = document.getElementById("dataForm");
        showAnimation();
        if (!element) return;
        if (element.classList.contains("navbar-active")) return;
        document.title = "BCRPP - Data Form";
        assignNavbarActive(element, 1);
        //dataForm();
        const getCollaborators = await getCollaboration(
          uploadFormFolder,
          "folders"
        ); //144028521583, 155292358576
        console.log(getCollaborators);
        let getMyPermissionLevel = false;
        if (getCollaborators)
          getMyPermissionLevel = checkDataSubmissionPermissionLevel(
            getCollaborators,
            JSON.parse(localStorage.parms).login
          );
        console.log(getMyPermissionLevel);
        if (getMyPermissionLevel) {
          confluenceDiv.innerHTML = await formSection("form");
          populateAmendSelect();
          document
            .getElementById("amendmentyes")
            .addEventListener("click", amendFormSelect);
          document
            .getElementById("amendmentno")
            .addEventListener("click", amendFormSelect);
          await dataForm();
        } else {
          confluenceDiv.innerHTML = await formSectionOther("form");
          hideAnimation();
        }
        formFunctions();
        hideAnimation();
      });
    }
    if (acceptedStudiesElement) {
      acceptedStudiesElement.addEventListener("click", () => {
        if (acceptedStudiesElement.classList.contains("navbar-active")) return;
        const element = document.getElementById("acceptedStudiesViewnav");
        showAnimation();
        if (!element) return;
        if (element.classList.contains("navbar-active")) return;
        document.title = "BCRPP - Accepted Studies";
        assignNavbarActive(element, 1);
        confluenceDiv.innerHTML = acceptedStudiesSection("acceptedStudies");
        acceptedStudiesView();
        hideAnimation();
      });
    }
    if (chairViewElement) {
      chairViewElement.addEventListener("click", () => {
        if (chairViewElement.classList.contains("navbar-active")) return;
        const element = document.getElementById("chairView");
        showAnimation();
        if (!element) return;
        if (element.classList.contains("navbar-active")) return;
        document.title = "BCRPP - Chair View";
        assignNavbarActive(element, 1);
        confluenceDiv.innerHTML = chairSection("chairView");
        chairFileView();
      });
    }
    if (daccViewElement) {
      daccViewElement.addEventListener("click", () => {
        if (daccViewElement.classList.contains("navbar-active")) return;
        const element = document.getElementById("daccView");
        showAnimation();
        if (!element) return;
        if (element.classList.contains("navbar-active")) return;
        document.title = "BCRPP - DACC View";
        assignNavbarActive(element, 1);
        confluenceDiv.innerHTML = daccSection("daccView");
        daccFileView();
      });
    }
    if (dataRequestElement) {
      dataRequestElement.addEventListener("click", () => {
        if (dataRequestElement.classList.contains("navbar-active")) return;
        const element = document.getElementById("dataRequest");
        if (!element) return;
        if (element.classList.contains("navbar-active")) return;
        document.title = "BCRPP - Data Access";
        assignNavbarActive(element, 1);
        confluenceDiv.innerHTML = dataRequestTemplate("overview");
        hideAnimation();
      });
    }
    if(acceptedFormsElement) {
      acceptedFormsElement.addEventListener('click', () => {
          if (acceptedFormsElement.classList.contains('navbar-active')) return;
          const element = document.getElementById("acceptedForms")
          showAnimation();
          assignNavbarActive(element, 2);
          document.title = 'BCRPP - Accepted Data Requests';
          //confluenceDiv.innerHTML = authTableTemplate();
          console.log("accepted forms");
          confluenceDiv.innerHTML = acceptedDocs();
          acceptedDocsView();
      });
   }

    const folders = await getFolderItems(0);
    const array = filterConsortiums(folders.entries);
    const projectArray = filterProjects(folders.entries);
    const getCollaborators = await getCollaboration(145995765326, "folders");
    let getMyPermissionLevel = false;
    if (getCollaborators)
      getMyPermissionLevel = checkDataSubmissionPermissionLevel(
        getCollaborators,
        JSON.parse(localStorage.parms).login
      );
    let showProjects = false;
    if (array.length > 0 && projectArray.length > 0 && showProjects === true) {
      document.getElementById("governanceNav").innerHTML = `
                ${
                  getMyPermissionLevel
                    ? `
                    <a hidden class="dropdown-item nav-link nav-menu-links dropdown-menu-links navbar-active" href="#data_governance" title="Data Governance" id="dataGovernance">
                        Data Governance
                    </a>
                `
                    : ``
                }
            `;
      document.getElementById("myProjectsNav").innerHTML = `
                <a hidden class="dropdown-item nav-link nav-menu-links dropdown-menu-links" href="#my_projects" title="My Projects" id="myProjects">
                    My Projects
                </a>
            `;
      addEventDataGovernanceNavBar(true);
      addEventMyProjects();
    } else if (array.length > 0 && getMyPermissionLevel) {
      document.getElementById("governanceNav").innerHTML = `
                <a hidden class="dropdown-item nav-link nav-menu-links dropdown-menu-links navbar-active" href="#data_governance" title="Data Governance" id="dataGovernance">
                    Data Governance
                </a>
            `;
      addEventDataGovernanceNavBar(true);
    } else if (projectArray.length > 0 && showProjects === true) {
      document.getElementById("myProjectsNav").innerHTML = `
                <a hidden class="dropdown-item nav-link nav-menu-links dropdown-menu-links" href="#my_projects" title="My Projects" id="myProjects">
                    My Projects
                </a>
            `;
      addEventMyProjects();
    } else if (getMyPermissionLevel) {
      document.getElementById("governanceNav").innerHTML = `
                <a hidden class="dropdown-item nav-link nav-menu-links dropdown-menu-links navbar-active" href="#data_governance" title="Data Governance" id="dataGovernance">
                    Data Governance
                </a>
            `;
      addEventDataGovernanceNavBar(true);
    }
    manageHash();
  }
};

const manageRouter = async () => {
  document.querySelector("[role='contentinfo']").innerHTML = footerTemplate();
  if (localStorage.parms !== undefined) return;
  const hash = decodeURIComponent(window.location.hash);
  if (
    !document.getElementById("navBarBtn").classList.contains("collapsed") &&
    document.getElementById("navbarToggler").classList.contains("show")
  )
    document.getElementById("navBarBtn").click();
  if (hash === "#home") {
    const element = document.getElementById("homePage");
    if (!element) return;
    if (element.classList.contains("navbar-active")) return;
    document.title = "BCRP Data Platform";
    assignNavbarActive(element);
    infoDeck();
    hideAnimation();
  } else if (hash === "#about/overview") {
    const element = document.getElementById("aboutBCRPP");
    if (!element) return;
    if (element.classList.contains("navbar-active")) return;
    document.title = "BCRPP - Overview";
    assignNavbarActive(element, 1);
    aboutConfluence("overview", true);
    renderOverView();
  } else if (hash === "#about/contact") {
    const element = document.getElementById("contactBCRPP");
    if (!element) return;
    if (element.classList.contains("navbar-active")) return;
    document.title = "BCRPP - DACC Members";
    assignNavbarActive(element, 1);
    aboutConfluence("contact", true);
    confluenceContactPage();
    hideAnimation();
  } else if (hash === "#about/description") {
    const element = document.getElementById("studydescBCRPP");
    if (!element) return;
    console.log("test");
    //if (element.classList.contains("navbar-active")) return;
    assignNavbarActive(element, 1);
    document.title = "BCRP - Study Description";
    showAnimation();
    // const fileInfo = await getFileInfo(904897189551); //new: 904897189551; original: 881144462693
    aboutConfluence("description", true);
    renderDescriptionNotSignedIn('test');
    hideAnimation();
  } else if (hash === "#join") {
    const element = document.getElementById("resourcesBCRPP");
    if (!element) return;
    if (element.classList.contains("navbar-active")) return;
    document.title = "BCRPP - Resources";
    assignNavbarActive(element, 1);
    confluenceResources();
  }
  // else if (hash === "#contact") {
  //   const element = document.getElementById("contactBCRPP");
  //   if (!element) return;
  //   if (element.classList.contains("navbar-active")) return;
  //   document.title = "BCRPP - Contact";
  //   assignNavbarActive(element, 1);
  //   confluenceDiv.innerHTML = confluenceContactPage();
  // }
  else if (hash === "#data_access/overview") {
    const element = document.getElementById("dataRequest");
    if (!element) return;
    if (element.classList.contains("navbar-active")) return;
    document.title = "BCRPP - Data Access";
    assignNavbarActive(element, 1);
    confluenceDiv.innerHTML = dataAccessNotSignedIn();
  } else if (hash === "#data_access/form") {
    const dataFormElement = document.getElementById("dataForm");
    if (!dataFormElement) return;
    if (dataFormElement.classList.contains("navbar-active")) return;
    showAnimation();
    assignNavbarActive(dataFormElement, 1);
    document.title = "BCRPP - Data Form";
    confluenceDiv.innerHTML = await formSection();
    removeActiveClass("nav-link", "active");
    formFunctions();
  } else if (hash === "#data_access/acceptedStudies") {
    const acceptedStudiesElement = document.getElementById(
      "acceptedStudiesView"
    );
    if (!acceptedStudiesElement) return;
    if (acceptedStudiesElement.classList.contains("navbar-active")) return;
    showAnimation();
    assignNavbarActive(acceptedStudiesElement, 1);
    document.title = "BCRPP - Accepted Studies";
    confluenceDiv.innerHTML = acceptedStudiesSection();
    removeActiveClass("nav-link", "active");
  } else if (hash === "#data_access/chairView") {
    const chairViewElement = document.getElementById("chairView");
    if (!chairViewElement) return;
    if (chairViewElement.classList.contains("navbar-active")) return;
    showAnimation();
    assignNavbarActive(chairViewElement, 1);
    document.title = "BCRPP - Chair View";
    confluenceDiv.innerHTML = chairSection();
    removeActiveClass("nav-link", "active");
  } else if (hash === "#data_access/daccView") {
    const daccViewElement = document.getElementById("daccView");
    showAnimation();
    if (!daccViewElement) return;
    if (daccViewElement.classList.contains("navbar-active")) return;
    assignNavbarActive(daccViewElement, 1);
    document.title = "BCRPP - DACC View";
    confluenceDiv.innerHTML = daccSection();
    removeActiveClass("nav-link", "active");
  } 
  else if (hash === '#accepted_forms') {
    const element = document.getElementById('acceptedForms');
    if (!element) return;
    if (element.classList.contains('navbar-active')) return;
    document.title = 'BCRPP - Accepted Data Requests';
    assignNavbarActive(element, 1);
    //confluenceDiv.innerHTML = AuthTableTemplate();
    console.log("accepted forms");
    confluenceDiv.innerHTML = acceptedDocs();
    acceptedDocsView();
  }
  else if (hash === "#data_exploration/dictionary") {
    const dataDictionaryElement = document.getElementById("dataDictionary");
    if (
      !dataDictionaryElement ||
      dataDictionaryElement.classList.contains("navbar-active")
    )
      return;
    showAnimation();
    assignNavbarActive(dataDictionaryElement, 1);
    document.title = "BCRPP - Data Dictionary";
    confluenceDiv.innerHTML = dataSummary(
      "Data Dictionary",
      true,
      false,
      false,
      true
    );
    removeActiveClass("nav-link", "active");
    document
      .querySelectorAll('[href="#data_exploration/dictionary"]')[1]
      .classList.add("active");
    dataDictionaryTemplate();
  } else if (hash === "#userSubmissions") {
    const viewUserSubmissionElement =
      document.getElementById("userSubmissions");
    if (
      !viewUserSubmissionElement ||
      viewUserSubmissionElement.classList.contains("navbar-active")
    )
      return;
    showAnimation();
    assignNavbarActive(viewUserSubmissionElement, 1);
    document.title = "BCRPP - Your Submissions";
    userSubmissionTemplate("Your Submissions", "User Submissions");
    hideAnimation();
  } else if (hash ==="#data_exploration/summary"){
    const dataSummaryElement = document.getElementById("dataSummary");
    assignNavbarActive(dataSummaryElement, 1);
    document.title = "BCRPP - Summary Statistics";
    confluenceDiv.innerHTML = dataSummary("Summary Statistics", false, false, false, true);
    addEventUpdateSummaryStatsData();
    addEventcreateaccessStats();
    dataSummaryStatisticsTemplate();
    await getFileContentNL();
    const subcasesSelection = document.getElementById("subcasesSelection");
    subcasesSelection.addEventListener("change", function (event) {
      if (event.target.value == "all") getFileContentNL();
      if (event.target.value == "cases") getFileContentCasesNL();
    });
  } else window.location.hash = "#home";
};

const manageHash = async () => {
  document.querySelector("[role='contentinfo']").innerHTML = footerTemplate();
  if (localStorage.parms === undefined) return;
  const hash = decodeURIComponent(window.location.hash);
  if (
    !document.getElementById("navBarBtn").classList.contains("collapsed") &&
    document.getElementById("navbarToggler").classList.contains("show")
  )
    document.getElementById("navBarBtn").click();
  if (hash === "#data_exploration/summary") {
    const element = document.getElementById("dataSummary");
    if (!element) return;
    element.click();
  } else if (
    hash === "#data_exploration/subset" &&
    !location.origin.match(applicationURLs.prod)
  ) {
    const element = document.getElementById("dataSummarySubset");
    if (!element) return;
    element.click();
  } else if (hash === "#data_exploration/dictionary") {
    const element = document.getElementById("dataDictionary");
    if (!element) return;
    element.click();
  } else if (hash === "#userSubmissions") {
    const element = document.getElementById("userSubmissions");
    if (!element) return;
    element.click();
  } else if (hash === "#data_access/overview") {
    const element = document.getElementById("dataRequest");
    element.click();
  } else if (hash === "#data_access/form") {
    const element = document.getElementById("dataForm");
    if (!element) return;
    element.click();
  } else if (hash === "#data_access/acceptedStudies") {
    const element = document.getElementById("acceptedStudies");
    if (!element) return;
    element.click();
  } else if (hash === "#data_access/chairView") {
    const element = document.getElementById("chairView");
    if (!element) return;
    element.click();
  } else if (hash === "#data_access/daccView") {
    const element = document.getElementById("daccView");
    if (!element) return;
    element.click();
  } else if (hash === "#data_submission") {
    const element = document.getElementById("dataSubmission");
    element.click();
  } else if (hash === "#data_governance") {
    const element = document.getElementById("dataGovernance");
    if (element) {
      element.click();
    } else window.location.hash = "#";
  } else if (hash === '#accepted_forms') {
    const element = document.getElementById('acceptedForms');
    element.click();
  } else if (hash === '#accepted_forms') {
  const element = document.getElementById('acceptedForms');
  element.click();
  } else if (hash === "#my_projects") {
    const element = document.getElementById("myProjects");
    if (element) {
      element.click();
    } else window.location.hash = "#";
  } else if (hash === "#logout") {
    const element = document.getElementById("logOutBtn");
    element.click();
  } else if (hash === "#home") {
    const element = document.getElementById("homePage");
    if (!element) return;
    if (element.classList.contains("navbar-active")) return;
    assignNavbarActive(element);
    document.title = "BCRP Data Platform";
    infoDeckAfterLoggedIn();
    hideAnimation();
  } else if (hash === "#about/overview") {
    const element = document.getElementById("aboutBCRPP");
    if (!element) return;
    //if (element.classList.contains("navbar-active")) return;
    assignNavbarActive(element, 1);
    document.title = "BCRP - Overview";
    const fileInfo = await getFileInfo(904897189551);
    aboutConfluence("overview", fileInfo ? true : false);
    renderOverView();
    hideAnimation();
  } else if (hash === "#about/contact") {
    const element = document.getElementById("contactBCRPP");
    //console.log({ element });
    if (!element) return;
    if (element.classList.contains("navbar-active")) return;
    assignNavbarActive(element, 1);
    document.title = "BCRPP - DACC Members";
    //const fileInfo = await getFileInfo(904897189551);
    //console.log({ fileInfo });
    //aboutConfluence("contact", fileInfo ? true : false);
    aboutConfluence("contact", true);
    confluenceContactPage();
    hideAnimation();
  } else if (hash === "#about/description") {
    const element = document.getElementById("studydescBCRPP");
    if (!element) return;
    //if (element.classList.contains("navbar-active")) return;
    assignNavbarActive(element, 1);
    document.title = "BCRPP - Study Description";
    showAnimation();
    const fileInfo = await getFileInfo(904897189551); //new: 904897189551; original: 881144462693
    aboutConfluence("description", fileInfo ? true : false);
    renderDescription(fileInfo["content_modified_at"]);
    hideAnimation();
  } else if (hash === "#join") {
    const element = document.getElementById("resourcesBCRPP");
    if (!element) return;
    if (element.classList.contains("navbar-active")) return;
    assignNavbarActive(element, 1);
    document.title = "BCRP - Resources";
    confluenceResources();
    hideAnimation();
  }
  else if(hash === '#events/meetings') {
    const element = document.getElementById('events');
    if(!element) return;
    if(element.classList.contains('navbar-active')) return;
    assignNavbarActive(element, 1);
    document.title = 'Confluence - Events';
    showAnimation();
    confluenceDiv.innerHTML = confluenceEventsPage();
    await eventsBody();
    hideAnimation();
}
  // else if (hash === "#contact") {
  //   const element = document.getElementById("contactBCRPP");
  //   if (!element) return;
  //   if (element.classList.contains("navbar-active")) return;
  //   assignNavbarActive(element, 1);
  //   document.title = "BCRP - Committee";
  //   confluenceDiv.innerHTML = confluenceContactPage();
  //   hideAnimation();
  // }
  else window.location.hash = "#home";
};

window.onload = async () => {
  const confluenceDiv = document.getElementById("confluenceDiv");
  confluenceDiv.innerHTML = "";
  if (localStorage.parms && JSON.parse(localStorage.parms).access_token) {
    await checkAccessTokenValidity();
    inactivityTime();
  }
  await confluence();
};

window.onhashchange = () => {
  manageHash();
  manageRouter();
};

window.onstorage = () => {
  if (localStorage.parms === undefined) logOut();
  else {
    confluence();
    document.getElementById("loginBoxAppDev").hidden = true;
    document.getElementById("loginBoxAppStage").hidden = true;
    document.getElementById("loginBoxAppEpisphere").hidden = true;
    document.getElementById("loginBoxAppProd").hidden = true;
  }
};

window.addEventListener("beforeinstallprompt", (e) => {
  e.userChoice.then((choiceResult) => {
    gtag("send", "event", "A2H", choiceResult.outcome);
  });
});

import { navBarMenutemplate } from './src/components/navBarMenuItems.js';
import { infoDeck, infoDeckAfterLoggedIn } from './src/pages/homePage.js';
import { dataSubmissionTemplate, lazyload } from './src/pages/dataSubmission.js';
import { dataSummary, dataSummaryMissingTemplate, dataSummaryStatisticsTemplate } from './src/pages/dataExploration.js';
import { dataAccess as dataRequestTemplate, dataAccessNotSignedIn, dataForm, dataApproval, formSection, approveRejectSection, daccSection, chairSection, chairFileView, daccFileView } from './src/pages/dataRequest.js';
import { checkAccessTokenValidity, loginAppDev, loginObs, loginAppEpisphere, logOut, loginAppProd } from './src/manageAuthentication.js';
import { storeAccessToken, removeActiveClass, showAnimation, getCurrentUser, inactivityTime, filterConsortiums, getFolderItems, filterProjects, amIViewer, getCollaboration, hideAnimation, assignNavbarActive, getFileInfo, handleRangeRequests, applicationURLs, checkDataSubmissionPermissionLevel } from './src/shared.js';
import { addEventConsortiaSelect, addEventUploadStudyForm, addEventStudyRadioBtn, addEventDataGovernanceNavBar, addEventMyProjects, addEventUpdateSummaryStatsData } from './src/event.js';
import { dataAnalysisTemplate } from './src/pages/dataAnalysis.js';
import { getFileContent, getFileContentCases } from './src/visualization.js';
import { aboutConfluence, renderOverView } from './src/pages/about.js';
import { confluenceResources } from './src/pages/join.js';
import { confluenceContactPage } from './src/pages/contact.js';
import { footerTemplate } from './src/components/footer.js';
import { renderDescription } from './src/pages/description.js';
import { dataDictionaryTemplate } from './src/pages/dictionary.js';
import { showPreview } from './src/components/boxPreview.js';



export const confluence = async () => {
    // handleRangeRequests();
    if('serviceWorker' in navigator){
        try {
            navigator.serviceWorker.register('./serviceWorker.js');
        }
        catch (error) {
            console.log(error);
        }
    }
    const confluenceDiv = document.getElementById('confluenceDiv');
    const navBarOptions = document.getElementById('navBarOptions');
    document.getElementById('loginBoxAppDev').addEventListener('click', loginAppDev);
    document.getElementById('loginBoxAppStage').addEventListener('click', loginObs);
    document.getElementById('loginBoxAppEpisphere').addEventListener('click', loginAppEpisphere);
    document.getElementById('loginBoxAppProd').addEventListener('click', loginAppProd);

    if (localStorage.parms === undefined) {
        const loginBoxAppDev = document.getElementById('loginBoxAppDev');
        const loginBoxAppEpisphere = document.getElementById('loginBoxAppEpisphere');
        const loginBoxAppProd = document.getElementById('loginBoxAppProd');
        const loginBoxAppStage = document.getElementById('loginBoxAppStage');
        if (location.origin.match('localhost')) loginBoxAppDev.hidden = false;
        if (location.origin.match(applicationURLs.stage)) loginBoxAppStage.hidden = false;
        if (location.origin.match(applicationURLs.prod)) loginBoxAppProd.hidden = false;
        if (location.origin.match('episphere')) loginBoxAppEpisphere.hidden = false;
        storeAccessToken();
        manageRouter();
    }
    if (localStorage.parms && JSON.parse(localStorage.parms).access_token) {
        const response = await getCurrentUser();
        showAnimation();
        if (response) {
            const lclStr = JSON.parse(localStorage.parms);
            localStorage.parms = JSON.stringify({...lclStr, ...response});
        }
        navBarOptions.innerHTML = navBarMenutemplate();
        document.getElementById('logOutBtn').addEventListener('click', logOut);

        const dataSubmissionElement = document.getElementById('dataSubmission');
        const dataSummaryElement = document.getElementById('dataSummary');
        const dataSummarySubsetElement = document.getElementById('dataSummarySubset');
        const dataDictionaryElement = document.getElementById('dataDictionary');
        const dataRequestElement = document.getElementById('dataRequest');
        const dataFormElement = document.getElementById('dataForm')
        const chairViewElement = document.getElementById('chairView')
        const daccViewElement = document.getElementById('daccView')
        // const platformTutorialElement = document.getElementById('platformTutorial');
        // const dataAnalysisElement = document.getElementById('dataAnalysis');

        dataSubmissionElement.addEventListener('click', async () => {
            if (dataSubmissionElement.classList.contains('navbar-active')) return;
            showAnimation();
            assignNavbarActive(dataSubmissionElement, 1)
            document.title = 'BCRPP - Data Submit';
            confluenceDiv.innerHTML = await dataSubmissionTemplate();
            lazyload();
            addEventStudyRadioBtn();
            addEventConsortiaSelect();
            addEventUploadStudyForm();
            hideAnimation();
        });
        dataSummaryElement.addEventListener('click', () => {
            if (dataSummaryElement.classList.contains('navbar-active')) return;
            showAnimation();
            assignNavbarActive(dataSummaryElement, 1)
            document.title = 'BCRPP - Summary Statistics';
            confluenceDiv.innerHTML = dataSummary('Summary Statistics', false, true, true);
            addEventUpdateSummaryStatsData();
            dataSummaryStatisticsTemplate();
            // if(document.getElementById('dataSummaryFilter')) document.getElementById('dataSummaryFilter').addEventListener('click', e => {
            //     e.preventDefault();
            //     const header = document.getElementById('confluenceModalHeader');
            //     const body = document.getElementById('confluenceModalBody');
            //     header.innerHTML = `<h5 class="modal-title">Filter summary data</h5>
            //                         <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            //                             <span aria-hidden="true">&times;</span>
            //                         </button>`;
            //     body.innerHTML = `<span>Select Consortia or Studies to Display</span>`;
            // })
            getFileContent();
            const subcasesSelection = document.getElementById('subcasesSelection');
            subcasesSelection.addEventListener('change', function(event) {
                if (event.target.value == 'all') getFileContent()
                if (event.target.value == 'cases') getFileContentCases()
            });
        });

        if(dataSummarySubsetElement) {
            dataSummarySubsetElement.addEventListener('click', () => {
                if (dataSummarySubsetElement.classList.contains('navbar-active')) return;
                const confluenceDiv = document.getElementById('confluenceDiv');
                showAnimation();
                assignNavbarActive(dataSummarySubsetElement, 1);
                document.title = 'BCRPP - Subset Statistics';
                confluenceDiv.innerHTML = dataSummary('Subset Statistics', false, true, true);
                addEventUpdateSummaryStatsData();
                removeActiveClass('nav-link', 'active');
                document.querySelectorAll('[href="#data_exploration/subset"]')[1].classList.add('active');
                dataSummaryMissingTemplate();
            })
        }
        if(dataDictionaryElement){
            dataDictionaryElement.addEventListener('click', () => {
                if (dataDictionaryElement.classList.contains('navbar-active')) return;
                const confluenceDiv = document.getElementById('confluenceDiv');
                showAnimation();
                assignNavbarActive(dataDictionaryElement, 1);
                document.title = 'BCRPP - Data Dictionary';
                confluenceDiv.innerHTML = dataSummary('Data Dictionary', true, false, false);
                addEventUpdateSummaryStatsData();
                removeActiveClass('nav-link', 'active');
                document.querySelectorAll('[href="#data_exploration/dictionary"]')[1].classList.add('active');
                dataDictionaryTemplate();
            })
        }
        if(dataFormElement){
            dataFormElement.addEventListener('click', () => {
                if (dataFormElement.classList.contains('navbar-active')) return;
                const element = document.getElementById('dataForm');
                if(!element) return;
                if(element.classList.contains('navbar-active')) return;
                document.title = 'BCRPP - Data Form';
                assignNavbarActive(element, 1);
                //dataForm();
                confluenceDiv.innerHTML = formSection('form');
                //confluenceDiv.innerHTML = approveRejectSection();
                dataForm();
                //dataApproval();
                hideAnimation();
            })
        }
        if(chairViewElement){
            chairViewElement.addEventListener('click', () => {
                if (chairViewElement.classList.contains('navbar-active')) return;
                const element = document.getElementById('chairView');
                if(!element) return;
                if(element.classList.contains('navbar-active')) return;
                document.title = 'BCRPP - Chair View';
                assignNavbarActive(element, 1);
                //dataForm();
                confluenceDiv.innerHTML = chairSection('chairView');
                chairFileView();
                //hideAnimation();
                //dataForm();
                hideAnimation();
            })
        }
        if(daccViewElement){
            daccViewElement.addEventListener('click', () => {
                if (daccViewElement.classList.contains('navbar-active')) return;
                const element = document.getElementById('daccView');
                if(!element) return;
                if(element.classList.contains('navbar-active')) return;
                document.title = 'BCRPP - DACC View';
                assignNavbarActive(element, 1);
                //dataForm();
                confluenceDiv.innerHTML = daccSection('daccView');
                daccFileView();
                //hideAnimation();
                //dataForm();
                hideAnimation();
            })
        }

        dataRequestElement.addEventListener('click', () => {
            if (dataRequestElement.classList.contains('navbar-active')) return;
            // const confluenceDiv = document.getElementById('dataRequest');
            // showAnimation();
            // assignNavbarActive(dataRequestElement, 1)
            // document.title = 'BCRPP - Data Access';
            //confluenceDiv.innerHTML = dataAccessNotSignedIn();
            //dataForm();
            //dataApproval();
            //hideAnimation();
            const element = document.getElementById('dataRequest');
            if(!element) return;
            if(element.classList.contains('navbar-active')) return;
            document.title = 'BCRPP - Data Access';
            assignNavbarActive(element, 1);
            //dataRequestTemplate();
            //confluenceDiv.innerHTML = formSection('form');
            confluenceDiv.innerHTML = dataRequestTemplate('overview');
            //dataForm();
            //dataApproval();
            hideAnimation();
        });
        // platformTutorialElement.addEventListener('click', () => {
        //     if (platformTutorialElement.classList.contains('navbar-active')) return;
        //     showAnimation();
        //     assignNavbarActive(platformTutorialElement)
        //     document.title = 'Confluence Platform Tutorials';
        //     confluenceDiv.innerHTML = dataRequestTemplate();
        //     hideAnimation();
        // });
        // dataAnalysisElement.addEventListener('click', () => {
        //     if (dataAnalysisElement.classList.contains('navbar-active')) return;
        //     showAnimation();
        //     assignNavbarActive(dataAnalysisElement, 1);
        //     document.title = 'Confluence - Data Analysis';
        //     confluenceDiv.innerHTML = dataAnalysisTemplate();
        //     hideAnimation();
        // });

        const folders = await getFolderItems(0);
        const array = filterConsortiums(folders.entries);
        const projectArray = filterProjects(folders.entries);
        const getCollaborators = await getCollaboration(145995765326, 'folders');
        let getMyPermissionLevel = false;
        if(getCollaborators) getMyPermissionLevel =  checkDataSubmissionPermissionLevel(getCollaborators, JSON.parse(localStorage.parms).login);
        //console.log('145995765326 '+getMyPermissionLevel);
        let showProjects = false;
        // for (let obj of projectArray) {
        //     if (showProjects === false) {
        //         const bool = amIViewer(await getCollaboration(obj.id, `${obj.type}s`), JSON.parse(localStorage.parms).login);
        //         if (bool === true) showProjects = true;
        //     }
        // }
        if (array.length > 0 && projectArray.length > 0 && showProjects === true) {
            document.getElementById('governanceNav').innerHTML = `
                ${getMyPermissionLevel ? `
                    <a class="dropdown-item nav-link nav-menu-links dropdown-menu-links navbar-active" href="#data_governance" title="Data Governance" id="dataGovernance">
                        Data Governance
                    </a>
                `: ``}
            `;
            document.getElementById('myProjectsNav').innerHTML = `
                <a class="dropdown-item nav-link nav-menu-links dropdown-menu-links" href="#my_projects" title="My Projects" id="myProjects">
                    My Projects
                </a>
            `;
            addEventDataGovernanceNavBar(true);
            addEventMyProjects();
        } else if (array.length > 0 && getMyPermissionLevel) {
            document.getElementById('governanceNav').innerHTML = `
                <a class="dropdown-item nav-link nav-menu-links dropdown-menu-links navbar-active" href="#data_governance" title="Data Governance" id="dataGovernance">
                    Data Governance
                </a>
            `;
            addEventDataGovernanceNavBar(true);
        } else if (projectArray.length > 0 && showProjects === true) {
            document.getElementById('myProjectsNav').innerHTML = `
                <a class="dropdown-item nav-link nav-menu-links dropdown-menu-links" href="#my_projects" title="My Projects" id="myProjects">
                    My Projects
                </a>
            `;
            addEventMyProjects();
        }
        else if (getMyPermissionLevel) {
            document.getElementById('governanceNav').innerHTML = `
                <a class="dropdown-item nav-link nav-menu-links dropdown-menu-links navbar-active" href="#data_governance" title="Data Governance" id="dataGovernance">
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
    if(localStorage.parms !== undefined) return;
    const hash = decodeURIComponent(window.location.hash);
    if(!document.getElementById('navBarBtn').classList.contains('collapsed') && document.getElementById('navbarToggler').classList.contains('show')) document.getElementById('navBarBtn').click();
    if(hash === '#home'){
        const element = document.getElementById('homePage');
        if(!element) return;
        if(element.classList.contains('navbar-active')) return;
        document.title = 'BCRP Data Platform';
        assignNavbarActive(element)
        infoDeck();
        hideAnimation();
    }
    else if(hash === '#about/overview'){
        const element = document.getElementById('aboutBCRPP');
        if(!element) return;
        if(element.classList.contains('navbar-active')) return;
        document.title = 'BCRPP - Overview';
        console.log("Overview")
        assignNavbarActive(element, 1);
        aboutConfluence('overview');
        renderOverView();
    }
    else if(hash === '#join'){
        const element = document.getElementById('resourcesBCRPP');
        if(!element) return;
        if(element.classList.contains('navbar-active')) return;
        document.title = 'BCRPP - Resources';
        assignNavbarActive(element, 1);
        confluenceResources();
    }
    else if(hash === '#contact'){
        const element = document.getElementById('contactBCRPP');
        if(!element) return;
        if(element.classList.contains('navbar-active')) return;
        document.title = 'BCRPP - Contact';
        assignNavbarActive(element, 1);
        confluenceDiv.innerHTML = confluenceContactPage();
    }
    else if (hash === '#data_access/overview') {
        const element = document.getElementById('dataRequest');
        if(!element) return;
        if(element.classList.contains('navbar-active')) return;
        document.title = 'BCRPP - Data Access';
        assignNavbarActive(element, 1);
        confluenceDiv.innerHTML = dataAccessNotSignedIn();
        //confluenceDiv.innerHTML = dataRequestTemplate();
        //dataForm();
        //dataApproval();
        //hideAnimation();
    }
    else if (hash === '#data_access/form'){
        const dataFormElement = document.getElementById('dataForm');
        if (!dataFormElement) return;
        if(dataFormElement.classList.contains('navbar-active')) return;
        showAnimation();
        assignNavbarActive(dataFormElement, 1);
        document.title = 'BCRPP - Data Form';
        confluenceDiv.innerHTML = formSection();
        //confluenceDiv.innerHTML = approveRejectSection();
        removeActiveClass('nav-link', 'active');
    }

    else if (hash === '#data_access/chairView'){
        const chairViewElement = document.getElementById('chairView');
        if (!chairViewElement) return;
        if(chairViewElement.classList.contains('navbar-active')) return;
        showAnimation();
        assignNavbarActive(chairViewElement, 1);
        document.title = 'BCRPP - Chair View';
        confluenceDiv.innerHTML = chairSection();
        removeActiveClass('nav-link', 'active');
    }

    else if (hash === '#data_access/daccView'){
        const daccViewElement = document.getElementById('daccView');
        if (!daccViewElement) return;
        if(daccViewElement.classList.contains('navbar-active')) return;
        showAnimation();
        assignNavbarActive(daccViewElement, 1);
        document.title = 'BCRPP - DACC View';
        confluenceDiv.innerHTML = daccSection();
        removeActiveClass('nav-link', 'active');
    }

    else if (hash === '#data_exploration/dictionary') {
        const dataDictionaryElement = document.getElementById('dataDictionary');
        if (!dataDictionaryElement || dataDictionaryElement.classList.contains('navbar-active')) return;
        showAnimation();
        assignNavbarActive(dataDictionaryElement, 1);
        document.title = 'BCRPP - Data Dictionary';
        confluenceDiv.innerHTML = dataSummary('Data Dictionary', true, false, false, true);
        removeActiveClass('nav-link', 'active');
        document.querySelectorAll('[href="#data_exploration/dictionary"]')[1].classList.add('active');
        dataDictionaryTemplate();
    }
    else window.location.hash = '#home';
}

const manageHash = async () => {
    document.querySelector("[role='contentinfo']").innerHTML = footerTemplate();
    if(localStorage.parms === undefined) return;
    const hash = decodeURIComponent(window.location.hash);
    if(!document.getElementById('navBarBtn').classList.contains('collapsed') && document.getElementById('navbarToggler').classList.contains('show')) document.getElementById('navBarBtn').click();
    if(hash === '#data_exploration/summary') {
        const element = document.getElementById('dataSummary');
        if(!element) return;
        element.click();
    }
    else if(hash === '#data_exploration/subset' && !location.origin.match(applicationURLs.prod)) {
        const element = document.getElementById('dataSummarySubset');
        if(!element) return;
        element.click()
    }
    else if(hash === '#data_exploration/dictionary') {
        const element = document.getElementById('dataDictionary');
        if(!element) return;
        element.click()
    }
    // else if (hash === '#data_analysis') {
    //     const element = document.getElementById('dataAnalysis');
    //     element.click();
    // }
    else if (hash === '#data_access/overview') {
        const element = document.getElementById('dataRequest');
        element.click();
    }
    else if (hash === '#data_access/form') {
        const element = document.getElementById('dataForm');
        if(!element) return;
        element.click();
    }
    else if (hash === '#data_access/chairView') {
        const element = document.getElementById('chairView');
        if(!element) return;
        element.click();
    }
    else if (hash === '#data_access/daccView') {
        const element = document.getElementById('daccView');
        if(!element) return;
        element.click();
    }
    // else if (hash === '#tutorials') {
    //     const element = document.getElementById('platformTutorial');
    //     element.click();
    // }
    else if (hash === '#data_submission') {
        const element = document.getElementById('dataSubmission');
        element.click();
    }
    else if (hash === '#data_governance') {
        const element = document.getElementById('dataGovernance');
        if (element) {
            element.click();
        }
        else window.location.hash = '#';
    }
    else if (hash === '#my_projects') {
        const element = document.getElementById('myProjects');
        if (element) {
            element.click();
        } else window.location.hash = '#';
    } 
    else if (hash === '#logout') {
        const element = document.getElementById('logOutBtn');
        element.click();
    }
    else if(hash === '#home'){
        const element = document.getElementById('homePage');
        if(!element) return;
        if(element.classList.contains('navbar-active')) return;
        assignNavbarActive(element);
        document.title = 'BCRP Data Platform';
        infoDeckAfterLoggedIn();
        hideAnimation();
    }
    else if(hash === '#about/overview'){
        const element = document.getElementById('aboutBCRPP');
        if(!element) return;
        // if(element.classList.contains('navbar-active')) return;
        assignNavbarActive(element, 1);
        document.title = 'BCRP - Overview';

        const fileInfo = await getFileInfo(904897189551);
        aboutConfluence('overview', fileInfo ? true : false);
        renderOverView();
        hideAnimation();
    }
    else if(hash === '#about/description'){
        const element = document.getElementById('aboutBCRPP');
        if(!element) return;
        // if(element.classList.contains('navbar-active')) return;
        assignNavbarActive(element, 1);
        document.title = 'BCRP - Study Description';
        showAnimation();
        const fileInfo = await getFileInfo(904897189551); //new: 904897189551; original: 881144462693
        //if(!fileInfo) {
        //    location.hash = '#about/overview';
        //    hideAnimation();
        //    return;
        //}
        aboutConfluence('description', fileInfo ? true : false);
        renderDescription(fileInfo['content_modified_at']);
        hideAnimation();
    }
    else if(hash === '#join'){
        const element = document.getElementById('resourcesBCRPP');
        if(!element) return;
        if(element.classList.contains('navbar-active')) return;
        assignNavbarActive(element, 1);
        document.title = 'BCRP - Resources';
        confluenceResources();
        hideAnimation();
    }
    else if(hash === '#contact'){
        const element = document.getElementById('contactBCRPP');
        if(!element) return;
        if(element.classList.contains('navbar-active')) return;
        assignNavbarActive(element, 1);
        document.title = 'BCRP - Committee';
        confluenceDiv.innerHTML = confluenceContactPage();
        hideAnimation();
    }
    else window.location.hash = '#home';
};

window.onload = async () => {
    const confluenceDiv = document.getElementById('confluenceDiv');
    confluenceDiv.innerHTML = '';
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
    if(localStorage.parms === undefined) logOut();
    else {
        confluence();
        document.getElementById('loginBoxAppDev').hidden = true;
        document.getElementById('loginBoxAppStage').hidden = true;
        document.getElementById('loginBoxAppEpisphere').hidden = true;
        document.getElementById('loginBoxAppProd').hidden = true;
    }
};

window.addEventListener('beforeinstallprompt', e => {
    e.userChoice.then(choiceResult => {
        gtag('send', 'event', 'A2H', choiceResult.outcome); 
    });
});



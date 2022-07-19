import { applicationURLs, emailforChair, emailforDACC } from './../shared.js';

export const navBarMenutemplate = () => {
    return `
        <div class="grid-elements">
            <a class="nav-link nav-menu-links white-font" href="#home" title="BCRPP Home" id="homePage">
                Home
            </a>
        </div>
        <div class="grid-elements dropdown">
            <button class="nav-link nav-menu-links dropdown-toggle dropdown-btn white-font" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                About BCRPP
            </button>
            <div class="dropdown-menu navbar-dropdown" aria-labelledby="navbarDropdown">
                <h6 class="dropdown-header dropdown-header-bg font-bold">Learn About BCRPP</h6>
                <a class="dropdown-item nav-link nav-menu-links dropdown-menu-links pl-4" href="#about/overview" id="aboutBCRPP">Overview</a>
                <a class="dropdown-item nav-link nav-menu-links dropdown-menu-links pl-4" href="#about/description" id="resourcesBCRPP">Description of Studies</a>
                <a class="dropdown-item nav-link nav-menu-links dropdown-menu-links" href="#contact" id="contactBCRPP">Scientific Committee</a>
            </div>
        </div>
        <div class="grid-elements dropdown">
            <button class="nav-link nav-menu-links dropdown-toggle dropdown-btn white-font" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Data
            </button>
            <div class="dropdown-menu navbar-dropdown" aria-labelledby="navbarDropdown">
                <h6 class="dropdown-header dropdown-header-bg font-bold">Explore Data</h6>
                <a class="dropdown-item nav-link nav-menu-links dropdown-menu-links pl-4" href="#data_exploration/dictionary" title="Data Dictionary" id="dataDictionary">
                Dictionary
                </a>
                <a class="dropdown-item nav-link nav-menu-links dropdown-menu-links pl-4" href="#data_exploration/summary" title="Summary Statistics" id="dataSummary">
                    Summary Statistics
                </a>
                ${
                    location.origin.match(applicationURLs.dev) ? 
                    ``:
                    `
                        <a class="dropdown-item nav-link nav-menu-links dropdown-menu-links pl-4" href="#data_exploration/subset" title="Subset Statistics" id="dataSummarySubset">
                            Subset Statistics
                        </a>
                    `
                }
                
                <a class="dropdown-item nav-link nav-menu-links dropdown-menu-links" href="#data_submission" title="Data Submitted" id="dataSubmission"> 
                    Submitted
                </a>
                <div id="governanceNav" class="grid-elements"></div>
                <div id="myProjectsNav" class="grid-elements"></div>
                <h6 class="dropdown-header dropdown-header-bg font-bold">Data Access</h6>
                <a class="dropdown-item nav-link nav-menu-links dropdown-menu-links pl-4" href="#data_access/overview" title="Data Access" id="dataRequest"> Overview </a>
                <a class="dropdown-item nav-link nav-menu-links dropdown-menu-links pl-4" href="#data_access/form" title="Data Form" id="dataForm"> Submission Form </a>
                <!--a class="dropdown-item nav-link nav-menu-links dropdown-menu-links pl-4" href="#data_access/accepted" title="Accepted Studies" id="dataAccepted"> Accepted </a-->
                ${emailforChair.indexOf(JSON.parse(localStorage.parms).login) !== -1 ? `<a class="dropdown-item nav-link nav-menu-links dropdown-menu-links pl-4" href="#data_access/chairView" title="Chair File View" id="chairView"> Chair Menu </a>`:``}
                ${emailforDACC.indexOf(JSON.parse(localStorage.parms).login) !== -1 ? `<a class="dropdown-item nav-link nav-menu-links dropdown-menu-links pl-4" href="#data_access/daccView" title="DACC Menu" id="daccView"> DACC Menu </a>`:``}
            </div>
        </div>
        <div class="grid-elements">
            <a class="nav-link nav-menu-links white-font" rel="noopener" target="_blank" href="https://github.com/episphere/bcrpDataPlatform/issues" title="BCRPP github issues">
                Report issue
            </a>
        </div>

        <div class="navbar-nav ml-auto">
            ${localStorage.parms && JSON.parse(localStorage.parms).name ? `
                <div class="grid-elements dropdown">
                    <button class="nav-link nav-menu-links dropdown-toggle dropdown-btn white-font"  title="Welcome, ${JSON.parse(localStorage.parms).name}!" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        ${JSON.parse(localStorage.parms).name}
                    </button>
                    <div class="dropdown-menu navbar-dropdown" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item nav-link nav-menu-links dropdown-menu-links" href="#logout" id="logOutBtn">Log Out</a>
                    </div>
                </div>
            ` : `
                <div class="grid-elements">
                    <a class="nav-link nav-menu-links" title="Log Out" href="#logout" id="logOutBtn">Log Out</a>
                </div>
            `}
            
        </div>
    `;
};

export function pageNavBar(page, activeTab, ...pageHeaders) {
    const containerEl = document.createElement('div');
    containerEl.classList.add('container');
    
    const outerDivEl = document.createElement('div');
    outerDivEl.classList.add('main-summary-row', 'white-bg', 'div-border');
    
    const innerDivEl = document.createElement('div');
    innerDivEl.classList.add('main-summary-row', 'white-bg', 'div-border');
    
    outerDivEl.appendChild(innerDivEl);
    containerEl.appendChild(outerDivEl);
    

    
    for (const header of pageHeaders){
        let btn = document.createElement('button');
        btn.classList.add('sub-menu-btn');
        let link = document.createElement('a');
        link.classList.add('nav-link', 'black-font', 'font-size-14', 'font-weight-bold');
        
        //Active Tab Function
        if(header === 'Overview'){
            link.href = `#${page}/overview`
            if(activeTab === 'overview')
                link.classList.add('active');
        }
        if(header === 'Submission Form'){
            link.href = `#${page}/form`
            if(activeTab === 'form')
                link.classList.add('active');
        }
        if(header === 'Chair Menu'){
            link.href = `#${page}/chairView`
            if(activeTab === 'chairView')
                link.classList.add('active');
        }
        if(header === 'Accepted'){
            link.href = `#${page}/acceptedStudies`
            if(activeTab === 'acceptedStudies')
                link.classList.add('active');
        }

        if(header === 'DACC Menu'){
            link.href = `#${page}/daccView`
            if(activeTab === 'daccView')
                link.classList.add('active');
        }

        if(header === 'Description of Studies'){
            link.href = `#${page}/description`
            if(activeTab === 'description')
                link.classList.add('active');
        }

        if(header === 'Summary Statistics'){
            link.href = `#${page}/summary`;
            if(activeTab === 'summary')
                link.classList.add('active');
        }
        if(header === 'Dictionary'){
            link.href =  `#${page}/dictionary`;
            if(activeTab === 'dictionary')
                link.classList.add('active');
        }
        if(header === 'Subset Statistics'){
            link.href =  `#${page}/subset`;
            if(activeTab === 'subset')
                link.classList.add('active');
        }


        

        link.innerText = header;
        btn.appendChild(link);
        innerDivEl.appendChild(btn);

    }
    if(page !== 'data_exploration'){
    const overviewDiv = document.createElement('div');
    
    overviewDiv.id = 'overview';
    containerEl.appendChild(overviewDiv);
    }

    return containerEl.innerHTML;
}

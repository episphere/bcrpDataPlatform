// Major updates required
import { getFileInfo } from "./../shared.js";

export const infoDeck = () => {
  let template = "";
  template += `
        <div class="secondary-bg padding-bottom-1rem">
            <div class="confluence-banner">
                <div class="banner-logo">
                    <div class="banner-overlay-text row justify-content-center text-center">
                        <div class="col-xl-12">
                            <h1 class="banner-overlay-h1">The Breast Cancer Risk Prediction Project (BCRPP)</h1>
                            <div class="banner-overlay-line"></div>
                            <h2 class="banner-overlay-h3" style="font-size:1.7vw;"> Building an integrated multi-ethnic breast cancer risk prediction model</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container align-middle text-center" style="margin-top: 70px;">
                <div class="card-deck" id="infoDeck" style="min-height: 200px;">`;
  template += cardContents({
    header: "Learn about BCRPP",
    button: "Learn about BCRPP",
    href: "#about/overview",
    icon: "fa-download",
    explanation: "View main goals and collaborating institutions.",
  });
  template += cardContents({
    header: "Data Access",
    button: "Data Access",
    href: "#data_access/overview",
    icon: "fa-handshake",
    explanation: "View procedures for accessing data.",
  });
  template += cardContents({
    header: "Data Dictionary",
    button: "Data Dictionary",
    href: "#data_exploration/dictionary",
    icon: "fa-database",
    explanation: "View data types collected from participating cohort studies.",
  });
  template += `</div>
            </div>
        </div>
        <div class="secondary-bg inverse-triangle"></div>
        <div class="container align-center">
            <div class="font-size-28 font-bold font-family-montserrat our-goals mt-3 mb-2">OUR GOALS</div>
            <div class="row">
                <div class="col-lg-3"></div>
                <div class="col-lg-6 font-size-18 align-left">To build a large-scale collaborative research resource with data from over 1.5 million women of different racial/ethnic backgrounds participating in prospective cohort studies or trials to:</div>
                <div class="col-lg-3"></div>
            </div>
            <br>
            <div class="row">
                <div class="col-lg-3"></div>
                <div class="col-lg-6 font-size-18 align-left mb-3">
                    <ul>
                        <li>Develop comprehensive breast cancer risk prediction models for precision prevention in diverse populations</li>
                        <li>Validate newly developed models in integrated health care systems or breast cancer screening trials</li>
                    </ul>
                </div>
                <div class="col-lg-3"></div>
            </div>
        </div>
        <div class="ternary-bg">
            <div class="container align-left confluence-info font-family-montserrat">
            <div>The BCRPP is funded by the US National Cancer Institute (NCI) grant number <a href="https://maps.cancer.gov/overview/DCCPSGrants/abstract.jsp?applId=10263893&term=CA249866">1U01CA249866-01</a> and the NCI Intramural Research Funds. BCRPP is coordinated by the Harvard T.H. Chan School of Public Health and the Division of Cancer Epidemiology and Genetics (DCEG) of NCI, in collaboration with the NCI Cohort Consortium.</div>
            </div>
        </div>
    `;
  document.getElementById("confluenceDiv").innerHTML = template;
};

export const infoDeckAfterLoggedIn = async () => {
  const studyDescription = await getFileInfo(904897189551); //new: 904897189551
  let template = "";
  template += `
        <div class="secondary-bg padding-bottom-1rem">
            <div class="confluence-banner">
                <div class="banner-logo">
                    <div class="banner-overlay-text row justify-content-center text-center">
                        <div class="col-md-12">
                            <h1 class="banner-overlay-h1">The Breast Cancer Risk Prediction Project (BCRPP)</h1>
                            <div class="banner-overlay-line"></div>
                            <h2 class="banner-overlay-h3" style="font-size:1.7vw;"> Building an integrated multi-ethnic breast cancer risk prediction model</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container align-middle text-center" style="margin-top: 70px;">
                <div class="card-deck" id="infoDeck" style="min-height: 200px;">`;
  if (studyDescription)
    template += cardContents({
      header: "Study Description",
      button: "Study Description",
      href: "#about/description",
      icon: "fa-file-alt",
      explanation: "View descriptions of participating studies.",
    });
  template += cardContents({
    header: "Data Dictionary",
    button: "Data Dictionary",
    href: "#data_exploration/dictionary",
    icon: "fa-database",
    explanation: "View variables from participating studies.",
  });
  template += cardContents({
    header: "Explore Data",
    button: "Explore Data",
    href: "#data_exploration/summary",
    icon: "fa-chart-bar",
    explanation: "Explore summary-level data to plan analyses.",
  });
  template += cardContents({
    header: "Data Access",
    button: "Data Access",
    href: "#data_access/overview",
    icon: "fa-handshake",
    explanation: "View procedures for accessing data.",
  });
  template += `</div>
            </div>
        </div>
        <div class="secondary-bg inverse-triangle"></div>
        <div class="container align-center">
            <div class="font-size-28 font-bold font-family-montserrat our-goals mt-3 mb-2">OUR GOALS</div>
            <div class="row">
                <div class="col-lg-3"></div>
                <div class="col-lg-6 font-size-18 align-left">To build a large-scale collaborative research resource with data from over 1.5 million women of different racial/ethnic backgrounds participating in prospective cohort studies or trials to:</div>
                <div class="col-lg-3"></div>
            </div>
            <br>
            <div class="row">
                <div class="col-lg-3"></div>
                <div class="col-lg-6 font-size-18 align-left mb-3">
                    <ul>
                        <li>Develop comprehensive breast cancer risk prediction models for precision prevention in diverse populations</li>
                        <li>Validate newly developed models in integrated health care systems or breast cancer screening trials</li>
                    </ul>
                </div>
                <div class="col-lg-3"></div>
            </div>
        </div>
        <div class="ternary-bg">
            <div class="container align-left confluence-info font-family-montserrat">
            <div>The BCRPP is funded by the US National Cancer Institute (NCI) grant number <a href="https://maps.cancer.gov/overview/DCCPSGrants/abstract.jsp?applId=10263893&term=CA249866">1U01CA249866-01</a> and the NCI Intramural Research Funds. BCRPP is coordinated by the Harvard T.H. Chan School of Public Health and the Division of Cancer Epidemiology and Genetics (DCEG) of NCI, in collaboration with the NCI Cohort Consortium.</div>
            </div>
        </div>
    `;
  document.getElementById("confluenceDiv").innerHTML = template;
};

const cardContents = (obj) => {
  return `
        <div class="col-xl card confluence-cards" style="min-width:225px">
            <div class="primary-bg rounded-circle" style="margin-top: -40px; padding: 10px;">
                <i class="fas ${obj.icon} fa-2x icon-padding font-white"></i>
            </div>
            <div class="card-body">
                <div class="card-title" style="color: #333B4D">
                    <div class="font-size-28"><b>${obj.header}</b></div>
                </div>
                <p class="text-secondary card-text font-size-14">
                    ${obj.explanation}
                </p>
            </div>

            <div class="white-bg border-top-0 card-footer" style="width: 100%;">
                <a class="stretched-link font-white my-2 border border-0 font-bold btn primary-bg" style="width: 90%;" href="${obj.href}" style="text-decoration: none;">${obj.button}</a>
            </div>
        </div>
        `;
};

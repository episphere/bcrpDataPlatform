export const confluenceContactPage = () => {
  const template = `
        <div class="general-bg padding-bottom-1rem">
            <div class="body-min-height">
                <div class="main-summary-row">
                    <div class="align-left">
                         <h1 class="page-header">DACC Members</h1>
                    </div>
                </div>
                <div class="main-summary-row confluence-resources white-bg div-border font-size-18">
                    <div class="col">
                        <span>For questions about the Breast Cancer Risk Prediction Project</span></br>
                        <span>send mail to: Pete Kraft at </strong> <a href="">kraftp2@nih.gov</a></span></br>
                        </br>
                        <div class="row">
                            <div class="col">
                                <table class="table table-bordered table-responsive w-100 d-block d-md-table">
                                    <thead>
                                        <tr><th>Member</th><th>Cohort</th><th>Affiliation</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Pete Kraft</td>
                                            <td>PLCO</td>
                                            <td>Division of Cancer Epidemiology and Genetics, USA</td>
                                        </tr>
                                        <tr>
                                            <td>Montserrat Garcia-Closas</td>
                                            <td>BGS</td>
                                            <td>The Institute of Cancer Research, London</td>
                                        </tr>
                                        <tr>
                                            <td>Jeanine Genkinger</td>
                                            <td>BCFR</td>
                                            <td>Columbia University, USA</td>
                                        </tr>
                                        <tr>
                                            <td>Julie Palmer</td>
                                            <td>BWHS</td>
                                            <td>Boston University, USA</td>
                                        </tr>
                                        <tr>
                                            <td>Matt Barnet</td>
                                            <td>CARET</td>
                                            <td>Fred Hutch, USA</td>
                                        </tr>
                                        <tr>
                                            <td>Kala Visvanathan</td>
                                            <td>CLUE-II</td>
                                            <td>Johns Hopkins University, USA</td>
                                        </tr>
                                        <tr>
                                            <td>Mia Gaudet</td>
                                            <td>Connect</td>
                                            <td>Division of Cancer Epidemiology and Genetics, USA</td>
                                        </tr>
                                        <tr>
                                            <td>Lauren Teras</td>
                                            <td>CPS-3</td>
                                            <td>American Cancer Society, USA</td>
                                        </tr>
                                        <tr>
                                            <td>Thomas Rohan</td>
                                            <td>CSDLH</td>
                                            <td>Albert Eisten College of Medicine, USA</td>
                                        </tr>
                                        <tr>
                                            <td>Jim Lacey</td>
                                            <td>CTS</td>
                                            <td>City of Hope, USA</td>
                                        </tr>
                                        <tr>
                                            <td>Rudolf Kaaks</td>
                                            <td>EPIC</td>
                                            <td>German Cancer Research Center, Germanyh</td>
                                        </tr>
                                        <tr>
                                            <td>Archie Campbell</td>
                                            <td>GS</td>
                                            <td>University of Edinburgh, UK</td>
                                        </tr>
                                        <tr>
                                            <td>Renee Fortner</td>
                                            <td>JANUS</td>
                                            <td>German Cancer Research Center, Germany</td>
                                        </tr>
                                        <tr>
                                            <td>Roger Milne</td>
                                            <td>MCCS</td>
                                            <td>Cancer Council Victoria, USA</td>
                                        </tr>
                                        <tr>
                                            <td>Chris Haiman</td>
                                            <td>MEC</td>
                                            <td>University of South California, USA</td>
                                        </tr>
                                        <tr>
                                            <td>Celine Vachon</td>
                                            <td>MMHS</td>
                                            <td>Mayo Clinic, USA</td>
                                        </tr>
                                        <tr>
                                            <td>Heather Eliasson</td>
                                            <td>NHS, NHS2</td>
                                            <td>Harvard T.H. Chan School of Public Health, USA</td>
                                        </tr>
                                        <tr>
                                            <td>Yu Chen</td>
                                            <td>NYUWHS</td>
                                            <td>NYU Langone Health, USA</td>
                                        </tr>
                                        <tr>
                                            <td>Katie O'Brien</td>
                                            <td>SISTER</td>
                                            <td>National Institute of Environmental Health Sciences, USA</td>
                                        </tr>
                                        <tr>
                                            <td>Ylva Lagerros</td>
                                            <td>SNM</td>
                                            <td>Karolinska Institutet, Sweden</td>
                                        </tr>
                                        <tr>
                                            <td>Emily White</td>
                                            <td>VITAL</td>
                                            <td>Fred Hutchinson Cancer Research Center, USA</td>
                                        </tr>
                                        <tr>
                                            <td>Garnet Anderson</td>
                                            <td>WHI</td>
                                            <td>Fred Hutchinson Cancer Research Center, USA</td>
                                        </tr>
                                        <tr>
                                            <td>I-min Lee</td>
                                            <td>WHS</td>
                                            <td>Harvard T.H. Chan School of Public Health, USA</td>
                                        </tr>
                                        <tr>
                                            <td>Sven Sandin</td>
                                            <td>WLH</td>
                                            <td>Karolinska Institutet, Sweden</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
  document.getElementById("overview").innerHTML = template;
};

import { getFolderItems, filterConsortiums, getCollaboration, checkDataSubmissionPermissionLevel, applicationURLs } from "../shared.js"

export const uploadInStudy = async (id) => {
    return `
        <div class="modal fade" id="${id}" data-bs-keyboard="false" data-bs-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="${id}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header allow-overflow">
                        <h5 id="${id}" class="modal-title">Submit data</h5>
                        <button type="button" title="Close" class="btn-close modal-close-btn" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form id="uploadStudyForm" method="POST">
                        <div class="modal-body allow-overflow">
                            <div class="form-group">
                                <label for="selectConsortiaUIS">Select Study</label> <span class="required">*</span>
                                <select class="form-control" name="selectedConsortia" id="selectConsortiaUIS" required aria-required="true">
                                    <option value="">-- Select study --</option>
                                    ${await createConsortiaOptions()}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Create new folder? <span class="required">*</span>
                                    <div class="form-check form-check-inline">
                                        <label class="form-check-label">
                                            <input class="form-check-input" type="radio" required aria-required="true" name="createStudyRadio" value="yes">Yes
                                        </label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <label class="form-check-label">
                                            <input class="form-check-input" type="radio" required aria-required="true" name="createStudyRadio" value="no">No
                                        </label>
                                    </div>
                                </label>
                            </div>
                            <div id="studyFormElements"></div>
                            <div id="uploadErrorReport" role="alert"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" title="Submit" class="btn btn-light" id="submitBtn">${location.origin.match(applicationURLs.local) || location.origin.match(applicationURLs.dev) ? 'run QAQC' : 'Submit'}</button>
                            <button type="button" title="Close" class="btn btn-dark" data-bs-dismiss="modal">Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
};

export const createProjectModal = () => {
    return `
        <div class="modal fade" id="createProjectModal" data-bs-keyboard="false" data-bs-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="createProjectModal">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header allow-overflow">
                        <strong><i class="fas fa-project-diagram"></i> Create project</strong>
                        <button type="button" title="Close" class="btn-close modal-close-btn" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body allow-overflow" id="createProjectModalBody"></div>
                </div>
            </div>
        </div>
    `;
};

export const fileVersionsModal = () => {
    return `
        <div class="modal fade" id="modalFileVersions" data-bs-keyboard="false" data-bs-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="modalFileVersions">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header allow-overflow" id="modalFVHeader"></div>
                    <div class="modal-body allow-overflow" id="modalFVBody"></div>
                    <div class="modal-footer">
                        <button type="button" title="Close" class="btn btn-dark" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const createConsortiaOptions = async () => {
    let template = ``;
    const response = await getFolderItems('145996351913'); //Should be 0 if users given access to just folder in studies
    const array = filterConsortiums(response.entries);
    
    for (let consortia of array) {
        const bool = checkDataSubmissionPermissionLevel(await getCollaboration(consortia.id, `${consortia.type}s`), JSON.parse(localStorage.parms).login);
        if (bool === true) template += `<option value="${consortia.id}">${consortia.name}</option>`;
    }
    
    return template;
};
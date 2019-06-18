export function template() {

    const data_summary = JSON.parse(localStorage.data_summary);
    let template = '';
    template += '<div class="row data-submission"><ul class="ul-list-style">';
    for(let consortia in data_summary){
        let type = data_summary[consortia].type;
        const studyEntries = data_summary[consortia].studyEntries;
        let liClass = type === 'folder' ? 'collapsible' : '';
        let faClass = type === 'folder' ? 'fas fa-folder' : 'fas fa-file';
        let expandClass = type === 'folder' ? 'fas fa-plus' : '';
        template += `<li class="${liClass}"><i class="${faClass}"></i> ${consortia} <i class="${expandClass}"></i></li>`
        if(type === 'folder'){
            template += '<ul class="ul-list-style content">'
            for(let study in studyEntries){
                type = studyEntries[study].type;
                liClass = type === 'folder' ? 'collapsible' : '';
                faClass = type === 'folder' ? 'fas fa-folder' : 'fas fa-file';
                expandClass = type === 'folder' ? 'fas fa-plus' : '';
                template += `<li class="${liClass}"><i class="${faClass}"></i> ${study} <i class="${expandClass}"></i></li>`
                if(type === 'folder'){
                    const dataEntries = studyEntries[study].dataEntries;
                    template += '<ul class="ul-list-style content">'
                    for(let data in dataEntries){
                        type = dataEntries[data].type;
                        liClass = type === 'folder' ? 'collapsible' : '';
                        faClass = type === 'folder' ? 'fas fa-folder' : 'fas fa-file';
                        expandClass = type === 'folder' ? 'fas fa-plus' : '';
                        template += `<li class="${liClass}"><i class="${faClass}"></i> ${data} <i class="${expandClass}"></i></li>`
                        if(type === 'folder'){
                            const fileEntries = dataEntries[data].fileEntries;
                            template += '<ul class="ul-list-style content">'
                            for(let file in fileEntries){
                                type = fileEntries[file].type;
                                liClass = type === 'folder' ? 'collapsible' : '';
                                faClass = type === 'folder' ? 'fas fa-folder' : 'fas fa-file';
                                expandClass = type === 'folder' ? 'fas fa-plus' : '';
                                template += `<li class="${liClass}"><i class="${faClass}"></i> ${file} <i class="${expandClass}"></i></li>`
                            }
                            template += '</ul>'
                        }
                    }
                    template += '</ul>'
                }
            }
            template += '</ul>'
        }
    }
    template += '</ul></div>'
    return template;
};

export const dataSubmission = () => {
    let collapsible = document.getElementsByClassName('collapsible');
    Array.from(collapsible).forEach(element => {
        element.addEventListener('click', function() {
            this.classList.toggle('.active');
            var content = this.nextElementSibling;
            if (content.style.maxHeight){
                content.style.maxHeight = null;
                this.getElementsByClassName('fa-minus')[0].classList.add('fa-plus');
                this.getElementsByClassName('fa-minus')[0].classList.remove('fa-minus');
            } else {
                this.getElementsByClassName('fa-plus')[0].classList.add('fa-minus');
                this.getElementsByClassName('fa-plus')[0].classList.remove('fa-plus');
                // content.style.maxHeight = content.scrollHeight + "px";
                content.style.maxHeight = "1000px";
            } 
        })
    });
}

class SearchPageLogic {
    constructor() {
        this.input = document.getElementById('search_input')
        this.searchBtn = document.getElementById('search_button')

        this.sportsSection = document.getElementById('sports')
        this.typesSection = document.getElementById('types')

        this.allSportsBtn = document.getElementById('all_sports')
        this.allTypesBtn = document.getElementById('all_types')

        this.allSportsAreSet = true
        this.allTypesAreSet = true

        this.languageSelect = document.getElementById('language_select')
        this.projectSelect = document.getElementById('project_select')
        this.projectTypeSelect = document.getElementById('project_type_select')

        this.sportsIDs = []
        this.typesIDs = []

        this.resources = []
        this.results = document.getElementById('results')

        this.handle()
    }

    handle() {
        this.addEventListeners()
        this.setAllSports()
        this.setAllTypes()
    }

    showResults() {
        console.log(this.resources)
        for (let i = 0; i < this.resources.length; i++) {
            if (i === 0) {
                this.results.appendChild(this.createSportResultsElement(this.resources[i]))
                this.results.appendChild(this.createTypeResultsElement(this.resources[i]))
            }
            else{
                console.log(i)
                if(this.resources[i-1].sport.name !== this.resources[i].sport.name){
                    this.results.appendChild(this.createSportResultsElement(this.resources[i]))
                }
                if(this.resources[i-1].type.name !== this.resources[i].type.name){
                    this.results.appendChild(this.createTypeResultsElement(this.resources[i]))
                }
            }
            this.results.appendChild(this.createResourceElement(this.resources[i]))
        }
    }

    clearResults(){
        this.results.innerHTML = ''
    }

    createSportResultsElement(source) {
        const resultBlock = document.createElement('div');
        resultBlock.classList.add('results_type')
        resultBlock.textContent = source.sport.name

        return resultBlock
    }

    createTypeResultsElement(source) {
        const resultBlock = document.createElement('div');
        resultBlock.classList.add('results_type')
        resultBlock.textContent = source.type.name
        return resultBlock
    }

    createResourceElement(source) {
        const resultBlock = document.createElement('div');
        resultBlock.classList.add('result')
        const imagesSection = document.createElement('section');
        source.images.forEach(i => {
            const img = document.createElement('img');
            img.classList.add('logo')
            img.src = 'https://www.livesport.cz/res/image/data/' + i.path
            img.alt = 'img'
            imagesSection.appendChild(img)
        })
        const infoSection = document.createElement('section');
        const name = document.createElement('span');
        name.textContent = source.name
        infoSection.appendChild(name)
        resultBlock.appendChild(imagesSection)
        resultBlock.appendChild(infoSection)
        return resultBlock
    }

    async getResources() {
        const link = this.createLink()
        console.log(link)
        try {
            const response = await fetch(link, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            const data = await response.json();
            this.resources = data
            this.sortResources()
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    sortResources() {
        this.resources.sort((a, b) => {
            if (a.sport.id !== b.sport.id) {
                return a.sport.id - b.sport.id
            } else {
                a.type.id !== b.type.id
            }
        })
    }

    createLink() {
        const searchUrl = "https://s.livesport.services/api/v2/search"
        const searchParams = new URLSearchParams({
                'type-ids': this.typesIDs.join(','),
                'project-type-id': this.projectTypeSelect[this.projectTypeSelect.selectedIndex].dataset.score,
                'project-id': this.projectSelect[this.projectSelect.selectedIndex].dataset.score,
                'lang-id': this.languageSelect[this.languageSelect.selectedIndex].dataset.score,
                'q': this.input.value,
                'sport-ids': this.sportsIDs.join(',')
            }
        )
        return searchUrl + '?' + searchParams
    }

    addEventListeners() {

        this.searchBtn.addEventListener('click', async () => {
            await this.getResources()
            this.clearResults()
            this.showResults()
        })

        const sports = Array.from(this.sportsSection.children)
        sports.forEach(s => {
            if (Number(s.dataset.score) !== 0) {
                s.addEventListener('click', () => {
                    this.toggleSport(s)
                })
            } else {
                s.addEventListener('click', () => {
                    this.setAllSports()
                })
            }
        })

        const types = Array.from(this.typesSection.children)
        types.forEach(t => {
            if (Number(t.dataset.score) !== 0) {
                t.addEventListener('click', () => {
                    this.toggleType(t)
                })
            } else {
                t.addEventListener('click', () => {
                    this.setAllTypes()
                })
            }
        })
    }

    toggleSport(s) {
        if (s.classList.contains('active')) {
            this.sportsIDs = this.sportsIDs.filter(i => Number(i) !== Number(s.dataset.score))
            if (this.sportsIDs.length === 0) {
                this.setAllSports()
                return
            }
        } else {
            this.allSportsBtn.classList.remove('active')

            if (this.allSportsAreSet) {
                this.sportsIDs = []
                this.allSportsAreSet = false
            }
            this.sportsIDs.push(Number(s.dataset.score))
        }
        s.classList.toggle('active')
    }

    toggleType(t) {
        if (t.classList.contains('active')) {
            this.typesIDs = this.typesIDs.filter(i => Number(i) !== Number(t.dataset.score))
            if (this.typesIDs.length === 0) {
                this.setAllTypes()
                return
            }
        } else {
            this.allTypesBtn.classList.remove('active')

            if (this.allTypesAreSet) {
                this.typesIDs = []
                this.allTypesAreSet = false
            }
            this.typesIDs.push(Number(t.dataset.score))
        }
        t.classList.toggle('active')
    }

    setAllSports() {
        this.allSportsBtn.classList.add('active')

        const sports = Array.from(this.sportsSection.children)
        this.sportsIDs = []
        sports.forEach(s => {
            if (Number(s.dataset.score) !== 0) {
                this.sportsIDs.push(Number(s.dataset.score))
                s.classList.remove('active')
            }
        })
        this.allSportsAreSet = true
    }

    setAllTypes() {
        this.allTypesBtn.classList.add('active')

        const types = Array.from(this.typesSection.children)
        this.typesIDs = []
        types.forEach(t => {
            if (Number(t.dataset.score) !== 0) {
                this.typesIDs.push(Number(t.dataset.score))
                t.classList.remove('active')

            }
        })
        this.allTypesAreSet = true
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.tabs = new SearchPageLogic()
});
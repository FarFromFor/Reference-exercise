class SearchPageLogic {
    constructor() {
        this.input = document.getElementById('search_input')
        this.searchBtn = document.getElementById('search_button')

        this.selectSection = document.getElementById('select')
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

        this.handle()
    }

    handle() {
        this.addEventListeners()
        this.setAllSports()
        this.setAllTypes()
    }

    createRequest() {
        const searchUrl = "https://s.livesport.services/api/v2/search"
        const searchParams = new URLSearchParams({
                'type-ids': this.typesIDs.join(','),
                'project-type-id': this.projectTypeSelect.selectedIndex + 1,
                'project-id': this.projectSelect.selectedIndex + 1,
                'lang-id': this.languageSelect.selectedIndex + 1,
                'q': this.input.value,
                'sport-ids': this.sportsIDs.join(',')
            }
        )
        console.log(searchUrl + '?' + searchParams)
        return searchUrl + '?' + searchParams
    }

    addEventListeners() {
        this.input.addEventListener('input', () => {

        })

        this.searchBtn.addEventListener('click', () => {

        })

        const selects = Array.from(this.selectSection.children)

        selects.forEach(s => {
            if (s.tagName !== 'LABEL') {
                s.addEventListener('change', () => {
                    console.log(s)
                })
            }
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

        console.log(this.sportsIDs)
        this.createRequest()
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

        console.log(this.typesIDs)
        this.createRequest()
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

        console.log(this.sportsIDs)
        this.createRequest()
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

        console.log(this.typesIDs)
        this.createRequest()
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.tabs = new SearchPageLogic()
});
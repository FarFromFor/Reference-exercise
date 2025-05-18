class SearchPageLogic {
    constructor() {
    }

    handle() {
        this.input = document.getElementById('search_input')
        this.searchBtn = document.getElementById('search_button')

        this.sportsSection = document.getElementById('sports')
        this.typesSection = document.getElementById('types')

        this.allSportsBtn = document.getElementById('all_sports')
        this.allTypesBtn = document.getElementById('all_types')

        this.resultsTitle = document.getElementById('results_title')

        this.loader = document.getElementById('loader')

        this.results = document.getElementById('results')

        this.modal = document.getElementById('modal')
        this.hideMudalBtn = document.getElementById('hide_btn')
        this.alert = document.getElementById('alert')
        this.reloadAlertBtn = document.getElementById('reload_alert_btn')
        this.closeAlertBtn = document.getElementById('close_alert_btn')

        this.errorContent = document.getElementById('error_content')

        this.allSportsAreSet = true
        this.allTypesAreSet = true
        this.languageSelect = document.getElementById('language_select')
        this.projectSelect = document.getElementById('project_select')
        this.projectTypeSelect = document.getElementById('project_type_select')
        this.sportsIDs = []
        this.typesIDs = []
        this.resources = []

        this.projectTypeId = this.projectTypeSelect[this.projectTypeSelect.selectedIndex].dataset.score
        this.projectId = this.projectSelect[this.projectSelect.selectedIndex].dataset.score
        this.langId = this.languageSelect[this.languageSelect.selectedIndex].dataset.score

        this.addEventListeners()
        this.setAllSports()
        this.setAllTypes()
    }

    addEventListeners() {
        this.projectTypeSelect.addEventListener('change', () => {
            this.projectTypeId = this.projectTypeSelect[this.projectTypeSelect.selectedIndex].dataset.score
        })
        this.projectSelect.addEventListener('change', () => {
            this.projectId = this.projectSelect[this.projectSelect.selectedIndex].dataset.score
        })
        this.languageSelect.addEventListener('change', () => {
            this.langId = this.languageSelect[this.languageSelect.selectedIndex].dataset.score
        })

        this.searchBtn.addEventListener('click', async () => {
            this.clearResults()
            this.showLoader()
            await this.getResources()
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

        this.hideMudalBtn.addEventListener('click', () => {
            this.hideModal()
        })

        window.onclick = function (event) {
            if (event.target === this.modal) {
                this.modal.style.display = "none";
            }
        }

        this.closeAlertBtn.addEventListener('click', () => {
            this.closeAlert()
        })

        this.reloadAlertBtn.addEventListener('click', () => {
            this.reloadAlert()
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

    createLink() {
        const searchUrl = "https://s.livesport.services/api/v2/search"
        const searchParams = new URLSearchParams({
                'type-ids': this.typesIDs.join(','),
                'project-type-id': this.projectTypeId,
                'project-id': this.projectId,
                'lang-id': this.langId,
                'q': this.input.value,
                'sport-ids': this.sportsIDs.join(',')
            }
        )
        return searchUrl + '?' + searchParams
    }

    // Fetches resources from URL
    async getResources() {
        const link = this.createLink()
        try {
            const response = await fetch(link, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            const data = await response.json();
            this.resources = data;

            if (!response.ok) {
                throw new Error(data.message);
            } else {
                this.closeAlert()
            }

            this.sortResources()
            this.closeLoader()
        } catch (error) {
            this.errorContent.textContent = error.message
            this.closeLoader()
            this.showAlert()
        }
    }

    // Sort received results before printing
    sortResources() {
        this.resources.sort((a, b) => {
            if (a.sport.id !== b.sport.id) {
                return a.sport.id - b.sport.id;
            } else {
                return a.type.id - b.type.id;
            }
        });
    }

    createSportResultsElement(resourceIndex) {
        const source = this.resources[resourceIndex]
        const resultBlock = document.createElement('div');
        resultBlock.classList.add('sport_results')
        resultBlock.textContent = this.translate(source.sport.name)

        return resultBlock
    }

    createTypeResultsElement(resourceIndex) {
        const source = this.resources[resourceIndex]
        const resultBlock = document.createElement('div');
        resultBlock.classList.add('type_results')
        resultBlock.textContent = this.translate(source.type.name)
        return resultBlock
    }

    createResourceElement(resourceIndex) {
        const source = this.resources[resourceIndex]
        const resultBlock = document.createElement('div');
        resultBlock.classList.add('result')
        resultBlock.dataset.score = resourceIndex
        const imagesSection = document.createElement('section');
        imagesSection.classList.add('result_images')
        source.images.forEach(i => {
            const img = document.createElement('img');
            img.classList.add('logo')
            img.src = 'https://www.livesport.cz/res/image/data/' + i.path
            img.alt = 'img'
            imagesSection.appendChild(img)
        })
        if (source.images.length === 0) {
            const img = document.createElement('img');
            img.classList.add('logo')
            img.src = './placeholder.png'
            img.alt = 'img'
            imagesSection.appendChild(img)
        }
        const infoSection = document.createElement('section');
        const name = document.createElement('span');
        name.textContent = source.name
        infoSection.appendChild(name)
        resultBlock.appendChild(imagesSection)
        resultBlock.appendChild(infoSection)
        resultBlock.addEventListener('click', () => {
            this.showModal(resourceIndex)
        })
        return resultBlock
    }

    // Dummy function for translation
    translate(message) {
        const translations = {
            'Soccer': 'Fotbal',
            'Tennis': 'Tenis',
            'Basketball': 'Basketbal',
            'Hockey': 'Hokej',
            'American football': 'Americký footbal',
            'Baseball': 'Basebal',
            'Rugby Union': 'Rugby',
            'Handball': 'Házená',
            'Floorball': 'Florbal',
            'Team': 'Tým',
            'TournamentTemplate': 'Soutěže',
            'Player': 'Hráči jednotlivci',
            'PlayerInTeam': 'Hráči v týmech',
        }
        return translations[message] ? translations[message] : message
    }

    // Print received resources
    showResults() {
        if (this.resources.length > 0) {
            this.resultsTitle.style.display = 'block'
        } else {
            this.resultsTitle.style.display = 'none'
        }
        for (let i = 0; i < this.resources.length; i++) {
            if (i === 0) {
                this.results.appendChild(this.createSportResultsElement(i))
                this.results.appendChild(this.createTypeResultsElement(i))
            } else {
                if (this.resources[i - 1].sport.name !== this.resources[i].sport.name) {
                    this.results.appendChild(this.createSportResultsElement(i))
                }
                if (this.resources[i - 1].type.name !== this.resources[i].type.name) {
                    this.results.appendChild(this.createTypeResultsElement(i))
                }
            }
            this.results.appendChild(this.createResourceElement(i))
        }
    }

    clearResults() {
        this.results.innerHTML = ''
    }

    showModal(resourceIndex) {
        this.fillModalContent(resourceIndex)
        this.modal.style.display = 'flex'
    }

    hideModal() {
        this.modal.style.display = 'none'
    }

    // Reset modal content with received resource with id = resourceIndex
    fillModalContent(resourceIndex) {
        const photosContainer = this.modal.querySelector(`[id="profile_photos"]`)
        photosContainer.innerHTML = ''
        this.resources[resourceIndex].images.forEach(i => {
            const img = document.createElement('img');
            img.classList.add('profile_image')
            img.src = 'https://www.livesport.cz/res/image/data/' + i.path
            img.alt = 'img'
            photosContainer.appendChild(img)
        })

        if (this.resources[resourceIndex].images.length === 0) {
            const img = document.createElement('img');
            img.classList.add('profile_image')
            img.src = './placeholder.png'
            img.alt = 'img'
            photosContainer.appendChild(img)
        }

        const profileInfo = this.modal.querySelector(`[id="profile_specific_info"]`)
        profileInfo.innerHTML = ''

        if (this.resources[resourceIndex].type.id < 3) {
            if (this.resources[resourceIndex].name) {
                const nameSection = document.createElement('section');
                nameSection.classList.add('specific_info')
                nameSection.textContent = 'Název týmu: ' + this.resources[resourceIndex].name
                profileInfo.appendChild(nameSection)
            }
        } else {
            if (this.resources[resourceIndex].name) {
                let nameSection = document.createElement('section');
                nameSection.classList.add('specific_info')
                nameSection.textContent = 'Jméno: ' + this.resources[resourceIndex].name
                profileInfo.appendChild(nameSection)
            }
            if (this.resources[resourceIndex].gender) {
                let sexSection = document.createElement('section');
                sexSection.classList.add('specific_info')
                sexSection.textContent = 'Pohlaví: ' + this.resources[resourceIndex].gender.name
                profileInfo.appendChild(sexSection)
            }
        }

        if (this.resources[resourceIndex].defaultCountry) {
            const section = document.createElement('section');
            section.classList.add('specific_info')
            section.textContent = 'Stát: ' + this.resources[resourceIndex].defaultCountry.name
            profileInfo.appendChild(section)
        }
        if (this.resources[resourceIndex].url) {
            let urlSection = document.createElement('section');
            urlSection.classList.add('specific_info')
            urlSection.textContent = 'URL: ' + this.resources[resourceIndex].url
            profileInfo.appendChild(urlSection)
        }
    }

    showLoader() {
        this.loader.style.display = 'block'
    }

    closeLoader() {
        this.loader.style.display = 'none'
    }

    showAlert() {
        this.alert.style.display = 'block'
    }

    closeAlert() {
        this.alert.style.display = 'none'
    }

    reloadAlert() {
        this.closeAlert()
        this.searchBtn.click()
    }
}

export default SearchPageLogic;
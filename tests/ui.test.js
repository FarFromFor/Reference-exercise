const {expect} = require('@jest/globals')
const {test} = require('@jest/globals')
import SearchPageLogic from '../SearchPageLogic';

// Inspired by ChatGPT

function createSportBlock(score, active = false) {
    const sportBlock = document.createElement('div');
    sportBlock.dataset.score = score;
    if (active) sportBlock.classList.add('active');
    return sportBlock;
}

test(
    'Sport blocks test',
    () => {

        document.body.innerHTML = `
            <div id="all_sports"></div>
            <div id="sports"></div>
        `;
        const logic = new SearchPageLogic()

        logic.allSportsBtn = document.getElementById('all_sports');
        logic.sportsSection = document.getElementById('sports');
        logic.sportsIDs = [];
        logic.allSportsAreSet = true;

        const all = createSportBlock('0');
        const block1 = createSportBlock('1');
        const block2 = createSportBlock('2');
        logic.sportsSection.appendChild(all);
        logic.sportsSection.appendChild(block1);
        logic.sportsSection.appendChild(block2);

        logic.setAllSports();
        expect(logic.sportsIDs).toEqual([1, 2]);
        expect(logic.allSportsBtn.classList.contains('active')).toBe(true);
        expect(block1.classList.contains('active')).toBe(false);
        expect(block2.classList.contains('active')).toBe(false);


        logic.toggleSport(block1)
        expect(logic.sportsIDs).toEqual([1]);
        expect(logic.allSportsBtn.classList.contains('active')).toBe(false);
        expect(block1.classList.contains('active')).toBe(true);
        expect(block2.classList.contains('active')).toBe(false);


        logic.toggleSport(block1)
        expect(logic.sportsIDs).toEqual([1, 2]);
        expect(logic.allSportsBtn.classList.contains('active')).toBe(true);
        expect(block1.classList.contains('active')).toBe(false);
        expect(block2.classList.contains('active')).toBe(false);

        logic.toggleSport(block2)
        expect(logic.sportsIDs).toEqual([2]);
        expect(logic.allSportsBtn.classList.contains('active')).toBe(false);
        expect(block1.classList.contains('active')).toBe(false);
        expect(block2.classList.contains('active')).toBe(true)

        logic.toggleSport(block2)
        expect(logic.sportsIDs).toEqual([1, 2]);
        expect(logic.allSportsBtn.classList.contains('active')).toBe(true);
        expect(block1.classList.contains('active')).toBe(false);
        expect(block2.classList.contains('active')).toBe(false);

        logic.toggleSport(block1)
        expect(logic.sportsIDs).toEqual([1]);
        logic.toggleSport(block2)
        expect(logic.sportsIDs).toEqual([1, 2]);
        expect(logic.allSportsBtn.classList.contains('active')).toBe(false);
        expect(block1.classList.contains('active')).toBe(true);
        expect(block2.classList.contains('active')).toBe(true);

        logic.setAllSports();
        expect(logic.sportsIDs).toEqual([1, 2]);
        expect(logic.allSportsBtn.classList.contains('active')).toBe(true);
        expect(block1.classList.contains('active')).toBe(false);
        expect(block2.classList.contains('active')).toBe(false);
    }
);

test('Modal test',
    () => {
        document.body.innerHTML = `
        <div id="modal" style="display: none;">
            <section id="profile_photos"></section>
            <section id="profile_info">
                <section id="profile_specific_info"></section>
            </section>
            <section id="hide_btn"></section>
        </div>`;
        const logic = new SearchPageLogic();

        logic.resources = [
            {
                images: [],
                type: {id: 1},
                name: 'Alex'
            }
        ];

        logic.modal = document.getElementById('modal');
        logic.modal = document.getElementById('modal');

        expect(logic.modal.style.display).toBe('none');

        logic.showModal(0);
        expect(logic.modal.style.display).toBe('flex');
        const photosContainer = logic.modal.querySelector('#profile_photos');
        const photos = photosContainer.querySelectorAll('img');
        expect(photos.length).toBeGreaterThan(0);
        expect(photos[0].src).toContain('placeholder.png');

        const infoSection = logic.modal.querySelector('#profile_specific_info');
        expect(infoSection.textContent).toContain('Alex');

        logic.hideModal();
        expect(logic.modal.style.display).toBe('none');
    }
);

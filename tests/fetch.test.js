import {jest} from "@jest/globals";
const {expect} = require('@jest/globals')
const {test} = require('@jest/globals')
import SearchPageLogic from '../SearchPageLogic';

// Inspired by ChatGPT

test(
    'Link creation test',
    () => {
        const logic = new SearchPageLogic()

        logic.input = {value: 'gh'};
        logic.sportsIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        logic.typesIDs = [1, 2, 3, 4]

        logic.projectTypeId = 1
        logic.projectId = 602
        logic.langId = 1
        let expectedUrl = 'https://s.livesport.services/api/v2/search?type-ids=1%2C2%2C3%2C4&project-type-id=1&project-id=602&lang-id=1&q=gh&sport-ids=1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9'
        expect(logic.createLink()).toBe(expectedUrl)

        logic.input = {value: 'gho'};
        logic.sportsIDs = [1]
        logic.typesIDs = [1]
        expectedUrl = "https://s.livesport.services/api/v2/search?type-ids=1&project-type-id=1&project-id=602&lang-id=1&q=gho&sport-ids=1"
        expect(logic.createLink()).toBe(expectedUrl)
    }
);

test(
    'Correct fetch test',
    async () => {
        const logic = new SearchPageLogic()

        logic.input = {value: 'dj'};
        logic.sportsIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        logic.typesIDs = [2, 3]

        logic.projectTypeId = 1
        logic.projectId = 602
        logic.langId = 1

        logic.loader = {style: {display: ''}};
        logic.alert = {style: {display: ''}};
        logic.errorContent = {textContent: ''};
        logic.closeAlert = jest.fn();
        logic.sortResources = jest.fn();


        const response = {data: 'example data'};

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => response,
        });

        await logic.getResources();

        expect(fetch).toHaveBeenCalledWith(logic.createLink(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        expect(logic.resources).toEqual(response);
        expect(logic.closeAlert).toHaveBeenCalled();
        expect(logic.sortResources).toHaveBeenCalled();
        expect(logic.loader.style.display).toBe('none');
    }
);

test(
    'Incorrect request test',
    async () => {
        const logic = new SearchPageLogic()

        logic.input = {value: 'd'};
        logic.sportsIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        logic.typesIDs = [2, 3]

        logic.projectTypeId = 1
        logic.projectId = 602
        logic.langId = 1

        logic.loader = {style: {display: ''}};
        logic.alert = {style: {display: ''}};
        logic.errorContent = {textContent: ''};
        logic.closeAlert = jest.fn();
        logic.sortResources = jest.fn();

        const error = {message: 'One or more values are invalid, see array of errors for details.'};

        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            json: async () => error,
        });

        await logic.getResources();

        expect(fetch).toHaveBeenCalledWith(logic.createLink(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        expect(logic.errorContent.textContent).toBe(error.message);
        expect(logic.alert.style.display).toBe('block');
        expect(logic.loader.style.display).toBe('none');
    }
);
import {Capabilities} from 'selenium-webdriver';

import { expect } from 'chai';

import {Builder, driver, ThenableWebDriver} from 'mocha-webdriver';
//export TS_NODE_COMPILER_OPTIONS='{"lib": ["ES2015"]}';

//TODO napraw sciezke funkcja ze screena ladniejsza
//npx mocha -r ts-node/register testyStrony.ts   do testowania tego na poczatku


describe('testDrugi', function () {
    it('check if all options in select available', async function() {

        this.timeout(20000);

        await driver.get('file:///home/piotr/PRZEDMIOTy/WWW/lab2/.html');

        expect(await driver.find("select[name='Dokad']").getText()).to.include('Warszawa');
        expect(await driver.find("select[name='Dokad']").getText()).to.include('Amsterdam');
        expect(await driver.find("select[name='Dokad']").getText()).to.include('Pcim');
        expect(await driver.find("select[name='Dokad']").getText()).to.include('Kraków');
        expect(await driver.find("select[name='Dokad']").getText()).to.include('Gdańsk');

        expect(await driver.find("select[name='Skad']").getText()).to.include('Warszawa');
        expect(await driver.find("select[name='Skad']").getText()).to.include('Amsterdam');
        expect(await driver.find("select[name='Skad']").getText()).to.include('Pcim');
        expect(await driver.find("select[name='Skad']").getText()).to.include('Kraków');
        expect(await driver.find("select[name='Skad']").getText()).to.include('Gdańsk');

        expect(await driver.find("select[name='Godzina']").getText()).to.include('10:00');
        expect(await driver.find("select[name='Godzina']").getText()).to.include('12:00');
        expect(await driver.find("select[name='Godzina']").getText()).to.include('14:00');
        expect(await driver.find("select[name='Godzina']").getText()).to.include('16:00');
        expect(await driver.find("select[name='Godzina']").getText()).to.include('18:00');
        //await driver.find("input[name='Imie']").sendKeys('Jan')
        //await driver.find('button').doClick();

    });
})

describe('testTrzeci', function () {
    it('check if can click after correct filling example forms and after reset', async function() {

        this.timeout(20000);

        await driver.get('file:///home/piotr/PRZEDMIOTy/WWW/lab2/.html');

        expect(await driver.find("input[value='Wyślij formularz']").getAttribute("disabled") != null);

        await driver.find("input[name='Imie']").sendKeys('Jan');
        await driver.find("input[name='Nazwisko']").sendKeys('Kowalski');
        await driver.find("select[name = 'Skad']").sendKeys('Warszawa');
        await driver.find("select[name = 'Dokad']").sendKeys('Pcim');
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        await driver.find("input[type = 'date']").sendKeys(tomorrow.toString());
        await driver.find("select[name = 'Godzina']").sendKeys('12:00');


        expect(await driver.find("input[value='Wyślij formularz']").getAttribute("disabled") == null);

        await driver.find("input[type='reset']").doClick();
        expect(await driver.find("input[value='Wyślij formularz']").getAttribute("disabled") != null);
    });
})

describe('testCzwarty', function () {
    it('check if partially filled or badly filled forms work', async function() {

        this.timeout(20000);

        await driver.get('file:///home/piotr/PRZEDMIOTy/WWW/lab2/.html');

        await driver.find("input[name='Imie']").sendKeys('Piotr');
        await driver.find("input[name='Nazwisko']").sendKeys('Sotniczuk');
        await driver.find("select[name = 'Skad']").sendKeys('Amsterdam');
        await driver.find("select[name = 'Dokad']").sendKeys('Gdańsk');
        expect(await driver.find("input[value='Wyślij formularz']").getAttribute("disabled") != null);

        await driver.find("input[type = 'date']").sendKeys((Date.now() + 3).toString());
        await driver.find("select[name = 'Godzina']").sendKeys('8:00');

        // Form is OK
        expect(await driver.find("input[value='Wyślij formularz']").getAttribute("disabled") == null);

        // Bad date
        await driver.find("input[type = 'date']").sendKeys((Date.now() - 3).toString());
        expect(await driver.find("input[value='Wyślij formularz']").getAttribute("disabled") != null);
        await driver.find("input[type = 'date']").sendKeys((Date.now() + 3).toString());

        // Destination = Start
        await driver.find("select[name = 'Dokad']").sendKeys('Amsterdam');
        expect(await driver.find("input[value='Wyślij formularz']").getAttribute("disabled") != null);
    });
})

describe('testPiaty', function () {
    it('check if the popup is showing', async function() {

        this.timeout(20000);

        await driver.get('file:///home/piotr/PRZEDMIOTy/WWW/lab2/.html');

        await driver.find("input[name='Imie']").sendKeys('Piotr');
        await driver.find("input[name='Nazwisko']").sendKeys('Sotniczuk');
        await driver.find("select[name = 'Skad']").sendKeys('Amsterdam');
        await driver.find("select[name = 'Dokad']").sendKeys('Gdańsk');
        await driver.find("input[type = 'date']").sendKeys((Date.now() + 3).toString());
        await driver.find("select[name = 'Godzina']").sendKeys('8:00');

        // Form is OK
        expect(await driver.find("input[value='Wyślij formularz']").getAttribute("disabled") == null);

        await driver.find("input[value='Wyślij formularz']").doClick();
        // TODO czemu nie dziala
        //await driver.find("div[class='block']");
    });
})


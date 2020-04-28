import {Capabilities} from 'selenium-webdriver';

import { expect } from 'chai';

import {Builder, driver, ThenableWebDriver} from 'mocha-webdriver';
//export TS_NODE_COMPILER_OPTIONS='{"lib": ["ES2015"]}';
//npx mocha -r ts-node/register testyStrony.ts   do testowania tego na poczatku


describe('testDrugi', function () {

    let driver: ThenableWebDriver = undefined;

    beforeEach(async function () {
        this.timeout(20000);
        driver = new Builder().forBrowser('firefox').build();
        await driver.get('file:///home/piotr/PRZEDMIOTy/WWW/lab2/.html');
    });

    afterEach(async function () {
        await driver.close();
        driver = undefined;
    });

    it('check if all options in select available', async function () {

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
    });

    it('check if can click after correct filling example forms and after reset', async function () {
        expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.false;

        await driver.find("input[name='Imie']").sendKeys('Jan');
        await driver.find("input[name='Nazwisko']").sendKeys('Kowalski');
        await driver.find("select[name = 'Skad']").sendKeys('Warszawa');
        await driver.find("select[name = 'Dokad']").sendKeys('Pcim');
        await driver.find("input[type = 'date']").sendKeys('2021-01-11');
        await driver.find("select[name = 'Godzina']").sendKeys('16:00');

        expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.true;

        await driver.find("input[type='reset']").doClick();
        //TODO bug gdy resetujesz to nadal jest enabled
        //expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.false;
    });

    it('check if partially filled or badly filled forms work', async function () {

        await driver.find("input[name='Imie']").sendKeys('Piotr');
        await driver.find("input[name='Nazwisko']").sendKeys('Sotniczuk');
        await driver.find("select[name ='Skad']").sendKeys('Amsterdam');
        await driver.find("select[name='Dokad']").sendKeys('Gdańsk');
        expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.false;

        await driver.find("input[type='date']").sendKeys('2021-05-25');
        await driver.find("select[name='Godzina']").sendKeys('14:00');

        // Form is OK
        expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.true;

        // Bad date
        await driver.find("input[type = 'date']").sendKeys('2019-02-05');
        expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.false;
        await driver.find("input[type = 'date']").sendKeys('2021-05-25');

        // Destination = Start
        await driver.find("select[name = 'Dokad']").sendKeys('Amsterdam');
        expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.false;
    });

    it('check what the popup is showing', async function () {

        await driver.find("input[name='Imie']").sendKeys('Piotr');
        await driver.find("input[name='Nazwisko']").sendKeys('Sotniczuk');
        await driver.find("select[name = 'Skad']").sendKeys('Amsterdam');
        await driver.find("select[name = 'Dokad']").sendKeys('Gdańsk');
        await driver.find("input[type = 'date']").sendKeys('2023-02-13');
        await driver.find("select[name = 'Godzina']").sendKeys('10:00');

        // Form is OK
        expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.true;

        await driver.find("input[value='Wyślij formularz']").doClick();

        // TODO Sometimes Shows correctly sometimes is 12:00 instead
        expect(await driver.find("div[class='block_text']").getAttribute("innerHTML")).
        to.equal("Piotr Sotniczuk\nAmsterdam Gdańsk\n2023-02-13 10:00\n");
    });
});

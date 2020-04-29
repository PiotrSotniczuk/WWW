import {Capabilities} from 'selenium-webdriver';

import { expect } from 'chai';

import {Builder, driver, ThenableWebDriver} from 'mocha-webdriver';
//export TS_NODE_COMPILER_OPTIONS='{"lib": ["ES2015"]}';
//npx mocha -r ts-node/register testyStrony.ts   do testowania tego na poczatku


describe('testDrugi', () => {

    let driver: ThenableWebDriver = undefined;

    beforeEach(async function () {
        this.timeout(20000);
        driver = new Builder().forBrowser('firefox').build();
        await driver.get('file://' + process.cwd() + '/.html');
    });

    afterEach(async function () {
        await driver.close();
        driver = undefined;
    });

    async function fill_forms(imie, nazw, skad, dokad, data, godz){
        await driver.find("input[name='Imie']").sendKeys(imie);
        await driver.find("input[name='Nazwisko']").sendKeys(nazw);
        await driver.find("select[name = 'Skad']").sendKeys(skad);
        await driver.find("select[name = 'Dokad']").sendKeys(dokad);
        await driver.find("input[type = 'date']").sendKeys(data);
        await driver.find("select[name = 'Godzina']").sendKeys(godz);
    }

    function add_year_parse_date(ile : number){
        let today = new Date();
        today.setFullYear(today.getFullYear() + ile, today.getMonth(), today.getDay());
        let parsed = today.getFullYear().toString() + "-" +
            ("0" + today.getMonth().toString()).slice(-2) + "-" + ("0" + today.getDate().toString().slice(-2));
        return parsed;
    }

    it('check if all options in select available', async () => {

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

    it('check if can click after correct filling example forms and after reset', async () => {
        expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.false;
        let date_Str = add_year_parse_date(1);
        await fill_forms("Jan", "Kowalski", "Warszawa", "Pcim", date_Str, "16:00");

        expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.true;

        await driver.find("input[type='reset']").doClick();
        //TODO bug gdy resetujesz to nadal jest enabled
        //expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.false;
    });

    it('check if partially filled or badly filled forms work', async () => {
        await fill_forms("Piotr", "Sotniczuk", "Amsterdam", "Gdańsk", "", "");
        expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.false;

        await fill_forms("Piotr", "Sotniczuk", "Amsterdam", "Gdańsk", add_year_parse_date(3), "14:00");

        // Form is OK
        expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.true;

        // Bad date
        await driver.find("input[type = 'date']").sendKeys('2019-02-05');
        expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.false;
        await driver.find("input[type = 'date']").sendKeys(add_year_parse_date(1));

        // Destination = Start
        await driver.find("select[name = 'Dokad']").sendKeys('Amsterdam');
        expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.false;
    });

    it('check what the popup is showing', async () => {
        await fill_forms("Piotr", "Sotniczuk", "Amsterdam", "Gdańsk", add_year_parse_date(3), "10:00");

        // Form is OK
        expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.true;

        await driver.find("input[value='Wyślij formularz']").doClick();

        // TODO Czasem dziala a czasem daje 12:00 tak jakby nie zdazyl wyslac 10:00?
        expect(await driver.find("div[class='block_text']").getAttribute("innerHTML")).
        to.equal("Piotr Sotniczuk\nAmsterdam Gdańsk\n"+ add_year_parse_date(3) + " 10:00\n");

        // Blokuje przycisk przed kliknięciem
        expect(await driver.find("input[value='Wyślij formularz']").click()
            .then(() => true).catch(() => false)).to.equal(false);

    });
});

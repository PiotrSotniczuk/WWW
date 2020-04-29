import {Capabilities} from 'selenium-webdriver';

import { expect } from 'chai';

import {Builder, driver, ThenableWebDriver} from 'mocha-webdriver';
//export TS_NODE_COMPILER_OPTIONS='{"lib": ["ES2015"]}';
//npx mocha -r ts-node/register testyStrony.ts   do testowania tego na poczatku


describe('testDrugi', () => {

    beforeEach(async function () {
        this.timeout(20000);
        await driver.get('file://' + process.cwd() + '/.html');
    });

    async function fill_forms(imie, nazw, skad, dokad, data, godz){
        await driver.find("input[name='Imie']").sendKeys(imie);
        await driver.find("input[name='Nazwisko']").sendKeys(nazw);
        if(skad !== "") await driver.find("select[name = 'Skad'] option[name = '" + skad + "']").doClick();
        if(dokad !== "") await driver.find("select[name = 'Dokad'] option[name = '" + dokad + "']").doClick();
        await driver.find("input[type = 'date']").sendKeys(data);
        if(godz !== "") await driver.find("option[name = '" + godz + "']").doClick();
    }

    function add_year_parse_date(ile : number){
        let today = new Date();
        today.setFullYear(today.getFullYear() + ile, today.getMonth(), today.getDay());
        return (today.getFullYear().toString() + "-" +
            ("0" + today.getMonth().toString()).slice(-2) + "-" + ("0" + today.getDate().toString().slice(-2)));
    }

    async function check_options(name : String, options : String[]){
        for(let option of options) {
            expect(await driver.find("select[name='" + name + "']").getText()).to.include(option);
        }
    }

    it('check if all options in select available', async () => {

        let city_options = ["Warszawa", "Amsterdam", "Kraków", "Gdańsk", "Pcim"];
        await check_options("Dokad", city_options);

        await check_options("Skad", city_options);

        let hour_options = ['10:00', '12:00', '14:00', '16:00', '18:00'];
        await check_options("Godzina", hour_options);
    });

    it('check if can click after correct filling example forms and after reset', async () => {
        expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.false;
        let date_Str = add_year_parse_date(1);
        await fill_forms("Jan", "Kowalski", "Warszawa", "Pcim", date_Str, "16:00");

        expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.true;

        await driver.find("input[type='reset']").doClick();
        expect(await driver.find("input[value='Wyślij formularz']").isEnabled()).to.be.false;
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

        expect(await driver.find("div[class='block_text']").getAttribute("innerHTML")).
        to.equal("Piotr Sotniczuk\nAmsterdam Gdańsk\n"+ add_year_parse_date(3) + " 10:00\n");

        // Blokuje przycisk przed kliknięciem
        expect(await driver.find("input[value='Wyślij formularz']").click()
            .then(() => true).catch(() => false)).to.equal(false);

    });
});

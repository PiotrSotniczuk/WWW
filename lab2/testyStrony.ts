import {Builder, Capabilities} from 'selenium-webdriver';

import { expect } from 'chai';

import { driver } from 'mocha-webdriver';

//TODO napraw sciezke funkcja ze screena ladniejsza
//npx mocha -r ts-node/register testyStrony.ts   do testowania tego na poczatku

/*
describe('testDrugi', function () {

    it('should say something', async function() {

        this.timeout(20000);

        await driver.get('file://[ścieżka.do.pliku.ze.stroną].html');


        expect(await driver.find('[selektor.opisu.miasta.docelowego]').getText()).to.include('[miasto.docelowe]');

        await driver.find('input[type=text]').sendKeys('Jan Woreczko');

        await driver.find('button').doClick();

    });

})*/

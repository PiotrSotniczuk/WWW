import { expect } from 'chai';
import { driver } from "mocha-webdriver";
import { Builder, ThenableWebDriver } from "mocha-webdriver";


var webdriver = require('selenium-webdriver');

const path = 'http://localhost:1500/';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('test wysylania wiadomosci', function () {
    // baza danych ma byc pusta
    beforeEach(async function() {
        this.timeout(10000);
        await driver.get(path);
    });

    it('logowanie, pobieranie listy, wyslanie, przejrzenie wynikow', async () => {
        await driver.find("input[name='nick']").sendKeys('user1');
        await driver.find("input[name='password']").sendKeys('user1');
        await driver.find("input[value='Login']").click();

        // pobieram liste
        await sleep(100);
        await driver.find("input[type='radio']").click();
        expect(await driver.find("input[value='Otwórz']").
        isEnabled()).to.be.true;  
        await driver.find("input[value='Otwórz']").click(); 
        
        // pobieram quiz
        let okno = await driver.find("input[id='odpowiedz']");
        let dalej = await driver.find("input[value='Dalej']");
        for(let i=0; i<5; i++){
            await okno.sendKeys('4');
            await dalej.click();
        }
        await okno.sendKeys('4');
        // now i can send
        expect(await driver.find("input[value='Skończ']").
        isEnabled()).to.be.true; 
        await driver.find("input[value='Skończ']").click();

        // jestem znowu na startowej wybieram quiz do odczytu
        await sleep(100);
        await driver.find("input[type='radio']").click();
        await driver.find("input[value='Otwórz']").click();

        // pobieram odpowiedzi od serwera
        await sleep(100);
        await driver.find("input[value='Zobacz Odpowiedzi']").click();
        // patrze czy widze pytanie wraz z odpowiedzią
        expect(await driver.find("div[id='pytanie']")
        .getAttribute("innerHTML")).to.equal('3 + 0 = 3'); 
          await driver.find("a[href='/logout']").click();
        
    });        
});

describe('test zrobienia dwa razy quizu', function () {
    // baza danych ma byc pusta
    beforeEach(async function() {
        this.timeout(15000);
        await driver.get(path);
    });

    it('wyslanie quizu z dwoch kart', async () => {
        let driver2 = new Builder().forBrowser('firefox').build();

        await driver.find("input[name='nick']").sendKeys('user2');
        await driver.find("input[name='password']").sendKeys('user2');
        await driver.find("input[value='Login']").click();

        // pobieram liste
        await sleep(100);
        await driver.find("input[type='radio']").click();
        await driver.find("input[value='Otwórz']").click(); 
        
        // pobieram quiz
        let okno = await driver.find("input[id='odpowiedz']");
        let dalej = await driver.find("input[value='Dalej']");
        for(let i=0; i<5; i++){
            await okno.sendKeys('4');
            await dalej.click();
        }
        await okno.sendKeys('4');
        // teraz wypelnie w drugim oknie

        // logowanie drugie okno
        await driver2.get(path);
        await driver2.find("input[name='nick']").sendKeys('user2');
        await driver2.find("input[name='password']").sendKeys('user2');
        await driver2.find("input[value='Login']").click();

        // pobieram liste
        await sleep(100);
        await driver2.find("input[type='radio']").click();
        await driver2.find("input[value='Otwórz']").click(); 
        
        // pobieram quiz
        let okno2 = await driver2.find("input[id='odpowiedz']");
        let dalej2 = await driver2.find("input[value='Dalej']");
        for(let i=0; i<5; i++){
            await okno2.sendKeys('4');
            await dalej2.click();
        }
        await okno2.sendKeys('4');

        // na obu oknach jestem gotowy do wyslania wysylam z pierwszej
        await driver.find("input[value='Skończ']").click();

        // wysylam z drugiego
        await sleep(100);
        await driver2.find("input[value='Skończ']").click();

        expect(await driver2.switchTo().alert().getText())
        .to.equal("Quiz is already finished");
        await driver2.switchTo().alert().accept();
        await driver.find("a[href='/logout']").click();
        driver2.quit();
    });        
    
});

describe('wylogowanie z kart po zmianie hasla', function () {
    // baza danych ma byc pusta
    beforeEach(async function() {
        this.timeout(10000);
        await driver.get(path);
    });

    it('zalogowanie na 2 kartach', async () => {
       
        // logowanie
        await driver.find("input[name='nick']").sendKeys('user2');
        await driver.find("input[name='password']").sendKeys('user2');
        await driver.find("input[value='Login']").click();

        // zapis i usuwanie cookies
        let cookie = await driver.manage().getCookie('connect.sid');
        await driver.manage().deleteAllCookies();

        // drugie logowanie
        await driver.get(path);
        await driver.find("input[name='nick']").sendKeys('user2');
        await driver.find("input[name='password']").sendKeys('user2');
        await driver.find("input[value='Login']").click();

        // zmiana hasla
        await driver.find("input[name='oldPass']").sendKeys('USER@');
        await driver.find("input[name='newPass']").sendKeys('USER@');
        await driver.find("input[value='Zmień']").click();
        await driver.manage().deleteAllCookies();
        
        // load cookie
        await driver.manage().addCookie({ name: 'connect.sid', value: cookie.value });
        await driver.get(path);

        // check if logged
        expect(await driver.find("input[value='Login']")).to.exist;


    });
    
});
import {odnowGlob} from "./main.js";

export function appendSubmit(father : HTMLElement, value : string) : HTMLInputElement{
    let submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('value', value);
    father.appendChild(submit);
    return submit;
}


function otworzBaze() {
    if (!indexedDB) {
        console.log("nie dziala indexedDB");
    } else {
        console.log("dziala DB");
    }

    let request = indexedDB.open("QuizBazaDanych", 1);

    request.onupgradeneeded = function (e) {
        let db = request.result,
            store = db.createObjectStore("WynikStore",
                {autoIncrement: true}),
            index = store.createIndex("punkty", "punkty", {unique: false});
        console.log("odpalilo sie upgradde");
    }

    request.onerror = function (e: ErrorEvent) {
        console.log("Opening DB ended with error");
    }
    return request;
}

//https://www.youtube.com/watch?v=g4U5WRzHitM&fbclid=IwAR3UTQZN05nGnOdTjst04W2jsYDQjOA9JKMxPa22kE5VFH7AD4YBboULS84
export function addWynik(_punkty : number, _nick : string, _statystyki, _odpowiedzi) {

    let db, transaction, store, index;
    let request = otworzBaze();
    request.onsuccess = function (e) {
        db = request.result;
        transaction = db.transaction("WynikStore", "readwrite");
        store = transaction.objectStore("WynikStore");
        index = store.index("punkty");
        db.onerror = function () {
            console.log("ERROR in req.onsuccess");
        }

        store.put({punkty: _punkty, nick: _nick, odpowiedzi: _odpowiedzi, statystyki: _statystyki});
        console.log("dodaje");
        transaction.oncomplete = function () {
            console.log("zamykam BD");
            db.close();
            odnowGlob();
        }
    }
}

// https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/index
export function wyswietlRanking(lista) {
    let request = otworzBaze();
    request.onsuccess = function (e) {
        let db, transaction, store, index;
        db = request.result;

        transaction = db.transaction("WynikStore", 'readonly');
        store = transaction.objectStore("WynikStore");

        index = store.index("punkty");
        let i = 0;
        lista.innerHTML = "";
        index.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor && i < 10) {

                lista.innerHTML += '<li>' + cursor.value.punkty + 'pkt ' + cursor.value.nick + '</li>';
                cursor.continue();
            } else {
                console.log('Entries all displayed.');
            }
        };
    }
};
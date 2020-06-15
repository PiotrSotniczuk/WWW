import { odnowGlob } from "./main.js";
function otworzBaze() {
    if (!indexedDB) {
        console.log("ERROR: nie dziala indexedDB");
    }
    const request = indexedDB.open("QuizBazaDanych", 1);
    request.onupgradeneeded = () => {
        const db = request.result;
        const store = db.createObjectStore("WynikStore", { autoIncrement: true });
        store.createIndex("punkty", "punkty", { unique: false });
    };
    request.onerror = () => {
        console.log("ERROR: Opening DB ended with error");
    };
    return request;
}
export function zapiszWynik(_punkty, _nick, _statystyki, _odpowiedzi) {
    let db;
    let transaction;
    let store;
    let index;
    const request = otworzBaze();
    request.onsuccess = () => {
        db = request.result;
        transaction = db.transaction("WynikStore", "readwrite");
        store = transaction.objectStore("WynikStore");
        index = store.index("punkty");
        db.onerror = () => {
            console.log("ERROR: in req.onsuccess");
        };
        store.put({ punkty: _punkty, nick: _nick, odpowiedzi: _odpowiedzi, statystyki: _statystyki });
        transaction.oncomplete = () => {
            db.close();
            odnowGlob();
        };
    };
}
export function wyswietlRanking() {
    const elLista = document.getElementById("ranking");
    const request = otworzBaze();
    request.onsuccess = () => {
        let db;
        let transaction;
        let store;
        let index;
        db = request.result;
        transaction = db.transaction("WynikStore", 'readonly');
        store = transaction.objectStore("WynikStore");
        index = store.index("punkty");
        let i = 0;
        elLista.innerHTML = "";
        index.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor && i < 5) {
                i++;
                elLista.innerHTML += '<li>' + i + ". " + cursor.value.punkty + 'pkt ' + cursor.value.nick + '</li>';
                cursor.continue();
            }
        };
    };
}
//# sourceMappingURL=modulDB.js.map
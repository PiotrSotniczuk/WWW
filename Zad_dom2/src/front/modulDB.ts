import {odnowGlob} from "./main.js";

export async function getJSON(url = '') {
	// Default options are marked with *
	const response = await fetch(url, {method: 'GET'});
	return response.json(); // parses JSON response into native JavaScript objects
}

function otworzBaze() {
	if (!indexedDB) {
		console.log("ERROR: nie dziala indexedDB");
	}

	const request = indexedDB.open("QuizBazaDanych", 1);
	// jeśli nie była założona załóż baze
	request.onupgradeneeded = () => {
		const db = request.result;
		const store = db.createObjectStore("WynikStore", {autoIncrement: true});
		store.createIndex("punkty", "punkty", {unique: false});
	}
	request.onerror = () => {
		console.log("ERROR: Opening DB ended with error");
	}
	return request;
}

// zapisuje dane do bazy
// https://www.youtube.com/watch?v=g4U5WRzHitM&fbclid=IwAR3UTQZN05nGnOdTjst04W2jsYDQjOA9JKMxPa22kE5VFH7AD4YBboULS84
export function zapiszWynik(_punkty : number, _nick : string, _statystyki : number[],
                            _odpowiedzi : string[]) : void {
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
		}

		store.put({punkty: _punkty, nick: _nick, odpowiedzi: _odpowiedzi, statystyki: _statystyki});
		transaction.oncomplete = () => {
			db.close();
			odnowGlob();
		}
	}
}

// wypisuje ranking do HTML
// https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/index
export function wyswietlRanking() : void {
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
	}
	getJSON('/quizList').then(result => {
		const elQuizy = document.getElementById("quizy");
		elQuizy.innerHTML = "";
		for(let i=0; i<result.length; i++){
			elQuizy.innerHTML += "<li><a href='/quiz/" + 
			result[i].id +"'>" + result[i].name + "</a></li>"
		}
	}).catch(() => {console.log('error getting list');});
}
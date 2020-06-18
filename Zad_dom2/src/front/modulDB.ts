import {odnowGlob, startujQuiz} from "./main.js";

export async function getJSON(url = '') {
	// Default options are marked with *
	const response = await fetch(url, {method: 'GET'});
	return response.json(); // parses JSON response into native JavaScript objects
}

// zapisuje dane do bazy
export function zapiszWynik(_punkty : number, _nick : string, _statystyki : number[],
                            _odpowiedzi : string[]) : void {
	
}

export function wyswietlListe() : void {
	getJSON('/quizList').then(result => {
		const elQuizy = document.getElementById("quizy");
		elQuizy.innerHTML = "";
		result.forEach((quiz) => {
			console.log(quiz);
			let list : string = "";
			list += quiz.name + 
			" <input type='radio' name='quiz' value='" + quiz.id + "'>";
			if(quiz.ended === null){
				list += "Rozwiąż<br>";
			} else{
				list += "Przejrzyj<br>";
			}
			elQuizy.innerHTML += list;
		});
		elQuizy.innerHTML += "<input type='submit' value='Otwórz'>"
		elQuizy.addEventListener('submit', (event)=>{
			let data : any = new FormData(elQuizy as HTMLFormElement);
			let quiz_id : number;
			for (const entry of data) {
				quiz_id = parseInt(entry[1], 10);
			};
			if(quiz_id === undefined){
				console.log("Select something!!");
			}else{
				startujQuiz(quiz_id);
			}
			event.preventDefault();
		}, false);
		
	}).catch(() => {console.log('error getting list');});
}
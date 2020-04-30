let jsonString: string = `{
    "zadania": [["2 + 3", 5, 5], ["2 -(-24:4)", 8, 20], ["2 * 9", 18, 10], ["4 + 8", 12, 10]]
}`;

type Pyt = string;
type Odp = number;
type Kara = number;
// type Num = string;
type IPytanie = [Pyt, Odp, Kara];
// kacper wodzynski
interface IQuiz {
    zadania: IPytanie[];
}

let quizStructure = JSON.parse(jsonString);

console.log(quizStructure.zadania);





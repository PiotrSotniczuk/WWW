import * as sqlite from 'sqlite3';

export class Question{
    nr : number;
    content : string;
    punish : number;
    answer : number;
    quiz_id : number;

    constructor(nr : number, content : string, punish : number,
    answer : number){
        this.nr = nr;
        this.content = content;
        this.punish = punish;
        this.answer = answer;
    }
}

export class QuizStore {
    baseName: string;

	constructor(baseName : string){
        this.baseName = baseName;
    }
    addQuiz(name : string, id : number) : Promise<void>{
        const db = new sqlite.Database(this.baseName);
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO quizes (id, name)
                VALUES ((?), (?));`, [id.toString, name], (err) => {
                    if(err) {
                        console.log(err.message);
                        reject(`DB Error probably this nick exist`);
                        db.close();
                        return;
                    }
                    resolve();
                    db.close();
                });
            });
    }

    addQuestion(quiz_id : number, q : Question) : Promise<void>{
        const db = new sqlite.Database(this.baseName);
        return new Promise((resolve, reject) => {
            const param : string[] = [q.nr.toString(10), q.content, q.punish.toString(10),
            q.answer.toString(10), quiz_id.toString(10)];
            db.run(`INSERT INTO questions (nr, content, punish,
                answer, quiz_id) VALUES ((?), (?), (?), (?), (?));`, 
                param, (err: any) => {
                	if (err) {
						console.log(err);
                	    reject('DB Error');
                	    db.close();
                	    return;
                	}
                	resolve();
                	db.close();
                });
            });
    }
}
import * as sqlite from 'sqlite3';

export interface Question{
    content : string,
    punish : number,
    answer : number
}

export interface Anserws{
    ans : string[],
    stats : number[]
}

export interface Quiz{
    name : string,
    id : number,
    ended : number
}

export interface QuizToAdd{
    name : string,
    questions : Question[]
}

export function instanceOfQuestion(q : any) : boolean{
    if(!('content' in q) || !('answer' in q) || !('punish' in q)){
        return false;
    }
    if(typeof(q.content) !== 'string' ||  typeof(q.punish) !== 'number' 
    || typeof(q.answer) !== 'number'){
        return false;
    }
    return true;
}

export function instanceOfQuizToAdd(q : any) : boolean{
    if(!('name' in q) || !('questions' in q) || typeof(q.name) !== 'string'){
        return false;
    }
    for(const quest of q.questions){
        if(!(instanceOfQuestion(quest))){
            return false;
        }
    } 
    return true;
}

export function instanceOfAnswers(r : any) : boolean{
    if(!('ans' in r) || !('stats' in r) || r.stats.length !== r.ans.length){
        return false;
    }
    for(let i=0; i<r.ans.length; i++){
        if(typeof(r.ans[i]) !== 'string' ||  typeof(r.stats[i]) !== 'number' 
        || isNaN(r.ans[i])){
            return false;
        }
    }
    return true;
}

export class QuizStore {
    baseName: string;

	constructor(baseName : string){
        this.baseName = baseName;
    }
    addQuiz(q : QuizToAdd) : Promise<void>{
        const db = new sqlite.Database(this.baseName);
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO quizes (name)
                VALUES ((?));`, [q.name], (err) => {
                    if(err) {
                        console.log(err);
                        reject(`DB Error probably this nick exist`);
                        db.close();
                        return;
                    }
                    let i=0;
                    for(const quest of q.questions){
                        const param : string[] = [i.toString(10), quest.content, quest.punish.toString(10),
                        quest.answer.toString(10), q.name];
                        i++;
                        db.run(`INSERT INTO questions (nr, content, punish,
                            answer, quiz_id) VALUES ((?),
                            (?), (?), (?), (SELECT id from quizes where name=(?)));`, 
                            param, (err2: any) => {
                                if(err2) {
                                    console.log(err2);
                                    reject(`DB Error probably this nick exist`);
                                    db.close();
                                    return;
                                }
                            });
                    }
                    resolve();
                    db.close();
                });
            });
    }  

    getQuizList(nick : string) : Promise<Quiz[]>{
        const db = new sqlite.Database(this.baseName);
        return new Promise((resolve,reject) => {
            db.all(`SELECT * FROM quizes q LEFT JOIN done d
            ON d.user_nick = (?) AND d.quiz_id = q.id;`, [nick], (err, quiz_rows) => {
                if(err) {
                    console.log(err.message);
                    reject('DB Error getQuizes');
                    db.close;
                    return;
                }
                const quizes : Quiz[] = [];
                for(const row of quiz_rows){
                    let quiz : Quiz = {name: row.name, id: row.id, ended : row.ended};
                    quizes.push(quiz);     
                }
                db.close;
                resolve(quizes);
                return;                
            });
        });
    }

    getQuiz(nick : string, quiz_id : number) : Promise<any>{
        const db = new sqlite.Database(this.baseName);
        return new Promise((resolve,reject) => {
            db.get(`SELECT * FROM quizes q LEFT JOIN done d
            ON d.user_nick = (?) AND d.quiz_id = q.id
            WHERE q.id=(?);`, [nick, quiz_id.toString(10)], (err, row) => {
                if(err) {
                    console.log(err.message);
                    reject('DB Error getQuiz');
                    db.close;
                    return;
                }
                if(row.start === null || row.start === undefined){
                    console.log("clock started");
                    const now = new Date()  
                    const milis = now.getTime();
                    db.run(`INSERT INTO done VALUES((?), (?), (?), NULL, NULL);`, 
                    [nick, quiz_id.toString(10), milis.toString(10)], (err) => {
                        if(err) {
                            console.log(err.message);
                            reject('DB Error getQuiz');
                            db.close;
                            return;
                        }
                    });
                }
                
                db.all(`SELECT content, punish FROM questions q WHERE q.quiz_id=(?)
                ORDER BY nr ASC;`, 
                [quiz_id.toString(10)], (err, rows) => {
                    if(err) {
                        console.log(err.message);
                        reject('DB Error getQuiz');
                        db.close;
                        return;
                    }
                    const quests = [];
                    for(const row of rows){
                        console.log(row);
                        let quest = {content: row.content, punish : row.punish};
                        quests.push(quest);     
                    }
                    db.close;
                    resolve(quests);
                    return; 
                });       
            });
        });
    }

    setResult(nick : string, quiz_id : number, answers : Anserws){
        const db = new sqlite.Database(this.baseName);
        return new Promise((resolve, reject) => {
            db.run(`BEGIN EXCLUSIVE TRANSACTION;`, (error) =>{
                if(error) {
                    console.log(error.message);
                    reject('DB Error Transaction');
                    db.close;
                    return;
                }
                
                db.get(`SELECT * FROM quizes q INNER JOIN done d
                ON d.user_nick = (?) AND d.quiz_id = q.id
                WHERE q.id = (?);`, [nick, quiz_id.toString(10)], (err, row) => {
                    if(err) {
                        db.run(`ROLLBACK;`, ()=>{});
                        console.log(err.message);
                        reject('DB Error getQuiz');
                        db.close;
                        return;
			    	}
                    console.log(row);
                    if(row.start === null || row.start === undefined){
                        db.run(`ROLLBACK;`, ()=>{});
                        console.log("you havent started yet");
			    		reject();
			    		db.close;
                        return;
                    }
                    
                    if(row.ended !== null){
                        console.log("cant do it twice");
                        db.run(`ROLLBACK;`, ()=>{});
			    		reject();
			    		db.close;
                        return;
			    	}
                
                    console.log("clock ended");
                    const now = new Date()  
                    const milis = now.getTime();
                    let points = (milis - row.start)/1000;
			    	db.serialize(() => {
                    
			    		for( let i=0; i<answers.ans.length; i++){
			    			const spend = (milis - row.start)*answers.stats[i]/100;
			    			db.run('INSERT INTO results VALUES((?), (?), (?), (?), (?));',
			    			[nick, quiz_id.toString(), i.toString(), answers.ans[i], 
			    			spend.toString()], (err) => {
                                if(err) {
                                    console.log(err.message);
                                    db.run(`ROLLBACK;`, ()=>{});
                                }
                            });
                        }
                        db.each(`SELECT r.user_answer, q.answer, q.punish FROM questions q INNER JOIN results r
                        ON q.nr = r.quest_nr AND q.quiz_id = r.quiz_id
                        WHERE q.quiz_id=(?) AND r.user_nick=(?);`,
                        [quiz_id.toString(), nick], (err, row) =>{
                            if(err) {
                                console.log(err.message);
                                db.run(`ROLLBACK;`, ()=>{});
			    				return;
			    			}
			    			console.log("akt points=" + points + "  " + row) ;
                            if(row.user_answer !== row.answer){
                                points += row.punish;
                            }
                        }, () => {
			    			db.run('UPDATE done SET ended=(?), points=(?) WHERE quiz_id=(?) AND user_nick=(?);',
			    			[milis.toString(), points.toString(), quiz_id.toString(), nick], (err) => {
                                if(err){ 
                                    console.log(err.message);
                                    db.run(`ROLLBACK;`, ()=>{});
                                }
                                db.run(`COMMIT;`, ()=>{});
                            });
			    		});            

                    
			    	})
			    	resolve();
			    	db.close;
                    return;
                });
            });
        });
    }

    giveResult(nick : string, quiz_id : number) : Promise<any>{
        const db = new sqlite.Database(this.baseName);
        const Corr_Answers : number[]= [];
		const User_Answers :number[]= [];
		const Best : any[] = [];
        let sum = 0;
         const Times :number[]= [];
        const Avg :number[] = [];
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.get(`SELECT * FROM done d
                WHERE d.quiz_id = (?) AND d.user_nick=(?);`,
                 [quiz_id.toString(10), nick], (err, row) => {
                    if(err || row === undefined) {
                        console.log(err.message);
                        reject('DB Error getQuiz');
                        db.close;
                        return;
                    }
                    sum = row.points;
                })
                 
                db.all(`SELECT AVG(milis_spend) AS average FROM results r INNER JOIN
                questions q ON r.quiz_id=q.quiz_id AND r.quest_nr=q.nr
                WHERE q.quiz_id = (?) AND q.answer=r.user_answer
                GROUP BY q.nr
                ORDER BY q.nr ASC;`,
                  [quiz_id.toString(10)], (err, rows) => {
                     if(err) {
                         console.log(err.message);
                         reject('DB Error getQuiz');
                         db.close;
                         return;
                     }
                     for(const row of rows){
                        Avg.push(row.average/1000);
					}
                     
                })                
                 
				db.all(`SELECT user_nick, points FROM done
				WHERE quiz_id = (?)
				ORDER BY points ASC;`,
				  [quiz_id.toString(10)], (err, rows) => {
					 if(err || rows===undefined) {
						 console.log(err.message);
						 reject('DB Error getQuiz');
						 db.close;
						 return;
					 }
					 for(const row of rows){
                        Best.push({nick: row.user_nick, points: row.points});
					}
				});

                db.all(`SELECT answer, user_answer, milis_spend, punish FROM questions q INNER JOIN results r 
                ON q.nr=r.quest_nr AND q.quiz_id = r.quiz_id
                WHERE q.quiz_id = (?) AND r.user_nick=(?)
                ORDER BY nr ASC;`, [quiz_id.toString(10), nick], (err, rows) => {
                    if(err || rows === undefined) {
                        console.log(err.message);
                        reject('DB Error getQuiz');
                        db.close;
                        return;
                    }

                    for(const row of rows){
                        Corr_Answers.push(parseInt(row.answer));
                        User_Answers.push(parseInt(row.user_answer));
                        Times.push(parseInt(row.milis_spend)/1000);
					}
					resolve({points : sum, corr_ans : Corr_Answers, user_ans : User_Answers, times : Times, best: Best, avg : Avg});
            		db.close();
            		return;
                });
            });
            
        });
    }
}
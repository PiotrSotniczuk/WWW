import * as sqlite from 'sqlite3';
import { resolve } from 'path';
import { rejects } from 'assert';

export interface Question{
    content : string,
    punish : number,
    answer : number
}

export interface Result{
    question : Question,
    user_answ : number,
    milis : number,
    avg : number
}

interface Stats{
    nick : string,
    milis : number[]
}

export interface Quiz{
    name : string,
    id : number,
    ended : number
    //results : Result[],
    //bestStats : Stats[]
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
                VALUES ((?), (?));`, [id.toString(10), name], (err) => {
                    if(err) {
                        console.log(err.message);
                        reject(`DB Error probably this nick exist`);
                        db.close();
                        return;
                    }
                    console.log([id.toString(10), name]);
                    resolve();
                    db.close();
                });
            });
    }

    addQuestion(quiz_id : number, q_nr : number, q : Question) : Promise<void>{
        const db = new sqlite.Database(this.baseName);
        return new Promise((resolve, reject) => {
            const param : string[] = [q_nr.toString(10), q.content, q.punish.toString(10),
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
                    console.log(row);
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
                console.log(row);
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
    
    setResult(nick : string, quiz_id : number, answers : any){
        const db = new sqlite.Database(this.baseName);
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM quizes q INNER JOIN done d
            ON d.user_nick = (?) AND d.quiz_id = q.id
            WHERE q.id = (?);`, [nick, quiz_id.toString(10)], (err, row) => {
                if(err) {
                    console.log(err.message);
                    reject('DB Error getQuiz');
                    db.close;
                    return;
				}
                console.log(row);
                if(row.start === null || row.start === undefined){
                    console.log("you havent started yet");
					reject();
					db.close;
                    return;
                }
                if(row.ended !== null){
                    console.log("cant do it twice");
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
						[nick, quiz_id.toString(), i.toString(), answers.ans[i].toString(), 
						spend.toString()], (err) => {if(err) console.log(err.message);});
                    }
                    db.each(`SELECT r.user_answer, q.answer, q.punish FROM questions q INNER JOIN results r
                    ON q.nr = r.quest_nr AND q.quiz_id = r.quiz_id
                    WHERE q.quiz_id=(?) AND r.user_nick=(?);`,
                    [quiz_id.toString(), nick], (err, row) =>{
                        if(err) {
							console.log(err.message);
							return;
						}
						console.log("akt points=" + points + "  " + row) ;
                        if(row.user_answer !== row.answer){
                            points += row.punish;
                        }
                    }, () => {
						db.run('UPDATE done SET ended=(?), points=(?) WHERE quiz_id=(?) AND user_nick=(?);',
						[milis.toString(), points.toString(), quiz_id.toString(), nick], (err) => {if(err) console.log(err.message);});
					});            

                
				})
				resolve();
				db.close;
                return;
            });
        });
    }

    giveResult(nick : string, quiz_id : number) : Promise<any>{
        const db = new sqlite.Database(this.baseName);
        const Corr_Answers : number[]= [];
        const User_Answers :number[]= [];
        let sum = 0;
         const Times :number[]= [];
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
					resolve({points : sum, corr_ans : Corr_Answers, user_ans : User_Answers, times : Times});
            	db.close();
            	return;
                });



            });
            
        });
    }
}


//if(row.ended === null){
//    quizes.push(quiz);
//    i++;
//    if(i === size){
//        db.close();
//        resolve(quizes);
//    }
//}else{
//    db.serialize(() => {
//        let res_tab : Result[] = [];
//        db.all(`SELECT q.nr, q.content, q.punish, q.answer, r.user_answ, r.milis
//        FROM questions q INNER JOIN results r
//        ON q.nr=r.quest_nr AND q.quiz_id=r.quiz_id AND q.quiz_id=(?)
//        AND r.user_nick=(?)
//        ORDER BY q.nr ASC;`, [quiz.id, nick], (err1, res_rows) => {
//            //let res_tab : Result[] = [];
//            if(err1 || res_rows === undefined) {
//                console.log(err1.message + "maybe done but no results");
//                reject('DB Error getQuizes');
//                db.close;
//                return;
//            }
//            for(let j=0; j<res_rows.length; j++){
//                console.log(row);
//                res_tab.push({question: {nr: row.nr, content: row.content,
//                punish: row.punish, answer: row.answer}, user_answ: row.user_answ,
//                milis: row.milis, avg: null});
//            }
//            quizes.push(quiz);
//            i++;
//            if(i === size){
//                db.close()
//                resolve(quizes);
//            }
//        });
//    });
//}

//UPDATE done SET start=(?) WHERE user_nick=(?) 
//AND quiz_id=(?);
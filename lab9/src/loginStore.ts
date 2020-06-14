import * as sqlite from 'sqlite3';
export class LoginStore {
    baseName: string;

	constructor(baseName : string){
        this.baseName = baseName;
    }
    addUser(nick : string, password : string) : Promise<void>{
        const db = new sqlite.Database(this.baseName);
        return new Promise((resolve, reject) => {
            db.exec(
                `BEGIN TRANSACTION;
                INSERT INTO users (nick, password)
                VALUES ('${nick}', '${password}');
                COMMIT;`, (err) => {
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

    loginUser(nick : string, password : string) : Promise<boolean>{
        const db = new sqlite.Database(this.baseName);
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM users WHERE nick='${nick}'
                AND password='${password}';`, (err, row) => {
                    if(err) {
                        console.log(err.message);
                        reject('DB Error check login');
                        db.close();
                        return;
                    }
                    if(row.length === 1){
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                    db.close();
                });
            })
    }
}
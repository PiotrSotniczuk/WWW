import { MemClass } from "./mem";
import * as sqlite from 'sqlite3';

class NoSuchMemError extends Error {
    constructor(message : string) {
      super(message); // (1)
      this.name = "NoSuchMemError"; // (2)
    }
  }

// klasa memStore
// tslint:disable-next-line: max-classes-per-file
export class MemStore {
    db: sqlite.Database;

	constructor(db: sqlite.Database){
        this.db = db;
    }
    addMeme(meme : MemClass) : Promise<void>{
        return new Promise((resolve, reject) => {
            this.db.exec(
                `BEGIN TRANSACTION;
                INSERT INTO memes (id, name, url, last_id)
                VALUES (${meme.id}, '${meme.name}', '${meme.url}', 1);
                INSERT INTO prices (id, price, mem_id)
                VALUES (1, ${meme.price}, ${meme.id});
                COMMIT;`,
                (err) => {
                    if(err) {
                        console.log(err.message);
                        reject(`DB Error probably mem with this id exist`);
                        return;
                    }
                    resolve();
                });
            });
    }
    get mostExpensive() : Promise<MemClass[]>{
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT m.id, m.name, m.url, p.price FROM memes m
            INNER JOIN prices p ON m.last_id = p.id AND m.id = p.mem_id
            ORDER BY p.price DESC
            LIMIT 3;`, (err, rows) => {
                if(err) {
                    console.log(err.message);
                    reject('DB Error mostExpensive');
                    return;
                }
                const memes = [];
                for (const row of rows) {
                    memes.push(new MemClass(row.id, row.name, row.price, row.url));
                }
                resolve(memes);
            });
        });
    }

   // getMemeById(idStr : string) : MemClass{
   //     // TODO throw
   //     const memId = +idStr;
   //    for (const iterator of this.memesArr) {
   //        if(iterator.id === memId){
   //            return iterator;
   //        }
   //    }
   //    throw new NoSuchMemError("no id=" + idStr);
   // }
}
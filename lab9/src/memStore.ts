import { MemClass } from "./mem";

class NoSuchMemError extends Error {
    constructor(message : string) {
      super(message); // (1)
      this.name = "NoSuchMemError"; // (2)
    }
  }

// klasa memStore
// tslint:disable-next-line: max-classes-per-file
export class MemStore {
    memesArr : MemClass[];

	constructor(){
        this.memesArr = [];
    }
    addMeme(meme : MemClass) : void{
        this.memesArr.push(meme);
    }
    get allMemes() : MemClass[]{
        return this.memesArr.slice();
    }
    get mostExpensive() : MemClass[]{
        return this.memesArr.sort((a,b) => b.price - a.price).slice(0,3);
    }

    getMemeById(idStr : string) : MemClass{
        // TODO throw
        const memId = +idStr;
       for (const iterator of this.memesArr) {
           if(iterator.id === memId){
               return iterator;
           }
       }
       throw new NoSuchMemError("no id=" + idStr);
    }
}
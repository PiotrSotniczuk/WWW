import { MemClass } from "./mem";
import { MemStore } from "./memStore";

function assert(condition : boolean, message : string) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

function testMemClass(){
    const mem = new MemClass(1, 'Testowy', 1000, 'urlTEST');
    assert(mem.id === 1 && mem.name === 'Testowy' &&
    mem.price === 1000 && mem.url === 'urlTEST', 'Constructor');

    mem.changePrice(300);
    assert(mem.price === 300, 'Change');
    mem.changePrice(200);

    assert(mem.priceHist[0] === 200 &&
        mem.priceHist[1] === 300 && mem.priceHist[2] === 1000, 'History');

    // tslint:disable-next-line: no-console
    console.log('testMemClass passed');
}

function testMemStore(){
    const store = new MemStore();
    const a = new MemClass(10, 'Gold', 100, 'https://i.redd.it/h7rplf9jt8y21.png');
    const b = new MemClass(9, 'Platinium', 1100,
    'http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg');
    const c = new MemClass(8, 'Elite', 120, 'https://i.imgflip.com/30zz5g.jpg');
    const d = new MemClass(6, 'Sad', 999, 'https://i.pinimg.com/236x/6d/ee/bc/6deebc8a47ecfaf39cc8a8574a77599f.jpg');
    store.addMeme(a);
    store.addMeme(b);
    store.addMeme(c);
    store.addMeme(d);

    const allStore = store.allMemes;
    assert(allStore.length === 4, 'allStore Size');
    assert(allStore.includes(a), 'addMeme');
    assert(allStore.includes(b), 'addMeme');
    assert(allStore.includes(c), 'addMeme');
    assert(allStore.includes(d), 'addMeme');

    let mostExp = store.mostExpensive;
    assert(mostExp.length === 3, 'mostExp Size');

    assert(mostExp[0].name === 'Platinium' && mostExp[1].name === 'Sad' &&
    mostExp[2].name === 'Elite', 'sorting');

    b.changePrice(110);
    mostExp = store.mostExpensive;
    assert(mostExp[2].name === 'Platinium' && mostExp[0].name === 'Sad' &&
    mostExp[1].name === 'Elite', 'sorting after add');

    assert(store.getMemeById('10') === a, 'getMemeById');

    try {
        store.getMemeById('1');
    } catch (error) {
        assert(error.name === 'NoSuchMemError', 'Bad Error');
    }
    // tslint:disable-next-line: no-console
    console.log('testMemStore passed');
}

testMemClass();
testMemStore();
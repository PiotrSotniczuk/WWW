import { MemClass } from "./mem";
import { MemStore } from "./memStore";
import 'mocha';
import { assert } from "chai";

describe("MemClass", () => {
    const mem = new MemClass(1, 'Testowy', 1000, 'urlTEST');
    it("checks constructor", () => {
        const mem = new MemClass(1, 'Testowy', 1000, 'urlTEST');
        assert.equal(mem.id, 1);
        assert.equal(mem.name,'Testowy');
        assert.equal(mem.price, 1000);
        assert.equal(mem.url, 'urlTEST');
    });

    it("changing price and price history", () => {
        mem.changePrice(300);
        assert.equal(mem.price, 300);
        mem.changePrice(200);

        assert.equal(mem.priceHist[0], 200);
        assert.equal(mem.priceHist[1], 300);
        assert.equal(mem.priceHist[2], 1000);
        });
});

describe("MemStore", () => {
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

    it("adding memes to store", () => {
        assert.equal(allStore.length, 4);
        assert.equal(allStore.includes(a), true);
        assert.equal(allStore.includes(b), true);
        assert.equal(allStore.includes(c), true);
        assert.equal(allStore.includes(d), true);
    });

    it("sorting most expensive", () => {
        let mostExp = store.mostExpensive;
        assert.equal(mostExp.length, 3);
        assert.equal(mostExp[0].name, 'Platinium');
        assert.equal(mostExp[1].name, 'Sad');
        assert.equal(mostExp[2].name, 'Elite');

        b.changePrice(110);
        mostExp = store.mostExpensive;
        assert.equal(mostExp[2].name, 'Platinium');
        assert.equal(mostExp[0].name, 'Sad');
        assert.equal(mostExp[1].name, 'Elite');
    });

    it("checking getMemeById", () => {
        assert.equal(store.getMemeById('10'), a);
        try {
            store.getMemeById('1');
        } catch (error) {
            assert.equal(error.name, 'NoSuchMemError');
        }
    });
});
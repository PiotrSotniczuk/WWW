import express from 'express'
import { MemClass } from './mem';
import { METHODS } from 'http';
import { MemStore } from './memStore';



const store : MemStore = new MemStore();
store.addMeme(new MemClass(10, 'Gold', 100, 'https://i.redd.it/h7rplf9jt8y21.png'));
store.addMeme(new MemClass(9, 'Platinium', 1100, 'http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg'));
store.addMeme(new MemClass(8, 'Elite', 120, 'https://i.imgflip.com/30zz5g.jpg'));
store.addMeme(new MemClass(7, 'Bronze', 700, 'http://www.gazetamiedzyszkolna.pl/wp-content/uploads/2016/02/macgyver-MEM-752x440.png'));

const app = express();
app.set('view engine', 'pug');


// tslint:disable-next-line: only-arrow-functions
app.get('/', (req, res) => {
    res.render('index', { title: 'Meme market', message: 'Hello there!', memes: store.mostExpensive});
});

export default app;

app.get('/meme/:memeId', (req, res) => {
    const meme = store.getMemeById(req.params.memeId);
    res.render('meme', { title: 'Mem', message: 'Price history:', mem: meme });
 });

 app.use(express.urlencoded({
    extended: true
    }));

 app.post('/meme/:memeId', (req, res) => {
    const newPrice = req.body.newPrice;
    console.log(newPrice);
    const meme = store.getMemeById(req.params.memeId);
    meme.changePrice(newPrice);
    res.render('meme', { title: 'Mem', message: 'Price history:', mem: meme });
 })
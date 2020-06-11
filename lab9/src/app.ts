import express from 'express'
import cookieParser from "cookie-parser";
import { MemClass } from './mem';
import { METHODS } from 'http';
import { MemStore } from './memStore';
import csurf from "csurf";
import * as sqlite from 'sqlite3';


const store : MemStore = new MemStore('memes.db');

store.addMeme(new MemClass(10, 'Gold', [100],
'https://i.redd.it/h7rplf9jt8y21.png', [""])).then( () => {
    console.log('addMeme Gold OK');
}).catch(() => {
    console.log('addMeme Gold in base');
});

store.addMeme(new MemClass(9, 'Platinium', [1100],
'http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg', [""]))
.then(() => {
    console.log('addMeme Plat OK');
}).catch(() => {
    console.log('addMeme Plat in base');
});

store.addMeme(new MemClass(8, 'Elite', [120],
'https://i.imgflip.com/30zz5g.jpg', [""])).then(() => {
    console.log('addMeme Elite OK');
}).catch(() => {
    console.log('addMeme Elite in base');
});

store.addMeme(new MemClass(7, 'Bronze', [700],
'http://www.gazetamiedzyszkolna.pl/wp-content/uploads/2016/02/macgyver-MEM-752x440.png', [""])).then(() => {
    console.log('addMeme Bronze OK');
}).catch(() => {
    console.log('addMeme Bronze in base');
});

store.addMeme(new MemClass(6, 'Sad', [999],
'https://i.pinimg.com/236x/6d/ee/bc/6deebc8a47ecfaf39cc8a8574a77599f.jpg', [""])).then(() => {
    console.log('addMeme Sad OK');
}).catch(() => {
    console.log('addMeme Sad in base');
});

const app = express();

const csrfProtection = csurf({cookie: true});
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'pug');

app.get('/', (req, res) => {
    store.mostExpensive.then(result => {
        res.render('index', {
            title: 'Meme market',
            message: 'Hello there!',
            memes: result
        });
    }).catch(() => {
        console.log("cannot load most exp");
    });
});

export default app;

app.get('/meme/:memeId(\\d+)', csrfProtection, (req, res, next) => {
    try{
        store.getMemeById(req.params.memeId).then(result => {
            res.render('meme', {
                title: 'Mem',
                message: 'Price history:',
                mem: result,
                size: result.priceHist.length,
                csrfToken: req.csrfToken()
            });
        }).catch(() => {
            console.log("getMemeId error");
        });
    } catch(error){
        res.status(404);
        res.render('404');
    }
});

app.post('/meme/:memeId(\\d+)', csrfProtection, (req, res) => {
   const newPrice = req.body.newPrice;
   if(isNaN(newPrice)){
       return;
   }
   try{
        // check if such meme exist
        store.getMemeById(req.params.memeId).then(result => {
            store.changePrice(req.params.memeId, newPrice, "ktos").then(() => {
                // get new actulized meme
                try{
                    store.getMemeById(req.params.memeId).then(result2 => {
                        res.render('meme', {
                            title: 'Mem',
                            message: 'Price history:',
                            mem: result2,
                            size: result2.priceHist.length,
                            csrfToken: req.csrfToken()
                        });
                    }).catch(() => {console.log("getMemeId error");});
                }catch(error){console.log("this should never happen exception above");}
            }).catch(() => {console.log("changePrice error");})
        }).catch(() => {console.log("getMemeId error");});
   } catch(error){
       res.status(404);
       res.render('404');
   }
});
app.use((req, res) => {
    res.status(404);
    res.render('404');
})

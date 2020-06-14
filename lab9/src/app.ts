import express = require('express')
import cookieParser = require("cookie-parser");
import { MemClass } from './mem';
import { METHODS } from 'http';
import { MemStore } from './memStore';
import { LoginStore } from './loginStore';
import csurf = require("csurf");
import * as sqlite from 'sqlite3';
import session = require('express-session');

const connectSqlite = require('connect-sqlite3');

const SqliteStore = connectSqlite(session);
const store : MemStore = new MemStore('memes.db');
const loginStore : LoginStore = new LoginStore('memes.db');
const app = express();

const csrfProtection = csurf({cookie: true});
app.use(express.urlencoded({extended: true}));
export const secretStr = '219476719659883906827300102123948';

app.use(cookieParser(secretStr));

app.set('view engine', 'pug');

app.use(session({
    secret: secretStr,
    cookie: { maxAge: 15*60*1000},
    resave: false,
    saveUninitialized: true,
    store: new SqliteStore()
}))

app.get('/', (req, res) => {
    store.mostExpensive.then(result => {
        res.render('index', {
            title: 'Meme market',
            message: 'Hello there!',
            memes: result,
            user: req.session.user
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
   if(req.session.user === null || isNaN(newPrice)){
        res.redirect('/');
        return;
   }
   try{
        // check if such meme exist
        store.getMemeById(req.params.memeId).then(result => {
            store.changePrice(req.params.memeId, newPrice, req.session.user).then(() => {
                // get new actulized meme
                res.redirect('/meme/' + req.params.memeId);
            }).catch(() => {console.log("changePrice error");})
        }).catch(() => {console.log("getMemeId error");});
   } catch(error){
       res.status(404);
       res.render('404');
   }
});

app.get('/login', csrfProtection, (req, res) => {
    res.render('login', {
        csrfToken: req.csrfToken()
    });
});

app.post('/login', csrfProtection, (req, res) => {
    const input_nick = req.body.nick;
    const input_password = req.body.password;
    loginStore.loginUser(input_nick, input_password).then(result => {
        if(result){
            console.log("zalogowany");
            req.session.user = input_nick;
            res.redirect('/');
        }else{
            console.log("bledny login");
            res.redirect('/login');
        }
    }).catch(() => {
        console.log("Error login");
    });
});

app.get('/logout', (req, res) => {
    req.session.user = null;
    res.redirect('/');
});

app.use((req, res) => {
    res.status(404);
    res.render('404');
})

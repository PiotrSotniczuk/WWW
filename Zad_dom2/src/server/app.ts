import express = require('express')
import cookieParser = require("cookie-parser");
import path = require('path');
import { LoginStore } from './loginStore';
const connectSqlite = require('connect-sqlite3');
import session = require('express-session');

const app = express();
const SqliteStore = connectSqlite(session);

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/../static'));

const loginStore : LoginStore = new LoginStore('quizes.db');

export const secretStr = '219476719659883906827300102123948';
app.use(cookieParser(secretStr));
app.use(session({
    secret: secretStr,
    cookie: { maxAge: 15*60*1000},
    resave: false,
    saveUninitialized: true,
    store: new SqliteStore()
}))

app.get('/', (req, res) => {
    //console.log(mainDir);
    res.sendFile(path.join(__dirname, '/../static/quiz.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/../static/login.html'))
});

// TODO add csurf
app.post('/login', (req, res) => {
    const inputNick = req.body.nick;
	const inputPassword = req.body.password;
	loginStore.loginUser(inputNick, inputPassword).then(result => {
        if(result){
            console.log("zalogowany");
            req.session.user = inputNick;
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

export default app;
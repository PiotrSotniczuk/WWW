import express = require('express')
import cookieParser = require("cookie-parser");
import path = require('path');
import { LoginStore } from './loginStore';
const connectSqlite = require('connect-sqlite3');
import session = require('express-session');
import csurf = require("csurf");

const app = express();
const SqliteStore = connectSqlite(session);
const csrfProtection = csurf({cookie: true});

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'html');
app.use(express.static(__dirname + '/../static'));

const loginStore : LoginStore = new LoginStore('quizes.db');

export const secretStr = '219476719659883906827300102123948';
app.use(cookieParser(secretStr));
app.use(session({
    secret: secretStr,
    cookie: { maxAge: 60*60*1000},
    resave: false,
    saveUninitialized: true,
    store: new SqliteStore()
}))

app.get('/', csrfProtection, (req, res) => {
    //console.log(mainDir);
    res.cookie('CSRF', req.csrfToken());    
    res.sendFile(path.join(__dirname, '/../static/quiz.html'));
});

// TODO add csurf
app.post('/login', csrfProtection, (req, res) => {
    const inputNick = req.body.nick;
	const inputPassword = req.body.password;
	loginStore.loginUser(inputNick, inputPassword).then(result => {
        if(result){
            console.log("zalogowany");
            req.session.user = inputNick;
            res.cookie('USER_LOGGED', inputNick);       
        }else{
            console.log("bledny login");
        }
        res.redirect('/');
    }).catch(() => {
        console.log("Error login");
    });
});

app.get('/logout', (req, res) => {
    req.session.user = null;
    res.cookie('USER_LOGGED', "");
    res.redirect('/');
});

app.use((req, res) => {
    res.status(404);
    res.render('404');
})

export default app;
import express = require('express')
import cookieParser = require("cookie-parser");
import path = require('path');
import { LoginStore } from './loginStore';
import { Question, QuizStore} from './quizStore';
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
const quizStore : QuizStore = new QuizStore('quizes.db');

export const secretStr = '21947htds48';
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

app.post('/changePass', csrfProtection, (req, res) => {
    const oldPass = req.body.oldPass;
    const newPass = req.body.newPass;
    if(req.session.user === null || req.session.user === undefined || 
        req.session.user === ""){
        res.redirect('/');
    }
    loginStore.changePassword(req.session.user, oldPass, newPass).then((result) => {
        if(result){
            console.log('pass changed');
            req.session.user = null;
            res.cookie('USER_LOGGED', "");
        }else{
            console.log('pass not change');
        }
        res.redirect('/');
    }).catch(() => {console.log('error changing pass');});
});

app.get('/quizList', (req, res) => {
    if(req.session.user === null || req.session.user === undefined || 
        req.session.user === ""){
        res.redirect('/');
        return;
    }
    quizStore.getQuizList(req.session.user).then(result => {
        res.send(result);
    }).catch(() => {console.log('error getting list');});
})

app.use((req, res) => {
    res.status(404);
    res.render('404');
})

export default app;
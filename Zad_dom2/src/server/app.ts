import express = require('express')
import cookieParser = require("cookie-parser");
import path = require('path');
import { LoginStore } from './loginStore';
import { Question, QuizStore} from './quizStore';
const connectSqlite = require('connect-sqlite3');
import session = require('express-session');
import csurf = require("csurf");
import bodyParser = require('body-parser');
import { send } from 'process';
import { stringify } from 'querystring';
import * as sqlite from 'sqlite3';
import { resolve } from 'path';


const app = express();
const SqliteStore = connectSqlite(session);
const csrfProtection = csurf({cookie: true});

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/../static'));

const loginStore : LoginStore = new LoginStore('quizes.db');
const quizStore : QuizStore = new QuizStore('quizes.db');

export const secretStr = '21947htds48';
app.use(cookieParser(secretStr));
app.use(bodyParser.json());
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
        res.redirect('/');
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
        res.cookie('USER_LOGGED', "");
        res.redirect('/');
    }
    loginStore.changePassword(req.session.user, oldPass, newPass).then((result) => {
        if(result){
            console.log('pass changed');
            const db = new sqlite.Database('sessions');
            new Promise((resolve, reject) => {
                db.run(`DELETE FROM sessions WHERE sess LIKE '%"user":"' || ? || '"%';`,
                [req.session.user], (err) => {
                    if(err){
                        console.log('removing sessions' + err.message);
                        reject();
                        db.close();
                    }
                    res.cookie('USER_LOGGED', "");
                    res.redirect('/');
                    resolve();
                    db.close();
                })
            })
        }else{
            console.log('pass not change');
            res.redirect('/');
        }
    }).catch(() => {
        console.log('error changing pass');
        res.redirect('/');
    });
});

app.get('/quizList', (req, res) => {
    if(req.session.user === null || req.session.user === undefined || 
        req.session.user === ""){
        res.cookie('USER_LOGGED', "");
        res.redirect('/');
        return;
    }
    quizStore.getQuizList(req.session.user).then(result => {
        res.send(result);
    }).catch(() => {
        res.redirect('/');
        console.log('error getting list');
    });
})

app.get('/quiz/:quizId(\\d+)', (req, res) => {
    if(req.session.user === null || req.session.user === undefined || 
        req.session.user === ""){
        res.cookie('USER_LOGGED', "");
        res.redirect('/');
        return;
    }
    // quizId is a number because it has passed reggex
    quizStore.getQuiz(req.session.user, parseInt(req.params.quizId)).then(result => {
        res.send(result);
    }).catch(() => {
        console.log('error getting list');
        res.redirect('/');
    });
})

app.post('/quiz/:quizId(\\d+)', csrfProtection, (req, res) => {
    if(req.session.user === null || req.session.user === undefined || 
        req.session.user === ""){
        res.cookie('USER_LOGGED', "");
        res.redirect('/');
        return;
    }
    console.log(req.body);
    console.log(req.params.quizId + 'to chce');
    quizStore.setResult(req.session.user, parseInt(req.params.quizId), req.body)
    .then(() =>{
        console.log('skonczone');
        res.redirect('/');        
    }).catch(()=>{
        console.log('error saving results');
        res.redirect('/');
    });
    
})

app.get('/results/:quizId(\\d+)', (req, res) => {
    if(req.session.user === null || req.session.user === undefined || 
        req.session.user === ""){
        res.cookie('USER_LOGGED', "");
        res.redirect('/');
        return;
    }
    quizStore.giveResult(req.session.user, parseInt(req.params.quizId))
    .then((result) =>{
        console.log("wysylam " + result)
        res.send(result);        
    }).catch(()=>{
        console.log('error saving results');
        res.redirect('/');
    });
});

app.use((req, res) => {
    res.status(404);
    res.render('404');
})

export default app;
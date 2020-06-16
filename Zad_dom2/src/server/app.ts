import express = require('express')
import path = require('path');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/../static'));

app.get('/', (req, res) => {
    //console.log(mainDir);
    res.sendFile(path.join(__dirname, '/../static/quiz.html'));
});

export default app;
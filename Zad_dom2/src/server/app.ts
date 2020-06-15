import express = require('express')
import path = require('path');

const app = express();
const mainDir = __dirname.slice(0, -5);

app.use(express.urlencoded({extended: true}));
app.use(express.static(mainDir + '/static'));

app.get('/', (req, res) => {
    //console.log(mainDir);
    res.sendFile(path.join(mainDir + '/static/quiz.html'));
});

export default app;
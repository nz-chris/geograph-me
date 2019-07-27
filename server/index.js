const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/api/greeting', (req, res) => {
    const name = req.query.name || 'World';
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.get('/api/data', (req, res) => {
    const letter = req.query.letter;
    res.setHeader('Content-Type', 'application/json');
    const data = require('./data.json');
    const toSend = letter ? data[letter] : data;
    res.send(JSON.stringify(toSend));
});

app.listen(3002, () =>
    console.log('Express server is running on localhost:3002')
);

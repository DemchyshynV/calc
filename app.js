const express = require('express');
const expressHbs = require('express-handlebars');
const path = require('path');
const fs = require('fs/promises');

const {DBPath} = require('./db');
const {server: {PORT}} = require('./configs');
const {userParser} = require("./helpers");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'static')));
app.set('view engine', '.hbs');
app.engine('.hbs', expressHbs({defaultLayout: false}));
app.set('views', path.join(__dirname, 'static'));

let login = false
app.get('/', (req, res) => {
    res.render('home')
})
app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;
        const users = await userParser()
        users.push({username, password})
        await fs.writeFile(DBPath, JSON.stringify(users))
        res.redirect('/login')
    } catch (e) {
        res.json(e)
    }
})
app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        const users = await userParser();
        const user = users.find(value => value.username === username);
        if (user === -1) {
            throw new Error()
        }
        if (user.password !== password) {
            throw new Error()
        }
        login = true
        res.redirect('/calc')
    } catch (e) {
        res.status(400).json('username or password is not valid')
    }
})

app.get('/calc', (req, res) => {
    if (!login){
        return res.redirect('/login')
    }
    const actions = ['+', '-', '*', '/']
    res.render('calc', {actions})
})
app.post('/calc', (req, res) => {
    try {
        const {first, second, action} = req.body;
        let result = 0
        switch (action) {
            case '-':
                result = +first - +second
                break;
            case '+':
                result = +first + +second;
                break;
            case '*':
                result = +first * +second
                break;
            case '/':
                result = +first / +second
        }
        if (result === Infinity) {
            throw new Error('Zero divide error')
        }
        res.json({result})
    } catch (e) {
        console.log(e.message);
        res.status(400).json(e.message)
    }
})

app.listen(PORT, () => {
    console.log('App listen', PORT);
});

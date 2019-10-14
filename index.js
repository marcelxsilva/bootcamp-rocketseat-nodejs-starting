const express = require('express');
const server = express();

// set to server receive json
server.use(express.json());

// Query Params = ?test=1
// Route Params = /users/1

// list of users
const users = ['Maria', 'José', 'João'];

// middlewares verify if name exists in body
function checkUserExists(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({ error: 'name is required' });
    }
    return next();
}

// middlewares verify if user exists in array
function checkUserInArray(req, res, next) {
    const user = users[req.params.index];
    if (!user) { 
        return res.status(400).json({ error: 'index from user does not exists' });
    }
    req.user = user;
    return next();
}

// Routo with Query Params
server.get('/teste', (req, res) => {
    const nome = req.query.nome
    res.json({ message: `Hello ${nome ? nome : 'World'}` });
})

// Route with params
server.get('/users/:index', checkUserInArray, (req, res) => {
    res.json(req.user);
})

// lista all users
server.get("/users", (req, res) => {
    res.send({ users })
});

// add new user
server.post('/users', checkUserExists, (req, res) => {
    const { name } = req.body;
    users.push(name);
    return res.json({ users });
});

// edit users
server.put('/users/:index', checkUserInArray, checkUserExists, (req, res) => {
    const { index } = req.params;
    const { name } = req.body;
    users[index] = name;
    return res.json({ users });
});

// delete users
server.delete('/users/:index', checkUserInArray, (req, res) => {
    const { index } = req.params;
    users.splice(index, 1);
    return res.json({ users });
});

server.listen(3000);
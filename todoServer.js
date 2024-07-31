const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000; 

app.use(bodyParser.json());

// Returns a list of all todo items.
app.get('/todos', (req, res) => {
    fs.readFile("todos.json", "utf-8", (err, data) => {
        if (err)
            throw err;

        res.json(JSON.parse(data));
    })
})

// Returns a specific todo item identified by its ID
app.get('/todos/:id', (req, res) => {
    fs.readFile("todos.json", "utf-8", (err, data) => {
        if (err)
            throw err;

        const todos = JSON.parse(data);
        const id = parseInt(req.params.id);

        const todo = todos.find(todo => todo.id === id);

        if (todo)
            return res.status(200).json(todo);
        else
            res.sendStatus(404);
    })
})


// Creates a new todo item
app.post('/todos', (req, res) => {
    const newTodo = {
        id: Math.floor(Math.random() * 1000000),
        title: req.body.title,
        description: req.body.description
    }

    fs.readFile("todos.json", "utf-8", (err, data) => {
        if (err)
            throw err;

        const todos = JSON.parse(data);
        todos.push(newTodo);

        fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
            if (err)
                throw err;
            res.status(201).send(newTodo);
        })
    })
})

// Update an existing todo item by ID
app.put('/todos/:id', (req, res) => {
    fs.readFile("todos.json", "utf-8", (err, data) => {
        if (err)
            throw err;

        const todos = JSON.parse(data);
        const id = parseInt(req.params.id);
        const updatedTodo = req.body;

        const todo = todos.find(todo => todo.id === id);


        if (todo) {
            for (let key of Object.keys(updatedTodo)) {
                todo[key] = updatedTodo[key];
            }
            fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
                if (err)
                    throw err;

                res.sendStatus(200);
            })
        }
        else 
            res.sendStatus(404);
    })
})

// Deletes a todo item identified by its ID
app.delete('/todos/:id', (req, res) => {
    fs.readFile("todos.json", "utf-8", (err, data) => {
        if (err)
            throw err;

        const todos = JSON.parse(data);
        const id = parseInt(req.params.id);
        const todoIndex = todos.findIndex(todo => todo.id === id);

        if (todoIndex != -1) {
            todos.splice(todoIndex, 1);

            fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
                if (err)
                    throw err;

                res.sendStatus(200);
            })
        }
        else {
            res.sendStatus(404);
        }
    })
})

// For any other route not defined in the server return 404
app.get('*', (req, res) => {
    res.sendStatus(404);
})

// App is listening on port 3000, change at the top if needed
// listen() is being ran from the test so don't run it else error
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

module.exports = app;
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000; 

app.use(bodyParser.json());

// Fetches the data from todos.json file and returns a list of all todo items
app.get('/todos', (req, res) => {
    fs.readFile("todos.json", "utf-8", (err, data) => {
        if (err)
            throw err;

        res.json(JSON.parse(data));
    })
})

// Fetches the data from todos.json file and returns a specific todo item identified by its ID
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


// Fetches the data from todos.json file, Creates a new todo item and appends it to the file
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

// Fetches the data from todos.json file and updates an existing todo item identified by ID
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

// Fetches the data from the todos.json file and deletes a todo item identified by its ID
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

// For any other route not defined in the server it returns 404
app.get('*', (req, res) => {
    res.sendStatus(404);
})

// App is listening on port 3000, change at the top if needed
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

// exporting it if need to run any test cases
module.exports = app;
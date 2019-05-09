// implement your API here
const express = require('express');

const db = require('./data/db.js');
// const users = require('./data/seeds/users.js');
const port = 3958;
const app = express();

app.use(express.json());

app.get('/api/users', (req, res) => {
    db.find()
         .then(allUsers => {
             res.json(allUsers);
         })
         .catch(() => {
             res.status(500).json({ error: "The users information could not be retrieved." });
         });
});

app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id)
      .then(user => {
          if(!user) {
              res.status(404).json({ message: "The user with the specified ID does not exist." });
          } else {
              res.json(user);
          }
      })
      .catch(() => {
          res.status(500).json({ error: "The user information could not be retrieved." });
      });
});

app.post('/api/users', (req, res) => {
    const user = req.body;
    if(!user.name || !user.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    } else {
        db.insert(user)
          .then(newUser => {
              res.status(201).json(newUser);
              res.send(newUser);
          })
          .catch(() => {
              res.status(500).json({ error: "There was an error while saving the user to the database." });
          });
    }
});

app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, bio } = req.body;

    if(!name || !bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }

    db.update(id, { name, bio })
      .then(res => {
        res
      })
      db.findById(id)
        .then(user => {
            if(!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            }
            res.status(200).json(user);
        })
        .catch(() => {
            res.status(500).json({ error: "The user information could not be modified." });
        });
}); 

app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.remove(id)
      .then(user => {
          if(!user) {
              res.status(404).json({ message: "The user with the specified ID does not exist." });
          } else {
              res.json(user);
          }
      })
      .catch(() => {
          res.status(500).json({ error: "The user could not be removed." });
      });
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const crypto = require('crypto');
const express = require('express');
const mysql = require('mysql');

const app = express();
const con = mysql.createConnection({
  database: 'coen161',
  password: '',
  user: 'root',
});
const port = 3000;

// We only need to connect to the DB once.
// This allows us to query the DB in any 
// route. Don't close the connection in a
// route otherwise the queries will error.
con.connect(err => {
  if (err) throw err;

  console.log('Connected to the DB!');
});

app.use(bodyParser.json());

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));

// create unique id on session, if it doesn't exist
app.use((req, res, next) => {
  if (!req.session.id) {
    req.session.id = crypto.randomBytes(16).toString("hex");
  }
  
  next();
});

// serve React client app assets
app.use(express.static('client/build'));


// Enter your solution below
app.get('/todos', function(req,res,next) {
  const sql = 'SELECT completed, description, id FROM Todos WHERE sessionId = ?';
  con.query(sql, [req.session.id], (err, results, fields) => {
    if (err) {
      throw err;
    }
    res.send(JSON.stringify(results));
    next();
  });
});


app.post('/todo', function(req,res,next) {
  const sql = 'INSERT INTO Todos (description, sessionId, completed) VALUES (?, ?, FALSE)';
  con.query(sql, [req.body.todo, req.session.id], (err, results, fields) => {
    if (err) {
      throw err;
    }
    res.send({description: req.body.todo, id: results.insertId});
    next();
  });
});

app.put('/todo/:id', function(req,res,next) {
  const sql = 'UPDATE Todos SET completed = ? WHERE id = ?';
  con.query(sql, [req.body.completed, req.params.id], (err, results) => {
    if (err) {
      throw err;
    }
    res.end();
    next();
  });
});


app.delete('/todo/:id', function(req,res,next) {
  const sql = 'DELETE FROM Todos WHERE id = ?';
  con.query(sql, [req.params.id], (err, results) => {
    if (err) {
      throw err;
    }
    res.end();
    next();
  });
});


app.listen(port, () => {
  console.log('To-Do app started on port ' + port);
});

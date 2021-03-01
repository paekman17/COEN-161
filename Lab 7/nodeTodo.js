const fs = require('fs');

exports.handleTodoList = function(req, res, session) {
  switch(req.method) {
    case "GET":
      fs.readFile(`./sessions/${session.id}`, (err, data) => {
        if (err) { // if there's an error, initialize the todoList
          session.todoList = [];
        }
        else { // otherwise, we need to parse it
          session.todoList = JSON.parse(data).todoList;
        }
        if (session.todoList === undefined || session.todoList.length === 0) { // return an empty string if there's nothing in the todoList
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify([]));
        }
        else { // if the list isn't empty, need to traverse it
          let retList = [];
          for (let i = 0; i < session.todoList.length; i++) {
            retList.push({id: i, description: session.todoList[i]});
          }
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(retList));
        }
      });
      break;
    case "POST":
      if (session.todoList === undefined) { // initialize the todoList if we haven't already done so
        session.todoList = [];
      }
      convertRequest(req, data => { // push data to our todoList
        session.todoList.push(data.todo);
        fs.writeFile(`./sessions/${session.id}`, JSON.stringify(session), err => {
          if (err) {
            res.writeHead(500, {'Content-Type': 'text/html'});
            return res.end("500 Internal Server Error");
          }
          res.writeHead(200, 'OK');
          res.end();
        });
      });
      break;
    default:
      res.writeHead(405, {'Allow': 'GET, POST'});
      res.end("Not Allowed");
  }
};

/*
  converts the HTTP POST request body into a JSON object
*/
function convertRequest(req, callback) {
  let data = "";
  req.on('data', chunk => {
    data += chunk.toString();
  });
  req.on('end', () => {
    callback(JSON.parse(data));
  });
}
const nodeTodoDb = require('./nodeTodoDb');

exports.handleTodoList = function(req, res, session) {
  switch(req.method) {
    case "GET":
      nodeTodoDb.getTodos(session.id, (err, data) => {
        let dbList = null;
        if (!err) {
          dbList = data.map(row => row.description);
        }
        const todoList = dbList ? session.todoList = dbList : session.todoList || [];
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(todoList.map((todo, index)=> ({
          id: index,
          description: todo
        }))));
      });
      break;
    case "POST":
      /* check the session for a todoList, if it doesn't exist, create it */
      if (!session.todoList) {
        session.todoList = [];
      }
      /* call convert request to get the data object */
      convertRequest(req, data => {
        session.todoList.push(data.todo);
        nodeTodoDb.addTodo(session.id, data.todo, err => {
          if (err) {
            console.log(err);
            res.writeHead(500, {'Content-Type': 'text/html'});
			      return res.end("500 Internal Server Error");
          }
          res.writeHead(200, 'OK');
          return res.end();
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
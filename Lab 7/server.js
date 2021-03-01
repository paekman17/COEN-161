const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const url = require('url');

const nodeTodo = require('./nodeTodo');

/* Global session variables */
const sessions = {};

/* The HTTP server for the ToDo application */

http.createServer(function(req, res) {
  const pathname = url.parse(req.url).pathname;
  const userSession = getSession(req, res);
  console.log(`Session-${userSession.id}:\n\tPath: ${pathname}\n\tSession Data: ${JSON.stringify(userSession)}\n`);
  if (pathname === '/') {
    return fs.readFile("./index.html", (err, data) => handleReadFile(err, data, res));
  } else if(/\/assets\//.test(pathname)) {
    /* 
      Here, a regular expression is used to match (see: https://www.w3schools.com/jsref/jsref_regexp_test.asp) 
      any path that comes in with the prefix "/assets/" and straight away reads the asset file being requested
    */
    return fs.readFile(`./${pathname}`, (err, data) => handleReadFile(err, data, res));
  } else if(pathname === '/todoList') {
    nodeTodo.handleTodoList(req, res, userSession);
  } else {
    return notFound(res);
  }
}).listen(3000);

/* Helper functions */

function found(res, data) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(data);
  return res.end(); 
}

function generateUniqueId(res) {
  const id = crypto.randomBytes(16).toString("hex");
  if (sessions[id]) {
    return generateUniqueId();
  }
  res.setHeader("Set-Cookie", [`id=${id}; Path=/`]);
  return id;
}

function getSession(req, res) {
  const clientCookies = req.headers.cookie || "";
  const userId = clientCookies.split("; ")
    .map(cookie => cookie.split("="))
    .filter(cookie => cookie[0] === "id")
    .reduce((acc, cookie) => cookie[1], "") || generateUniqueId(res);
  return (sessions[userId] = sessions[userId] || { id: userId });
}

function handleReadFile(err, data, res) {
  if (err) {
    return notFound(res);
  }  
  return found(res, data);
}

function notFound(res) {
  res.writeHead(404, {'Content-Type': 'text/html'});
	return res.end("404 Not Found");
}
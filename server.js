/*
  Creating a basic static file server
*/

var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache ={};
var chatServer = require('./lib/chat_server.js');


//error handle - 404
function send404(response){
	response.writeHead(404,{'Content-Type':'text/plain'});
	response.write('Error 404 : resource not found.');
	response.end();
}


function sendFile(response, filePath, fileContents) {
  response.writeHead(200,{"content-type": mime.lookup(path.basename(filePath))});
  response.end(fileContents);
}


//SENDING FILE DATA AND ERROR RESPONSES
function serveStatic(response, cache, absPath) {
  if (cache[absPath]) { //Check if file is cached in memory
    sendFile(response, absPath, cache[absPath]); //Serve file from memory
  } else {
    fs.exists(absPath, function(exists) { //Check if file exists
      if (exists) {
        fs.readFile(absPath, function(err, data) { //Read file from disk
          if (err) {
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data);//Serve file read from disk
          }
});
} else {
        send404(response); //Send HTTP 404 response

      }
}); }
}

//CREATING THE HTTP SERVER
var server = http.createServer(function(request,response){
	var filePath = false;

	if(request.url == '/'){
		filePath = 'public/index.html'; //Determine HTML file to be served by default
	} else {
		filePath = 'public'+request.url; //Translate URL path to relative file path
	}
	var absPath = './'+filePath;
	serveStatic(response,cache,absPath) //Serve the static file
});

//STARTING THE HTTP SERVER
server.listen(3000,function(){
		console.log("Server listening on port 3000.");
});

chatServer.listen(server);




var http = require("http");
var url = require("url");
var querystring = require('querystring');

function processPost(request, response, callback) {
  var queryData = "";
  if (typeof callback !== 'function') return null;

  if (request.method === 'POST') {
    request.on('data', function (data) {
      queryData += data;
      if (queryData.length > 1e6) {
        queryData = "";
        response.writeHead(413, {'Content-Type': 'text/plain'}).end();
        request.connection.destroy();
      }
    });

    request.on('end', function () {
      request.post = queryData;
      callback();
    });

  } else {
    response.writeHead(405, {'Content-Type': 'text/plain'});
    response.end();
  }
}

var server = http.createServer(function (request, response) {
  if (request.method == 'POST') {
    processPost(request, response, function () {
      console.log('POST');
      // Use request.post here
      response.writeHead(200, "OK", {'Content-Type': 'application/json'});
      response.write(request.post);
      console.log(JSON.parse(request.post))
      response.end();
    });
  } else if (request.method === 'GET') {
    let params = url.parse(request.url, true);
    console.log('GET');
    response.writeHead(200, "OK", {'Content-Type': 'application/json'});
    response.write(JSON.stringify(params.query));
    console.log(JSON.stringify(params.query))
    response.end();
  }
});

server.listen(80);
console.log("Server is listening");

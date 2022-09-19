const http = require('http');

http
  .createServer(function (request: any, response: any) {
    response.setHeader('UserId', 12);
    response.setHeader('Content-Type', 'text/html; charset=utf-8;');
    response.write('<h2>hello world</h2>');
    response.end();
  })
  .listen(process.env.PORT || 5000);

export { http };

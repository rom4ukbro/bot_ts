"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.http = void 0;
const http = require('http');
exports.http = http;
http
    .createServer(function (request, response) {
    response.setHeader('UserId', 12);
    response.setHeader('Content-Type', 'text/html; charset=utf-8;');
    response.write('<h2>hello world</h2>');
    response.end();
})
    .listen(process.env.PORT || 5000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFXcEIsb0JBQUk7QUFUYixJQUFJO0tBQ0QsWUFBWSxDQUFDLFVBQVUsT0FBWSxFQUFFLFFBQWE7SUFDakQsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDakMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztJQUNoRSxRQUFRLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDdkMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLENBQUMsQ0FBQztLQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyJ9
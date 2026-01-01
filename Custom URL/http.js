const http = require("http");

const server = http.createServer((req, res) => {

  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Home Page");
  }

  else if (req.url === "/about" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("About Page");
  }

  else if (req.url === "/contact" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Contact Page");
  }

  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Page Not Found");
  }

});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

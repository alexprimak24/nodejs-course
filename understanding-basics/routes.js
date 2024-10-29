const fs = require("fs");

function requestHandler(req, res) {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>My first page</title></head>");
    //so on form submit we are forwarding to /message
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form></body>"
    );
    res.write("</html>");
    return res.end();
  }
  //so that after filling the form  that code runs as url !== /
  //it will now will be /message
  if (url == "/message" && method === "POST") {
    //we can use const as with .push we are not editing an object itself
    //we are editing the data in the object - not the object!
    const body = [];
    //we created an event listener
    //req.on code will execute after the code below
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      fs.writeFileSync("message.txt", message, (err) => {
        //302 stands for redirect
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end;
      });
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My first page</title></head>");
  res.write("<body><h1>Hello World</h1></body>");
  res.write("</html>");
  res.end();
}

module.exports = requestHandler;

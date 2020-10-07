const express = require("express");
const userRouter = require("./users/userRouter");
const server = express();

server.use(express.json());
server.use(logger("long"));
server.use("/api/users", userRouter);

server.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    message: "Something went wrong, please try again later",
  });
});

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(format) {
  return function (req, res, next) {
    switch (format) {
      case "short":
        console.log(` A ${req.method} has been made to ${req.url}`);
        break;
      case "long":
        // log this info out for every request that comes in before moving on to the route
        const time = new Date().toISOString();
        console.log(`[${time}] ${req.ip} ${req.method} ${req.url}`);
        break;
    }
    next();
  };
}

module.exports = server;

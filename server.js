const express = require("express");
const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter")
const server = express();

server.use(express.json());
server.use(logger("short"));
server.use("/api/users", postRouter);

server.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    message: "Something went wrong, please try again later",
  });
});

server.get("/", (req, res) => {
  res.send(`<h2>Welcome ${process.env.COHORT}!</h2>`);
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

require("dotenv").config();

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception!!! 💣 Shutting down...");
  console.log(err.name, err.message, err);

  server.close(() => {
    process.exit(1);
  });
});

const app = require("./app");

const server = app.listen(process.env.PORT, async () => {
  console.log("Server Started " + process.env.PORT);
  console.log(process.env.NODE_ENV);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection!!! 💥 Server Shutting down...");

  server.close(() => {
    process.exit(1);
  });
});

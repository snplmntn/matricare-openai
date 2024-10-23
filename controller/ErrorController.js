// Handle error if error in development mode
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Handle error if error in production mode
const sendErrorProd = (err, res) => {
  //Operational, trusted error: send to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //Programming or other unknown error
  } else {
    //Log Error
    console.error("ERROR 💥", err);

    //Send message to client
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // if no error code is provided, set it to 500 (Internal Server Error)
  err.status = err.status || "error"; // if no error status is provided, set it to generic "error" message

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    sendErrorProd(error, res);
  }
};

function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  const gatewayError = err.error;
  if (err.statusCode && gatewayError) {
    const description = gatewayError.description || "Razorpay could not process this request.";
    return res.status(502).json({
      success: false,
      message: description,
      provider: "razorpay",
      code: gatewayError.code || "GATEWAY_ERROR",
      upstreamStatus: err.statusCode
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
}

module.exports = { notFound, errorHandler };

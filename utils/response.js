export const successResponse = (
  res,
  message = "Success",
  data = null,
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
};

export const errorResponse = (
  res,
  message = "Something went wrong",
  errors = null,
  statusCode = 500
) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
  });
};
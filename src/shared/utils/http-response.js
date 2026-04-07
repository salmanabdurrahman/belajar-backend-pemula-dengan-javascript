const sendSuccess = (response, statusCode, message, data) => {
  const payload = {
    status: 'success',
    message,
  };

  if (data !== undefined) {
    payload.data = data;
  }

  response.status(statusCode).json(payload);
};

export { sendSuccess };

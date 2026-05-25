/**
 * Standard API response helper
 */
const sendResponse = (res, statusCode, success, message, data = null, meta = null) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString(),
  };

  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;

  return res.status(statusCode).json(response);
};

const successResponse = (res, message, data = null, statusCode = 200, meta = null) => {
  return sendResponse(res, statusCode, true, message, data, meta);
};

const errorResponse = (res, message, statusCode = 400, errors = []) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };
  if (errors.length > 0) response.errors = errors;
  return res.status(statusCode).json(response);
};

const paginatedResponse = (res, message, data, paginationData) => {
  return sendResponse(res, 200, true, message, data, {
    pagination: {
      total: paginationData.totalDocs,
      page: paginationData.page,
      limit: paginationData.limit,
      totalPages: paginationData.totalPages,
      hasNextPage: paginationData.hasNextPage,
      hasPrevPage: paginationData.hasPrevPage,
    },
  });
};

module.exports = { successResponse, errorResponse, paginatedResponse };

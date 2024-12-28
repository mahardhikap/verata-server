const responseCodes = {
    success: {
        code: 200,
        message: "Request successful."
    },
    created: {
        code: 201,
        message: "Data created successfully."
    },
    updated: {
        code: 200,
        message: "Data updated successfully."
    },
    deleted: {
        code: 204,
        message: "Data deleted successfully."
    },
    notFound: {
        code: 404,
        message: "Data not found."
    },
    internalError: {
        code: 500,
        message: "Internal server error."
    },
    badRequest: {
        code: 400,
        message: "Bad request."
    },
    emptyField: {
        code: 400,
        message: "Field cannot be empty."
    },
    unauthorized: {
        code: 401,
        message: "Unauthorized access."
    },
    needToken: {
        code: 401,
        message: "Need valid token."
    },
    forbidden: {
        code: 403,
        message: "Forbidden. You do not have permission."
    },
    conflict: {
        code: 409,
        message: "Conflict. Data already exists."
    },
    unprocessableEntity: {
        code: 422,
        message: "Unprocessable entity. The request was well-formed but could not be processed."
    },
    loginSuccess: {
        code: 200,
        message: "Login successful."
    },
    loginFailed: {
        code: 401,
        message: "Login failed. Invalid username or password."
    },
    accountLocked: {
        code: 403,
        message: "Account is locked due to too many failed login attempts."
    },
    serviceUnavailable: {
        code: 503,
        message: "Service unavailable. Please try again later."
    },
    notImplemented: {
        code: 501,
        message: "Not implemented. The requested functionality is not supported."
    },
    tooManyRequests: {
        code: 429,
        message: "Too many requests. Please slow down."
    }
};

const responseMessage = (type, data) => {
    const responseConfig = responseCodes[type];

    return {
        status: responseConfig.status,
        code: responseConfig.code,
        message: responseConfig.message,
        ...(data ? { data } : {}),
    };
};

module.exports = {responseMessage}
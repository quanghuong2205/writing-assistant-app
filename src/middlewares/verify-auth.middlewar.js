'use strict';

const { findOne } = require('../Repository');
const JWTService = require('../services/jwt.service');
const {
    VERIFY_MISS_ACCESS_TOKEN,
    INVALID_ACCESS_TOKEN,
    VERIFY_MISS_CLIENT_ID,
    VERIFY_MISS_REFRESH_TOKEN,
    INVALID_REFRESH_TOKEN,
} = require('../utils/code');
const ErrorResponse = require('../utils/error.response');

const HTTP_HEADERS = {
    ACCESS_TOKEN: 'x-access-token',
    REFRESH_TOKEN: 'x-refresh-token',
    CLINET_ID: 'x-client-id',
};
const verifyAuthV1 = async (req, res, next) => {
    const cookies = req.cookies;
    const clientID = cookies['user-id'];
    const accessToken = cookies['access-token'];

    /**
     * Verify client id
     */
    if (!clientID) {
        throw new ErrorResponse({
            message: 'Unauthorized',
            code: VERIFY_MISS_CLIENT_ID,
            status: 401,
        });
    }

    /**
     * Verify access token
     */
    if (!accessToken) {
        throw new ErrorResponse({
            message: 'Unauthorized',
            code: VERIFY_MISS_ACCESS_TOKEN,
            status: 401,
        });
    }

    const tokenObject = await findOne({
        where: { user_id: clientID },
        modelName: 'Token',
    });

    /* Invalid token */
    if (!tokenObject) {
        throw new ErrorResponse({
            message: 'Unauthorized',
            code: INVALID_ACCESS_TOKEN,
            status: 401,
        });
    }

    /* Verify token with public key */
    const decodedPayload = await JWTService.verifyToken({
        key: tokenObject.public_key,
        token: accessToken,
    });

    /* Attach to res object */
    req.clientID = clientID;
    req.auth = decodedPayload?.auth ? decodedPayload.auth : 'normal';
    next();
};

const verifyAuthV2 = async (req, res, next) => {
    const cookies = req.cookies;
    const clientID = cookies['user-id'];
    const refreshToken = cookies['refresh-token'];

    /**
     * Verify client id
     */
    if (!clientID) {
        throw new ErrorResponse({
            message: 'Unauthorized',
            code: VERIFY_MISS_CLIENT_ID,
            status: 401,
        });
    }

    /**
     * Verify access token
     */
    if (!refreshToken) {
        throw new ErrorResponse({
            message: 'Unauthorized',
            code: VERIFY_MISS_REFRESH_TOKEN,
            status: 401,
        });
    }

    const tokenObject = await findOne({
        where: { user_id: clientID },
        modelName: 'Token',
    });

    /* Invalid token */
    if (!tokenObject) {
        throw new ErrorResponse({
            message: 'Unauthorized',
            code: INVALID_REFRESH_TOKEN,
            status: 401,
        });
    }

    /* Verify token with public key */
    const decodedPayload = await JWTService.verifyToken({
        key: tokenObject.private_key,
        token: refreshToken,
    });

    /* Attach to res object */
    req.clientID = clientID;
    req.auth = decodedPayload?.auth ? decodedPayload.auth : 'normal';
    next();
};

module.exports = { verifyAuthV1, verifyAuthV2 };

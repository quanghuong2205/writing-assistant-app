'use strict';

const { SIGN_TOKEN_FAIL, INVALID_TOKEN } = require('../utils/code');
const ErrorResponse = require('../utils/error.response');
const jwt = require('jsonwebtoken');

class JWTService {
    static async signToken({ payload, key, type }) {
        try {
            /* Sign the token */
            const token = await jwt.sign(payload, key, {
                expiresIn:
                    type.toUpperCase() === 'ACCESSTOKEN' ? '1h' : '1day',
            });

            /* Verify token */
            await JWTService.verifyToken({
                token,
                key,
            });

            /* Return token */
            return token;
        } catch (error) {
            throw new ErrorResponse({
                code: SIGN_TOKEN_FAIL,
            });
        }
    }

    static async verifyToken({ key, token }) {
        try {
            const decodedPayload = await jwt.verify(token, key);
            return decodedPayload;
        } catch (error) {
            throw new ErrorResponse({
                message: 'Unauthorize',
                status: 403,
                code: INVALID_TOKEN,
            });
        }
    }
}

module.exports = JWTService;

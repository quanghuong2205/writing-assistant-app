'use strict';

const SQLRepo = require('../Repository');
const { decodeJWT } = require('../utils');
const ErrorResponse = require('../utils/error.response');
const JWTService = require('./jwt.service');
const OAuthService = require('./oauth.service');
const crypto = require('crypto');
const { NOT_VERIFY_EMAIL } = require('../utils/code');

class AuthService {
    static async SignInByOauth({ oauthCode }) {
        /* Get accessToken by Oauth based on provided auth code */
        const {
            accessToken: oauthAccessToken,
            refreshToken: oauthRefreshToken,
            accessTokenExpireIn,
            tokenID,
        } = await OAuthService.getTokens({
            oauthCode,
        });

        /* Decode and check if user'email has been verified */
        const { email_verified } = decodeJWT({ token: tokenID });
        if (!email_verified) {
            /* Email not verify */
            throw new ErrorResponse({
                message: 'Email is not verify',
                status: 403,
                code: NOT_VERIFY_EMAIL,
            });
        }

        /* Get user infor by Oauth */
        const { name, picture, email, sub } =
            await OAuthService.GetUserInfor({
                accessToken: oauthAccessToken,
            });

        /* Update user infor in the database */
        await SQLRepo.updateOrCreate({
            where: { id: sub },
            props: {
                id: sub,
                name,
                email,
                avatar_url: picture,
            },
            modelName: 'User',
        });

        /* Update oauth infor in the database */
        await SQLRepo.updateOrCreate({
            where: { user_id: sub },
            props: {
                user_id: sub,
                access_token: oauthAccessToken,
                refresh_token: oauthRefreshToken,
                id_token: tokenID,
                expire_in: accessTokenExpireIn,
            },
            modelName: 'Oauth',
        });

        /* Generate token pair (access + refresh token) */
        const privateKey = crypto.randomBytes(16).toString();
        const publicKey = crypto.randomBytes(16).toString();
        const accessToken = await JWTService.signToken({
            payload: {
                name,
                email,
                auth: 'oauth',
            },
            type: 'accessToken',
            key: publicKey,
        });

        const refreshToken = await JWTService.signToken({
            payload: {
                name,
                email,
                auth: 'oauth',
            },
            type: 'refreshToken',
            key: privateKey,
        });

        /* Save token to the database */
        await SQLRepo.updateOrCreate({
            where: { user_id: sub },
            props: {
                user_id: sub,
                public_key: publicKey,
                private_key: privateKey,
                refresh_token: refreshToken,
            },
            modelName: 'Token',
        });

        /* Return to client */
        return {
            accessToken,
            refreshToken,
            user: {
                id: sub,
                email,
                name,
                avatar_url: picture,
            },
        };
    }
}

module.exports = AuthService;

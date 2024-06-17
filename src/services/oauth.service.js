'use strict';

const {
    OAUTH_INVALID_AUTH_CODE,
    OAUTH_INVALID_ACCESS_TOKEN,
    OAUTH_INVALID_REFRESH_TOKEN,
} = require('../utils/code');
const ErrorResponse = require('../utils/error.response');

require('dotenv').config();
const config = require('../config')();

class OAuthService {
    static async getTokens({ oauthCode }) {
        /* Init params */
        const params = {
            client_id: config.oauth.clientID,
            client_secret: config.oauth.clientSecret,
            redirect_uri: config.oauth.redirectUrl,
            access_type: config.oauth.accessType,
            grant_type: 'authorization_code',
            code: oauthCode,
        };

        const encodedParamString = new URLSearchParams(params).toString();

        /* Post */
        const response = await fetch(
            `${process.env.OAUTH_BASE_ENDPOINT}/token`,
            {
                method: 'POST',
                body: encodedParamString,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const data = await response.json();

        if (data?.error) {
            throw new ErrorResponse({
                message: 'authorization_code is not valid',
                code: OAUTH_INVALID_AUTH_CODE,
                status: 401,
            });
        }

        /* Handle data before return */
        const result = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            accessTokenExpireIn:
                Math.floor(Date.now() / 1000) + data.expires_in,
            tokenID: data.id_token,
        };

        return result;
    }

    static async ResetAccessToken({ refreshToken }) {
        /* Init params */
        const params = {
            client_id: config.oauth.clientID,
            client_secret: config.oauth.clientSecret,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        };

        const encodedParamString = new URLSearchParams(params).toString();

        /* Post */
        const response = await fetch(
            `https://oauth2.googleapis.com/token`,
            {
                method: 'POST',
                body: encodedParamString,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const data = await response.json();

        /* Got an error */
        if (data?.error) {
            throw new ErrorResponse({
                message: 'Refresh token is not valid',
                code: OAUTH_INVALID_REFRESH_TOKEN,
                status: 401,
            });
        }

        /* Handle data before return */
        const result = {
            accessToken: data.access_token,
            accessTokenExpireIn: Date.now() / 1000 + data.expires_in,
            tokenID: data.id_token,
        };

        return result;
    }

    static async GetUserInfor({ accessToken }) {
        /* Post */
        const response = await fetch(
            `https://www.googleapis.com/oauth2/v3/userinfo`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        /**
         * Get user infor by Oauth
         *  {
         *      "sub": "113396267234976612415",
         *      "name": "Quang Hướng",
         *      "given_name": "Quang Hướng",
         *      "picture": "url"
         *      "email": "quanghuong.dev@gmail.com",
         *      "email_verified": true,
         *       "locale": "vi"
         *  }
         */
        const data = await response.json();

        /* Got an error */
        if (data?.error) {
            throw new ErrorResponse({
                message: 'Access token is not valid',
                code: OAUTH_INVALID_ACCESS_TOKEN,
                status: 401,
            });
        }

        return data;
    }
}

module.exports = OAuthService;

'use strict';

const SQLRepo = require('../Repository');
const OAuthService = require('../services/oauth.service');
const { isExpired } = require('../utils');

const checkOauth = async (req, res, next) => {
    if (req.auth !== 'oauth') {
        next();
    }

    /**
     * Check access token expires
     */
    const oauth = await SQLRepo.findOne({
        where: { user_id: req.clientID },
        modelName: 'Oauth',
    });

    const expireTime = oauth.expire_in;
    const isExpiredToken = isExpired({
        expireIn: expireTime,
    });

    /* Token is not expire */
    if (!isExpiredToken) {
        return next();
    }

    /**
     * Reset the new access token
     */
    const { accessToken, accessTokenExpireIn, tokenID } =
        await OAuthService.ResetAccessToken({
            refreshToken: oauth.refresh_token,
        });

    /* Update the oauth to the database */
    await SQLRepo.updateOrCreate({
        props: {
            access_token: accessToken,
            id_token: tokenID,
            expire_in: accessTokenExpireIn,
        },
        where: { user_id: req.clientID },
        modelName: 'Oauth',
    });

    /* Next */
    next();
};

module.exports = checkOauth;

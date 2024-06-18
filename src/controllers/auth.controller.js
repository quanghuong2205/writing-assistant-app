'use strict';

const SQLRepo = require('../Repository');
const AuthService = require('../services/auth.service');
const getConfig = require('../config');

const config = getConfig();

class AuthController {
    static async SignInByOauth(req, res, next) {
        console.log(config.client.domain);
        if (req.query?.error || !req.query?.code) {
            return res.redirect(`https://${config.client.domain}/login`);
        }

        const { accessToken, refreshToken, user } =
            await AuthService.SignInByOauth({
                oauthCode: req.query.code,
            });

        res.cookie('access-token', accessToken, {
            domain: config.client.domain,
            secure: true,
        });
        // res.cookie('refresh-token', refreshToken, {
        //     domain: config.client.domain,
        // });
        // res.cookie('user-id', user?.id, {
        //     domain: config.client.domain,
        // });
        // res.cookie('user-name', user?.name, {
        //     domain: config.client.domain,
        // });
        // res.cookie('user-avatar', user?.avatar_url, {
        //     domain: config.client.domain,
        // });
        // res.cookie('user-email', user?.email, {
        //     domain: config.client.domain,
        // });

        res.redirect(`https://${config.client.domain}/home`);
    }

    static async SignOut(req, res, next) {
        /* Clear cookie */
        res.clearCookie('access-token', {
            domain: config.client.domain,
            secure: true,
        });
        res.clearCookie('refresh-token', {
            domain: config.client.domain,
            secure: true,
        });
        res.clearCookie('user-id', {
            domain: config.client.domain,
            secure: true,
        });

        /* Delete token from database */
        await SQLRepo.deleteOne({
            where: {
                user_id: req.clientID,
            },

            modelName: 'Token',
        });

        /* Redirect to logjn */
        return res.redirect(`https://${config.client.domain}/login`);
    }

    static async getUser(req, res, next) {
        res.status(200).json({
            status: 200,
            code: 200,
            body: await SQLRepo.findOne({
                where: {
                    id: req?.clientID || '113396267234976612415',
                },

                modelName: 'User',
            }),
            message: 'Have got user information successfully',
        });
    }
}

module.exports = AuthController;

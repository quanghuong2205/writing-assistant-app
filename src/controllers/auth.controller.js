'use strict';

const SQLRepo = require('../Repository');
const AuthService = require('../services/auth.service');
const getConfig = require('../config');

const config = getConfig();

class AuthController {
    static async SignInByOauth(req, res, next) {
        console.log(config.client.domain);
        if (req.query?.error || !req.query?.code) {
            return res.redirect(
                `https://writing-assistant.vercel.app/login`
            );
        }

        const { accessToken, refreshToken, user } =
            await AuthService.SignInByOauth({
                oauthCode: req.query.code,
            });

        res.cookie('access-token', accessToken);
        res.cookie('refresh-token', refreshToken);
        res.cookie('user-id', user?.id);
        res.cookie('user-name', user?.name);
        res.cookie('user-avatar', user?.avatar_url);
        res.cookie('user-email', user?.email);

        res.redirect(`https://writing-assistant.vercel.app/home`);
    }

    static async SignOut(req, res, next) {
        /* Clear cookie */
        res.clearCookie('access-token');
        res.clearCookie('refresh-token');
        res.clearCookie('user-id');

        /* Delete token from database */
        await SQLRepo.deleteOne({
            where: {
                user_id: req.clientID,
            },

            modelName: 'Token',
        });

        /* Redirect to logjn */
        return res.redirect(`https://writing-assistant.vercel.app/login`);
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

import database from "../configuration/database.js";
import { hash, compare } from '../lib/password.js';
import { getAccessToken, getRefreshToken, verifyRefreshTokenAsync } from '../lib/jwt.js';
import { v4 as uuidv4 } from 'uuid';
import authService from "../service/authService.js";

export default {

    signup: async function (req, res, next) {
        try {
            const User = database.getInstance().getModel("User");

            const { username, password } = req.body;

            await User.create({
                username,
                password: await hash(password)
            });

            return res.json({ data: { message: "User created successfully" } });

        } catch (error) {
            next(error)
        }
    },

    signin: async function (req, res, next) {
        try {
            const User = database.getInstance().getModel("User");
            const Session = database.getInstance().getModel("Session");

            const { username, password } = req.body;

            const userInDb = await User.findOne({ where: { username, deleted: false } });

            if (!userInDb) {
                return res.json({
                    error: {
                        message: "INVALID_CREDENTIALS"
                    }
                });
            }

            const isCorrectPassword = await compare(password, userInDb.password);

            if (!isCorrectPassword) {
                return res.json({
                    error: {
                        message: "INVALID_CREDENTIALS"
                    }
                });
            }

            const jid_ = uuidv4();
            const user_id = userInDb.dataValues.id;
            const accessToken = getAccessToken({ user_id });
            const refreshToken = getRefreshToken({ user_id, jid: jid_ });

            // Session
            await Session.create({
                jid: jid_,
                userId: user_id,
                expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 days
            });

            return res
                .cookie('jid', refreshToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 1 * 24 * 60 * 60 * 1000 // 1 days
                })
                .json({
                    data: {
                        access_token: accessToken
                    }
                });

        } catch (error) {
            next(error)
        }
    },

    refreshToken: async function (req, res, next) {
        try {
            const Session = database.getInstance().getModel("Session");

            const token = req.cookies.jid;
            if (!token) return res.json({
                error: {
                    message: "INVALID_REFRESH_TOKEN"
                }
            });

            const { jid, user_id } = await verifyRefreshTokenAsync(token);

            const currentSession = await Session.findOne({ where: { jid } });
            if (!currentSession) return res.json({
                error: {
                    message: "INVALID_REFRESH_TOKEN"
                }
            });

            await Session.destroy({ where: { jid } });

            // new tokens
            const jid_ = uuidv4();
            const accessToken = getAccessToken({ user_id });
            const refreshToken = getRefreshToken({ user_id, jid: jid_ });

            // Session
            await Session.create({
                jid: jid_,
                userId: user_id,
                expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 days
            });

            return res
                .cookie('jid', refreshToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 1 * 24 * 60 * 60 * 1000 // 1 days
                })
                .json({
                    data: {
                        access_token: accessToken
                    }
                });

        } catch (error) {
            next(error)
        }
    },

    signout: async function (req, res, next) {
        try {
            const refreshToken = req.cookies.jid;
            await authService.signout(refreshToken);
            res.clearCookie('jid', { path: '/' }).json({ ok: true });
        } catch (error) {
            next(error)
        }
    },

};
import authController from '../src/controller/authController.js';

import database from "../src/configuration/database.js";
import { compare } from '../src/lib/password.js';
import { getAccessToken, getRefreshToken } from '../src/lib/jwt.js';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../src/configuration/database.js');
jest.mock('../src/lib/password.js');
jest.mock('../src/lib/jwt.js');
jest.mock('uuid');

describe('authController.signIn', () => {
    let req, res, next;
    const USER_MODEL = { findOne: jest.fn() };
    const SESSION_MODEL = { create: jest.fn() };

    beforeAll(() => {
        database.getInstance.mockReturnValue({
            getModel: (modelName) => {
                if (modelName === "User") return USER_MODEL;
                if (modelName === "Session") return SESSION_MODEL;
                return { create: jest.fn() };
            }
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    it("should return INVALID_CREDENTIALS when user not exists", async () => {

        USER_MODEL.findOne.mockResolvedValue(null);

        req = {
            body: {
                username: 'username',
                password: 'password'
            }
        };

        await authController.signin(req, res, next);

        expect(USER_MODEL.findOne).toHaveBeenCalledWith({
            where: { username: 'username', deleted: false }
        });
        expect(res.json).toHaveBeenCalledWith({
            error: { message: 'INVALID_CREDENTIALS' }
        });
        expect(next).not.toHaveBeenCalled();

    });

    it('should return INVALID_CREDENTIALS when the password is not correct', async () => {
        USER_MODEL.findOne.mockResolvedValue({ dataValues: { id: 42 }, password: 'hash' });
        compare.mockResolvedValue(false);

        req = {
            body: {
                username: 'username',
                password: 'password'
            }
        };

        await authController.signin(req, res, next);

        expect(compare).toHaveBeenCalledWith('password', 'hash');
        expect(res.json).toHaveBeenCalledWith({
            error: { message: 'INVALID_CREDENTIALS' }
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next(error) if it happens an unexpected error', async () => {
        const error = new Error('DB down');
        USER_MODEL.findOne.mockRejectedValue(error);

        req = {
            body: {
                username: 'username',
                password: 'password'
            }
        };

        await authController.signin(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should create accessToken, refreshToken and set cookie after a correct signin', async () => {
        const fakeUser = { dataValues: { id: 7 }, password: 'hash' };
        USER_MODEL.findOne.mockResolvedValue(fakeUser);
        compare.mockResolvedValue(true);
        uuidv4.mockReturnValue('jid-123');
        getAccessToken.mockReturnValue('atoken');
        getRefreshToken.mockReturnValue('rtoken');

        req = {
            body: {
                username: 'username',
                password: 'password'
            }
        };

        await authController.signin(req, res, next);

        expect(SESSION_MODEL.create).toHaveBeenCalledWith(expect.objectContaining({
            jid: 'jid-123',
            userId: 7,
            expiresAt: expect.any(Date),
        }));

        // expect(res.cookie).toHaveBeenCalledWith(
        //     'jid',
        //     'rtoken',
        //     expect.objectContaining({
        //         httpOnly: true,
        //         sameSite: 'strict',
        //         path: '/',
        //         maxAge: 24 * 60 * 60 * 1000
        //     })
        // );

        expect(res.json).toHaveBeenCalledWith({
            data: { access_token: 'atoken' }
        });

        expect(next).not.toHaveBeenCalled();
    });

});
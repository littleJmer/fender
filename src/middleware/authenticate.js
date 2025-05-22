import * as jwt from '../lib/jwt.js';

export const authenticate = async (req, res, next) => {
    try {
        const token = req?.headers?.authorization?.split(' ')?.[1];
        if (token) {
            const decoded = await jwt.verifyTokenAsync(token);

            // 1) check user status in db

            req.session = decoded;
            next();
        } else {
            return res.send(401, 'Missing Authorization Header');
        }
    } catch (error) {
        console.log(error);
        if (error.name === 'TokenExpiredError') {
            return res.send(401, 'Protected resource, token expired')
        }
        return res.send(401, 'Missing Authorization Header');
    }
}
import jsonwebtoken from 'jsonwebtoken'

export const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
export const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

export const getAccessToken = (data) => {
    return jsonwebtoken.sign(data, accessTokenSecret, { expiresIn: '1m' });
};

export const verifyTokenAsync = (token) => new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) reject(err)
        else resolve(decoded);
    });
});

export const getRefreshToken = (data) => {
    return jsonwebtoken.sign(data, refreshTokenSecret, { expiresIn: '1d' });
};

export const verifyRefreshTokenAsync = (token) => new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, refreshTokenSecret, (err, decoded) => {
        if (err) reject(err)
        else resolve(decoded);
    });
});
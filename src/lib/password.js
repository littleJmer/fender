import bcrypt from 'bcrypt';
const saltRounds = 10;

// Hash a password
export const hash = (plainPassword) => new Promise((resolve, reject) => {
    bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
    });
});

// Compare a password with its hash
export const compare = (password, _hash) => new Promise((resolve, reject) => {
    bcrypt.compare(password, _hash, (err, result) => {
        if (err) reject(err);
        if (result) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
});
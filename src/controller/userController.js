import database from "../configuration/database.js";
import authService from "../service/authService.js";

export default {

    get: async function (req, res, next) {
        try {
            const User = database.getInstance().getModel("User");

            const { user_id } = req.session;

            const result = await User.findOne({ where: { id: user_id } });

            return res.json({
                data: {
                    firstName: result.firstName,
                    lastName: result.lastName,
                    email: result.email,
                }
            });

        } catch (error) {
            next(error)
        }
    },

    update: async function (req, res, next) {
        try {
            const User = database.getInstance().getModel("User");

            const { user_id } = req.session;

            const allowedFields = [
                "firstName",
                "lastName",
                "email"
            ];

            const newValues = {};

            for (const fieldName of allowedFields) {
                if (fieldName in req.body) {
                    newValues[fieldName] = req.body[fieldName];
                }
            }

            await User.update(newValues, { where: { id: user_id } });

            return res.json({
                data: {
                    message: "User updated successfully."
                }
            });

        } catch (error) {
            next(error)
        }
    },

    delete: async function (req, res, next) {
        try {
            const User = database.getInstance().getModel("User");

            const { user_id } = req.session;

            const userInDb = await User.findOne({ where: { id: user_id } });

            userInDb.deleted = true;
            await userInDb.save();

            const refreshToken = req.cookies.jid;
            await authService.signout(refreshToken);

            res.clearCookie('jid', { path: 'refresh-token' }).json({ ok: true });
        } catch (error) {
            next(error)
        }
    }

};
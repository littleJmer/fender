import database from "../configuration/database.js";
import { verifyRefreshTokenAsync } from '../lib/jwt.js';

export default {

    signout: async function (refreshToken) {
        try {
            const Session = database.getInstance().getModel("Session");
            if (refreshToken) {
                const { jid } = await verifyRefreshTokenAsync(refreshToken);
                await Session.destroy({ where: { jid } });
            }
            return {};
        } catch (error) {
            return { error }
        }
    }

};
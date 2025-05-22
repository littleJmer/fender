import { Model, DataTypes } from 'sequelize';

export default (sequelizeConnection) => {

    class Session extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Session.init(
        {
            jid: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            expiresAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize: sequelizeConnection,
            modelName: 'Session'
        }
    );
    return Session;
};
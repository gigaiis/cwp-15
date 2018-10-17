module.exports = (Sequelize, sequelize) => {
    return sequelize.define('managers', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        fleetId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        super: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        }
    });
};
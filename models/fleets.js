module.exports = (Sequelize, sequelize) => {
    return sequelize.define('fleets', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: Sequelize.STRING }
    });
};
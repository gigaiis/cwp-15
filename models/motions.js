module.exports = (Sequelize, sequelize) => {
    return sequelize.define('motions', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        latitude: { type: Sequelize.DOUBLE },
        longitude: { type: Sequelize.DOUBLE },
        time: { type: Sequelize.DATE },
        vehicleId: { type: Sequelize.INTEGER }
    },
        {
            getterMethods: {
                latLng() {
                    return {
                        latitude: this.latitude,
                        longitude: this.longitude
                    }
                },
                latLngTime() {
                    return {
                        lat: this.latitude,
                        lng: this.longitude,
                        time: this.time
                    }
                }
            }
        });
}
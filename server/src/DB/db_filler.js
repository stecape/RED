module.exports = function () {
  return new Promise((innerResolve, reject) => {

    const { Sequelize, DataTypes } = require('sequelize');
    const db_config = require('./db_config')

    const sequelize = new Sequelize(db_config.db_name, db_config.db_user, db_config.db_password, {
      host: db_config.db_host,
      port: db_config.db_port,
      dialect: db_config.db_dialect
    });

    //Models definition and tables filling, done just the first time 
    const Tag = sequelize.define('Tag', {
      // Model attributes are defined here
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      // Other model options go here
    });

    const Connection = sequelize.define('Connection', {
      // Model attributes are defined here
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      partner: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      // Other model options go here
    });

    const RT = sequelize.define('RT', {
      // Model attributes are defined here
      value: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
        allowNull: false
      }
    }, {
    })

    //Relations def
    Connection.hasMany(Tag)
    Tag.belongsTo(Connection)

    Tag.hasOne(RT)
    RT.belongsTo(Tag)

    //Tables filling
    sequelize.sync({ force: true }).then(() => {
      console.log('Sync done');
      Connection.create({ name: 'Mqtt_1', type: 'mqtt', partner: 'PLC1' })
      Connection.create({ name: 'Mqtt_2', type: 'mqtt', partner: 'PLC2' })
      Connection.create({ name: 'Mqtt_3', type: 'mqtt', partner: 'PLC3' })
      Tag.create({ name: 'Speed', type: 'udtSetAct', ConnectionId: 2 })
      RT.create({ value: 2.0, TagId: 1 }).then(() => innerResolve())

    }).catch(err => {
      console.error('Something went wrong syncing:', err);
    })

  })
}
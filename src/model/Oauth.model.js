'use strict';
const User = require('./User.model');
const { DataTypes } = require('sequelize');
const DBConnector = require('../helper/db-connector.helper');
const connector = DBConnector.getConnector();

const Oauth = connector.define(
    'Oauth',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },

        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        access_token: {
            type: DataTypes.STRING,
            defaultValue: '',
        },

        refresh_token: {
            type: DataTypes.STRING,
            defaultValue: '',
        },

        id_token: {
            type: DataTypes.STRING,
            defaultValue: '',
        },

        expire_in: {
            type: DataTypes.BIGINT,
        },
    },
    {
        timestamps: true,
        tableName: 'Oauth',
        underscored: true,
    }
);

Oauth.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Oauth, { foreignKey: 'user_id' });

module.exports = Oauth;

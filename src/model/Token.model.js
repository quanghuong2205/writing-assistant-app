'use strict';
const User = require('./User.model');
const { DataTypes } = require('sequelize');
const DBConnector = require('../helper/db-connector.helper');
const connector = DBConnector.getConnector();

const Token = connector.define(
    'Token',
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

        public_key: {
            type: DataTypes.STRING,
            defaultValue: '',
        },

        private_key: {
            type: DataTypes.STRING,
            defaultValue: '',
        },

        refresh_token: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
    },
    {
        timestamps: true,
        tableName: 'Token',
        underscored: true,
    }
);

Token.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Token, { foreignKey: 'user_id' });

module.exports = Token;

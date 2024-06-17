'use strict';
const { DataTypes } = require('sequelize');
const DBConnector = require('../helper/db-connector.helper');
const connector = DBConnector.getConnector();

const History = connector.define(
    'History',
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

        inputText: {
            type: DataTypes.STRING,
        },

        outputText: {
            type: DataTypes.TEXT('long'),
        },

        type: {
            type: DataTypes.ENUM(
                'paraphrase',
                'text-completion',
                'grammar-checking',
                'plagiarism-checking'
            ),
        },
    },
    {
        timestamps: true,
        tableName: 'History',
        underscored: true,
    }
);

module.exports = History;

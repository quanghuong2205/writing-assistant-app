'use strict';

const getConfig = require('../config');
const axios = require('axios');

class GoogleService {
    static async search({ query }) {
        const config = getConfig();
        const { searchKey, searchCx } = config['google'];

        const url = `https://www.googleapis.com/customsearch/v1?key=${searchKey}&cx=${searchCx}&q=${query}`;

        const response = await axios.get(url);

        return response.data.items;
    }
}

module.exports = GoogleService;

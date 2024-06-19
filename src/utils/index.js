'use strict';
const stringSimilarity = require('string-similarity');
const puppeteer = require('puppeteer');

const JWTDecode = require('jwt-decode');

const decodeJWT = ({ token }) => {
    return JWTDecode.jwtDecode(token);
};

const isExpired = ({ expireIn }) => {
    return expireIn - Math.floor(Date.now() / 1000) <= 0;
};

const extractTextFromHtml = async ({ url }) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            ignoreHTTPSErrors: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--single-process',
            ],
        });

        const page = await browser.newPage();
        await page.goto(url, {
            timeout: 60000 * 3,
        });

        const extractedText = await page.$eval('*', (el) => el.innerText);

        await browser.close();
    } catch (error) {
        console.log('Out time');
    }

    return extractedText;
};

const getSimilarity = ({ firstText, secondText }) => {
    const similarity = stringSimilarity.compareTwoStrings(
        firstText,
        secondText
    );

    return similarity * 100;
};

module.exports = {
    decodeJWT,
    isExpired,
    extractTextFromHtml,
    getSimilarity,
};

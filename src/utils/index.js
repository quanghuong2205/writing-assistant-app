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
    const page = (await browser.pages())[0];
    await page.goto(url);
    const extractedText = await page.$eval('*', (el) => el.innerText);

    await browser.close();

    return extractedText;
};

const getSimilarity = ({ firstText, secondText }) => {
    const similarity = stringSimilarity.compareTwoStrings(
        firstText,
        secondText
    );

    console.log('simi::', similarity);

    return similarity * 100;
};

module.exports = {
    decodeJWT,
    isExpired,
    extractTextFromHtml,
    getSimilarity,
};

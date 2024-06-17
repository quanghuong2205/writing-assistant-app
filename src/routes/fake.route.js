'use strict';
const express = require('express');
const SQLRepo = require('../Repository');
const fakeRouter = express.Router();

fakeRouter.post('/grammar-checker', async (req, res, next) => {
    if (!req.body?.text) {
        throw new ErrorResponse({
            message: 'Please provide the text input to check',
            status: 403,
            code: 1,
        });
    }

    return res.json({
        status: 200,
        code: 4953,
        body: {
            originalText:
                "Last weak, I goed to the store but I couldn't find there what I was looking four. I seen many peoples walking around, but nobody helped me. Finally, I founded what I wanted in a different aisle, but it taked me a long time. I'm glad I founded it though!",
            fixedText:
                "Last week, I went to the store but I couldn't find what I was looking for there. I saw many people walking around, but nobody helped me. Finally, I found what I wanted in a different aisle, but it took me a long time. I'm glad I found it though!",
            errors: [
                {
                    word: 'weak',
                    suggestion: 'week',
                },
                {
                    word: 'goed',
                    suggestion: 'went',
                },
                {
                    word: 'four',
                    suggestion: 'for',
                },
                {
                    word: 'seen',
                    suggestion: 'saw',
                },
                {
                    word: 'peoples',
                    suggestion: 'people',
                },
                {
                    word: 'founded',
                    suggestion: 'found',
                },
                {
                    word: 'taked',
                    suggestion: 'took',
                },
                {
                    word: 'founded',
                    suggestion: 'found',
                },
            ],
        },
        message:
            'Grammar checker has been correct the text input successfully',
    });
});

fakeRouter.post('/paraphrase', async (req, res, next) => {
    if (!['shorten', 'expand'].includes(req.body.form)) {
        throw new ErrorResponse({
            message: 'Provide form to paraphrase:: shorten or expand',
        });
    }

    if (!req.body?.text) {
        throw new ErrorResponse({
            message: 'Please provide the text input to check',
            status: 403,
            code: 1,
        });
    }

    return res.json({
        status: 200,
        code: 4954,
        body: {
            text: "Technology's evolution has transformed our lives, making communication, work, and entertainment easier. Smartphones and the internet provide access to information and services. However, they also pose challenges like misinformation, privacy, and mental health impacts. Navigating these responsibly is crucial.",
            versions: [
                'Advancements in technology have revolutionized our daily routines, simplifying communication, work, and entertainment. Smartphones and the internet offer easy access to information and services. Nonetheless, they present issues such as misinformation, privacy concerns, and impacts on mental well-being. It is essential to navigate these challenges prudently.',
                'The progress of technology has changed the way we live, streamlining communication, work, and leisure activities. Smartphones and the internet grant us access to a wealth of information and services. Nevertheless, they bring about challenges like misinformation, privacy issues, and effects on mental health. It is vital to handle these responsibly.',
                'The evolution of technology has had a significant impact on our lives, streamlining communication, work, and entertainment. Smartphones and the internet facilitate access to information and services. Despite their benefits, they come with challenges such as misinformation, privacy concerns, and mental health implications. It is important to address these responsibly.',
                'The development of technology has revolutionized our lifestyles, making communication, work, and entertainment more convenient. Smartphones and the internet enable easy access to information and services. However, they also present challenges like misinformation, privacy issues, and impacts on mental health. It is crucial to navigate these responsibly.',
            ],
        },
        message: 'The input text has been paraphrased successfully',
    });
});

fakeRouter.post('/text-completion', async (req, res, next) => {
    if (!req.body.text) {
        throw new ErrorResponse({
            message: 'Provide text to complete',
        });
    }

    return res.json({
        status: 200,
        code: 4959,
        body: {
            text: 'I am an student. I like playing football with my friend. Whenever I try to learn something, I usually feel hard to put in practice, so I ',
            versions: [
                "keep practicing until I get it right. It's important to stay persistent and never give up. With determination and effort, I can overcome any challenges.",
                "ask for help from someone who is experienced in the field. Learning from others can make the process easier and more efficient. It's okay to seek guidance and support.",
                'break down the task into smaller steps. By taking it one step at a time, I can make progress and gradually improve my skills.',
            ],
        },
        message: 'Has been completed successfully',
    });
});

module.exports = fakeRouter;

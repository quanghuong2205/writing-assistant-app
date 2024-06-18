'use strict';
const express = require('express');
const assistantRouter = express.Router();
const errorCatcher = require('../utils/error-catcher');
const AssistantController = require('../controllers/assistant.controller');
const User = require('../model/User.model');

assistantRouter.use(async (req, res, next) => {
    const user = await User.findOne({
        order: [['updated_at', 'DESC']],
    });

    req.clientID = user?.id;
    next();
});

assistantRouter.get(
    '/test',
    errorCatcher((req, res, next) => {
        res.send('Test here');
    })
);

assistantRouter.post(
    '/grammar-checker',
    errorCatcher(AssistantController.grammarChecker)
);

assistantRouter.post(
    '/paraphrase',
    errorCatcher(AssistantController.paraphrase)
);

assistantRouter.post(
    '/text-completion',
    errorCatcher(AssistantController.textCompletion)
);

assistantRouter.post(
    '/plagiarism-checker',
    errorCatcher(AssistantController.plagiarismChecker)
);

assistantRouter.post('/save', errorCatcher(AssistantController.save));

module.exports = assistantRouter;

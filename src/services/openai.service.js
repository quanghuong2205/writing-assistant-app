'use strict';

const { OPENAI_OUT_OF_TOKEN } = require('../utils/code');
const ErrorResponse = require('../utils/error.response');

const FUNCTION_CALLING = {
    GRAMMAR_CHECKER: {
        name: 'correct_english_grammar',
        description:
            'Correct English grammar or spelling errors based on the provided text input',
        parameters: {
            type: 'object',
            properties: {
                originalText: {
                    type: 'string',
                    description: 'The provided text input',
                },
                fixedText: {
                    type: 'string',
                    description: 'The corrected version of text input',
                },
                errors: {
                    type: 'array',
                    description: 'An array of objects representing errors',
                    items: {
                        type: 'object',
                        properties: {
                            word: {
                                type: 'string',
                                description: 'The incorrect word',
                            },
                            suggestion: {
                                type: 'string',
                                description:
                                    'The suggested replacement for the error word',
                            },
                        },
                        required: ['word', 'suggestion'],
                    },
                },
            },
            required: ['originalText', 'fixedText', 'errors'],
        },
    },

    TEXT_COMPLETION: {
        name: 'text_completion',
        description:
            'Given an English input text, You are tasked with completing the input text with generated sentences.',
        parameters: {
            type: 'object',
            properties: {
                text: {
                    type: 'string',
                    description: 'The provided text input',
                },
                versions: {
                    type: 'array',
                    description:
                        'An array of suggested completions for the text input. There must have 3 completion versions at least',
                    items: {
                        type: 'string',
                        description:
                            'The suggested completion for the text input. The completion should be at least 18 words',
                    },
                },
            },
            required: [],
        },
    },

    PARAPHRASE_NARROW: {
        name: 'paraphrase',
        description:
            'Given an English input text, You are tasked with providing several paraphrased versions of the input text. The paraphrased version must be half the length of the input text',
        parameters: {
            type: 'object',
            properties: {
                text: {
                    type: 'string',
                    description: 'The provided text input',
                },
                versions: {
                    type: 'array',
                    description:
                        'An array of paraphrased versions for the text input. The length of array should be greater than 2',
                    items: {
                        type: 'string',
                        description:
                            'The paraphrased versiont for the text input.',
                    },
                },
            },
            required: [],
        },
    },

    PARAPHRASE_EXPAND: {
        name: 'paraphrase',
        description:
            'Given an English input text, You are tasked with providing several paraphrased versions of the input text. The paraphrased version must be twice as long as the original one',
        parameters: {
            type: 'object',
            properties: {
                text: {
                    type: 'string',
                    description: 'The provided text input',
                },
                versions: {
                    type: 'array',
                    description:
                        'An array of paraphrased versions for the text input. The length of array should be greater than 2',
                    items: {
                        type: 'string',
                        description:
                            'The paraphrased versiont for the text input.',
                    },
                },
            },
            required: [],
        },
    },
};

const openAI = require('../config')().openai;

class OpenAIService {
    static async checkGrammar({ text }) {
        /* Promt */
        const messages = [
            {
                role: 'user',
                content: `The provided text input: "${text}"`,
            },
        ];

        /* Function calling  */
        const FunctionCalling = [
            {
                type: 'function',
                function: FUNCTION_CALLING.GRAMMAR_CHECKER,
            },
        ];

        /* Request configuration */
        const requestConfiguration = {
            model: 'gpt-3.5-turbo',
            messages: messages,
            tools: [...FunctionCalling],
            tool_choice: 'auto',
            temperature: 0.7,
        };

        /* Send request */
        const response = await fetch(
            'https://api.openai.com/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${openAI.apiKey}`,
                },
                body: JSON.stringify(requestConfiguration),
            }
        );

        const data = await response.json();

        if (data.error) {
            if (data.error.type === 'insufficient_quota') {
                throw new ErrorResponse({
                    message: 'Out of money',
                    code: OPENAI_OUT_OF_TOKEN,
                });
            }

            throw new ErrorResponse({
                message: 'Some error happended with OpenAI API',
                code: 20024,
            });
        }

        const AIResponse = data.choices[0];
        const checkingResult =
            AIResponse.message.tool_calls[0].function.arguments;

        /* Format reuslt and return */
        return JSON.parse(checkingResult);
    }

    static async paraphrase({ form = 'shorten', text }) {
        const len = form === 'shorten' ? 'shorter' : 'longer';
        /* Promt */
        const messages = [
            {
                role: 'system',
                content: `Given an English input text, You are tasked with providing several paraphrased versions of the input text, ensuring that the paraphrased version is ${len} than the original one.`,
            },
            {
                role: 'user',
                content: text,
            },
        ];

        /* Function calling  */
        const FunctionCalling = [
            {
                type: 'function',
                function:
                    len == 'shorter'
                        ? FUNCTION_CALLING.PARAPHRASE_NARROW
                        : FUNCTION_CALLING.PARAPHRASE_EXPAND,
            },
        ];

        console.log(FunctionCalling);

        /* Request configuration */
        const requestConfiguration = {
            model: 'gpt-3.5-turbo',
            messages: messages,
            tools: [...FunctionCalling],
            tool_choice: 'auto',
            temperature: 0.7,
        };

        /* Send request */
        const response = await fetch(
            'https://api.openai.com/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${openAI.apiKey}`,
                },
                body: JSON.stringify(requestConfiguration),
            }
        );

        const data = await response.json();

        if (data.error) {
            if (data.error.type === 'insufficient_quota') {
                throw new ErrorResponse({
                    message: 'Out of money',
                    code: OPENAI_OUT_OF_TOKEN,
                });
            }

            throw new ErrorResponse();
        }

        const AIResponse = data.choices[0];
        const result = AIResponse.message.tool_calls[0].function.arguments;

        return JSON.parse(result);
    }

    static async textCompletion({ text }) {
        /* Promt */
        const messages = [
            {
                role: 'user',
                content: `The provided input text: "${text}"`,
            },
        ];

        /* Function calling  */
        const FunctionCalling = [
            {
                type: 'function',
                function: FUNCTION_CALLING.TEXT_COMPLETION,
            },
        ];

        /* Request configuration */
        const requestConfiguration = {
            model: 'gpt-3.5-turbo',
            messages: messages,
            tools: [...FunctionCalling],
            tool_choice: 'auto',
            temperature: 0.7,
        };

        /* Send request */
        const response = await fetch(
            'https://api.openai.com/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${openAI.apiKey}`,
                },
                body: JSON.stringify(requestConfiguration),
            }
        );

        const data = await response.json();

        if (data.error) {
            if (data.error.type === 'insufficient_quota') {
                throw new ErrorResponse({
                    message: 'Out of money',
                    code: OPENAI_OUT_OF_TOKEN,
                });
            }

            throw new ErrorResponse();
        }

        const AIResponse = data.choices[0];
        const checkingResult =
            AIResponse.message.tool_calls[0].function.arguments;

        /* Format reuslt and return */
        return JSON.parse(checkingResult);
    }
}

module.exports = OpenAIService;

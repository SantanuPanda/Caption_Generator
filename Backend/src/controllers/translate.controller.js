const { Translate } = require('@google-cloud/translate').v2;

// Initialize the translation client
// Note: You need to set up Google Cloud credentials for this to work
const translate = new Translate({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    key: process.env.GOOGLE_TRANSLATE_API_KEY
});

const languageMap = {
    'hindi': 'hi',
    'english': 'en',
    'bengali': 'bn',
    'odia': 'or',
    'hi': 'hi',
    'en': 'en',
    'bn': 'bn',
    'or': 'or'
};

async function translateText(req, res) {
    try {
        console.log('Translation request received:', req.body);
        const { text, targetLanguage } = req.body;
        console.log('Target Language:', targetLanguage);

        if (!text || !targetLanguage) {
            return res.status(400).json({
                error: 'Text and target language are required'
            });
        }

        // Log the original text
        console.log('Text to translate:', text);
        
        // Verify credentials are available
        if (!process.env.GOOGLE_CLOUD_PROJECT_ID || !process.env.GOOGLE_TRANSLATE_API_KEY) {
            console.error('Missing Google Cloud credentials');
            return res.status(500).json({
                error: 'Translation service configuration error'
            });
        }

        const target = languageMap[targetLanguage.toLowerCase()];
        console.log('Mapped target language code:', target);

        if (!target) {
            console.error('Unsupported language:', targetLanguage);
            return res.status(400).json({
                error: 'Unsupported target language. Supported languages are: hindi, english, bengali, odia'
            });
        }

        // Perform the translation with explicit options
        const options = {
            from: 'en',
            to: target,
        };
        console.log('Translation options:', options);

        const [translation] = await translate.translate(text, options);
        console.log('Raw translation result:', translation);

        console.log('Translation result:', translation);

        res.json({
            translatedText: translation,
            targetLanguage: target
        });
    } catch (error) {
        console.error('Translation error:', error);
        console.error('Error details:', {
            code: error.code,
            details: error.details,
            message: error.message
        });
        res.status(500).json({
            error: 'Translation failed',
            details: error.message,
            code: error.code
        });
    }
}


module.exports = { translateText };

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/translate', async (req, res) => {
    try {
        const { text } = req.body;
        const translator = new PirateTranslator();
        const translation = await translator.translateWithAI(text);
        res.json({ translation });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
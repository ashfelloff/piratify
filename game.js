class PirateTranslator {
    constructor() {
        this.apiKey = 'AIzaSyAqjWtx1HzrCAp9auLybWrXBxfc_kMUR2E';
        // Keep dictionary as fallback
        this.dictionary = {
            // Common word replacements with more variety
            'hello': ["ahoy", "avast ye", "hail", "g'day"],
            'hi': ["yarr", "ahoy", "aye"],
            'hey': ["avast", "ho there", "hail"],
            'my': ["me", "this 'ere", "thy"],
            'friend': ["matey", "shipmate", "bucko", "hearty"],
            'friends': ["crew", "hearties", "mates", "shipmates"],
            'yes': ["aye", "arr", "indeed"],
            'no': ["nay", "nah", "negative"],
            'is': ["be", "'tis", "do be"],
            'are': ["be", "'tis", "do be"],
            'the': ["th'", "'tis", "ye olde"],
            'you': ["ye", "ya", "thou"],
            'your': ["yer", "thy", "ya"],
            'stop': ["avast", "belay", "halt"],
            'money': ["doubloons", "gold", "treasure", "booty"],
            'food': ["grub", "vittles", "provisions", "rations"],
            'drink': ["grog", "rum", "spirits"],
            'water': ["brine", "sea water", "aqua"],
            'house': ["shanty", "quarters", "dwelling"],
            'home': ["port", "berth", "haven"],
            'look': ["spy", "peek", "observe", "witness"],
            'see': ["spy", "spot", "witness"],
            'saw': ["spied", "spotted", "witnessed"],
            'steal': ["plunder", "pillage", "loot", "commandeer"],
            'stole': ["plundered", "pillaged", "looted", "commandeered"],
            'take': ["plunder", "seize", "commandeer"],
            'fight': ["battle", "brawl", "scrap"],
            'fought': ["battled", "brawled", "scrapped"],
            'good': ["shipshape", "seaworthy", "fine"],
            'great': ["grand", "mighty fine", "spectacular"],
            'amazing': ["seaworthy", "incredible", "mighty fine"],
            'wow': ["blimey", "shiver me timbers", "strike me down"],
            'very': ["mighty", "right", "properly"],
            'really': ["mighty", "truly", "properly"],
            'happy': ["jolly", "merry", "cheerful"],
            'excited': ["hoisted", "thrilled", "stirred up"],
            'going': ["sailin'", "headin'", "bound for"],
            'want': ["fancy", "desire", "yearn for"],
            'bad': ["cursed", "wretched", "forsaken"],
            'terrible': ["dreadful", "horrid", "accursed"],
            'bathroom': ["head", "privy", "facilities"],
            'restaurant': ["galley", "mess hall", "eating house"],
            'boss': ["cap'n", "commander", "chief"],
            'manager': ["first mate", "quartermaster", "officer"],
            'quickly': ["swiftly", "with haste", "post-haste"],
            'run': ["scurry", "make haste", "flee"],
            'leave': ["set sail", "depart", "abandon ship"],
            'talk': ["parley", "speak", "converse"],
            'talking': ["parleying", "speaking", "conversing"],
            'think': ["reckon", "suppose", "figure"],
            'stupid': ["addled", "daft", "foolish"],
            'idiot': ["landlubber", "scallywag", "fool"],
            'person': ["scallywag", "soul", "buccaneer"],
            'people': ["folk", "crew", "souls"],
        };
        
        this.prefixes = [
            "Yarr, ",
            "Ahoy! ",
            "Avast ye! ",
            "Hear ye, ",
            "By Neptune's beard, ",
            "Shiver me timbers! ",
        ];
        
        this.suffixes = [
            " ye scurvy dog",
            ", arr!",
            ", matey",
            ", ye landlubber",
            ", savvy?",
            ", yo-ho-ho!",
            ", shiver me timbers!",
            ", by Davy Jones' locker!",
            ", ye scallywag",
            ", avast ye!",
            ", or I'll feed ye to the sharks!",
            ", on me oath!",
            ", may the wind be at yer back!",
            ", and that's the truth!",
            ", or I'm not a true pirate!",
        ];

        this.phrases = {
            "i don't know": ["blimey if I know", "beats me, matey", "I've not the foggiest"],
            "i don't care": ["it matters not to me", "means nothin' to this old salt", "bothers me none"],
            "oh my god": ["shiver me timbers", "blow me down", "strike the colors"],
            "of course": ["naturally, ye scallywag", "aye, that be true", "clear as the north star"],
            "thank you": ["much obliged", "ye have me gratitude", "thankee kindly"],
            "you're welcome": ["think nothin' of it", "'tis me pleasure", "aye, anytime"],
        };
    }

    async translateWithAI(text) {
        try {
            const prompt = `
                Transform this text into creative pirate speak. Use colorful pirate vocabulary, 
                nautical terms, and sea-faring expressions. Make it sound authentic and varied, 
                but ensure it's still understandable. Add occasional "arr" or "yarr" naturally.
                Keep the core meaning but make it sound like a seasoned pirate is speaking.

                Text to transform: "${text}"
            `;

            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.8,  // More creative
                        topK: 40,
                        topP: 0.95,
                    }
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            let aiTranslation = data.candidates[0].content.parts[0].text;

            // If AI returns empty or fails, use dictionary translation
            if (!aiTranslation || aiTranslation.trim().length === 0) {
                return this.translate(text);
            }

            // Clean up AI response
            aiTranslation = aiTranslation
                .replace(/["']/g, '')  // Remove quotes
                .trim();

            return aiTranslation;

        } catch (error) {
            console.error('AI translation failed:', error);
            // Fallback to dictionary translation
            return this.translate(text);
        }
    }

    // Keep the original translate method as fallback
    translate(text) {
        // Add random prefix (20% chance)
        let pirateText = Math.random() < 0.2 ? 
            this.prefixes[Math.floor(Math.random() * this.prefixes.length)] : '';
        
        // Convert to lowercase for matching
        pirateText += text.toLowerCase();

        // Replace phrases first
        for (let [phrase, replacements] of Object.entries(this.phrases)) {
            const regex = new RegExp(phrase, 'gi');
            if (regex.test(pirateText)) {
                const replacement = replacements[Math.floor(Math.random() * replacements.length)];
                pirateText = pirateText.replace(regex, replacement);
            }
        }
        
        // Replace words based on dictionary
        for (let [word, replacements] of Object.entries(this.dictionary)) {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            if (regex.test(pirateText)) {
                const replacement = Array.isArray(replacements) ? 
                    replacements[Math.floor(Math.random() * replacements.length)] : 
                    replacements;
                pirateText = pirateText.replace(regex, replacement);
            }
        }
        
        // Add common pirate-isms
        pirateText = pirateText
            .replace(/ing\b/g, "in'")
            .replace(/my\b/g, "me")
            .replace(/you're/g, "ye be")
            .replace(/i'm/g, "i be")
            .replace(/r/g, "rrr")
            .replace(/yes/g, "aye");
        
        // Capitalize first letter of sentences
        pirateText = pirateText.replace(/(^\w|\.\s+\w)/g, letter => letter.toUpperCase());
        
        // Add random suffix (30% chance)
        if (Math.random() < 0.3) {
            pirateText += this.suffixes[Math.floor(Math.random() * this.suffixes.length)];
        }
        
        return pirateText;
    }
}

async function translateText() {
    if (isTranslating) return;
    
    const input = document.getElementById('input');
    const loading = document.getElementById('loading');
    const translateBtn = document.getElementById('translateBtn');
    const originalText = input.value;

    if (!originalText.trim()) return;

    isTranslating = true;
    translateBtn.style.display = 'none';
    loading.style.display = 'block';

    try {
        // Try AI translation first
        const translation = await translator.translateWithAI(originalText);
        
        // Animate the text transformation
        loading.style.display = 'none';
        input.value = '';
        
        for (let i = 0; i < translation.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 30));
            input.value += translation[i];
        }
    } catch (err) {
        console.error(err);
        // If AI fails, use dictionary translation
        const fallbackTranslation = translator.translate(originalText);
        input.value = fallbackTranslation;
    } finally {
        isTranslating = false;
        translateBtn.style.display = 'block';
    }
}
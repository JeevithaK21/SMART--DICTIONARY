// Language Translation App JavaScript
class TranslationApp {
    constructor() {
        this.recentTranslations = JSON.parse(localStorage.getItem('recentTranslations')) || [];
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.currentTranslation = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadRecentTranslations();
        this.updateCharacterCount();
        this.updateLanguageFlags();
    }

    bindEvents() {
        // Main elements
        const sourceText = document.getElementById('sourceText');
        const translateBtn = document.getElementById('translateBtn');
        const detectBtn = document.getElementById('detectBtn');
        const swapBtn = document.getElementById('swapLanguages');
        const clearBtn = document.getElementById('clearBtn');
        const copyBtn = document.getElementById('copyBtn');
        const saveBtn = document.getElementById('saveBtn');
        const speakSourceBtn = document.getElementById('speakSourceBtn');
        const speakTargetBtn = document.getElementById('speakTargetBtn');
        const sourceLanguage = document.getElementById('sourceLanguage');
        const targetLanguage = document.getElementById('targetLanguage');

        // Event listeners
        sourceText.addEventListener('input', () => {
            this.updateCharacterCount();
            this.autoTranslate();
        });

        translateBtn.addEventListener('click', () => this.translateText());
        detectBtn.addEventListener('click', () => this.detectLanguage());
        swapBtn.addEventListener('click', () => this.swapLanguages());
        clearBtn.addEventListener('click', () => this.clearText());
        copyBtn.addEventListener('click', () => this.copyTranslation());
        saveBtn.addEventListener('click', () => this.saveToFavorites());
        speakSourceBtn.addEventListener('click', () => this.speakText('source'));
        speakTargetBtn.addEventListener('click', () => this.speakText('target'));

        sourceLanguage.addEventListener('change', () => {
            this.updateLanguageFlags();
            this.autoTranslate();
        });

        targetLanguage.addEventListener('change', () => {
            this.updateLanguageFlags();
            this.autoTranslate();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.translateText();
                        break;
                    case 'k':
                        e.preventDefault();
                        this.clearText();
                        break;
                }
            }
        });
    }

    updateCharacterCount() {
        const sourceText = document.getElementById('sourceText');
        const charCount = document.getElementById('charCount');
        const count = sourceText.value.length;
        charCount.textContent = count;
        
        // Visual feedback for character limit
        if (count > 4500) {
            charCount.style.color = '#ff4444';
        } else if (count > 4000) {
            charCount.style.color = '#ff8800';
        } else {
            charCount.style.color = '#666';
        }
    }

    updateLanguageFlags() {
        const sourceLanguage = document.getElementById('sourceLanguage');
        const targetLanguage = document.getElementById('targetLanguage');
        const sourceFlag = document.getElementById('sourceFlag');
        const targetFlag = document.getElementById('targetFlag');

        const languageFlags = {
            'auto': 'fas fa-globe',
            'en': '🇺🇸',
            'es': '🇪🇸',
            'fr': '🇫🇷',
            'de': '🇩🇪',
            'it': '🇮🇹',
            'pt': '🇵🇹',
            'ru': '🇷🇺',
            'ja': '🇯🇵',
            'ko': '🇰🇷',
            'zh': '🇨🇳',
            'ar': '🇸🇦',
            'hi': '🇮🇳'
        };

        const sourceCode = sourceLanguage.value;
        const targetCode = targetLanguage.value;

        if (languageFlags[sourceCode].startsWith('fa')) {
            sourceFlag.innerHTML = `<i class="${languageFlags[sourceCode]}"></i>`;
        } else {
            sourceFlag.innerHTML = languageFlags[sourceCode];
        }

        if (languageFlags[targetCode].startsWith('fa')) {
            targetFlag.innerHTML = `<i class="${languageFlags[targetCode]}"></i>`;
        } else {
            targetFlag.innerHTML = languageFlags[targetCode];
        }
    }

    async translateText() {
        const sourceText = document.getElementById('sourceText').value.trim();
        const sourceLanguage = document.getElementById('sourceLanguage').value;
        const targetLanguage = document.getElementById('targetLanguage').value;
        const targetTextEl = document.getElementById('targetText');
        const translationInfo = document.getElementById('translationInfo');

        if (!sourceText) {
            this.showNotification('Please enter text to translate', 'warning');
            return;
        }

        if (sourceLanguage === targetLanguage && sourceLanguage !== 'auto') {
            this.showNotification('Source and target languages cannot be the same', 'warning');
            return;
        }

        this.showLoading(true);

        try {
            // Simulate API call with realistic delay
            await this.delay(800 + Math.random() * 400);
            
            // Mock translation (in real app, this would be an API call)
            const translation = await this.mockTranslateAPI(sourceText, sourceLanguage, targetLanguage);
            
            // Display translation
            targetTextEl.innerHTML = `<div class="translation-text">${translation.text}</div>`;
            
            // Update translation info
            const detectedLang = translation.detectedLanguage || sourceLanguage;
            const confidence = translation.confidence || Math.floor(Math.random() * 20) + 80;
            
            translationInfo.innerHTML = `
                <div class="translation-meta">
                    <span class="detected-lang">Detected: ${this.getLanguageName(detectedLang)}</span>
                    <span class="confidence">Confidence: ${confidence}%</span>
                </div>
            `;

            // Store current translation
            this.currentTranslation = {
                source: sourceText,
                target: translation.text,
                sourceLang: detectedLang,
                targetLang: targetLanguage,
                timestamp: Date.now()
            };

            // Add to recent translations
            this.addToRecent(this.currentTranslation);

            this.showNotification('Translation completed!', 'success');

        } catch (error) {
            console.error('Translation error:', error);
            targetTextEl.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    Translation failed. Please try again.
                </div>
            `;
            this.showNotification('Translation failed. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async mockTranslateAPI(text, sourceLang, targetLang) {
        // Enhanced mock translation responses
        const mockTranslations = {
            // Common greetings
            'hello': { 'es': 'hola', 'fr': 'bonjour', 'de': 'hallo', 'it': 'ciao', 'pt': 'olá', 'ru': 'привет', 'ja': 'こんにちは', 'zh': '你好', 'ar': 'مرحبا', 'hi': 'नमस्ते', 'ko': '안녕하세요' },
            'hi': { 'es': 'hola', 'fr': 'salut', 'de': 'hallo', 'it': 'ciao', 'pt': 'oi', 'ru': 'привет', 'ja': 'やあ', 'zh': '嗨', 'ar': 'مرحبا', 'hi': 'हाय', 'ko': '안녕' },
            'goodbye': { 'es': 'adiós', 'fr': 'au revoir', 'de': 'auf wiedersehen', 'it': 'ciao', 'pt': 'tchau', 'ru': 'до свидания', 'ja': 'さようなら', 'zh': '再见', 'ar': 'وداعا', 'hi': 'अलविदा', 'ko': '안녕히 가세요' },
            'bye': { 'es': 'adiós', 'fr': 'au revoir', 'de': 'tschüss', 'it': 'ciao', 'pt': 'tchau', 'ru': 'пока', 'ja': 'バイバイ', 'zh': '拜拜', 'ar': 'وداعا', 'hi': 'बाय', 'ko': '바이' },
            
            // Politeness
            'thank you': { 'es': 'gracias', 'fr': 'merci', 'de': 'danke', 'it': 'grazie', 'pt': 'obrigado', 'ru': 'спасибо', 'ja': 'ありがとう', 'zh': '谢谢', 'ar': 'شكرا', 'hi': 'धन्यवाद', 'ko': '감사합니다' },
            'thanks': { 'es': 'gracias', 'fr': 'merci', 'de': 'danke', 'it': 'grazie', 'pt': 'obrigado', 'ru': 'спасибо', 'ja': 'ありがとう', 'zh': '谢谢', 'ar': 'شكرا', 'hi': 'धन्यवाद', 'ko': '고마워' },
            'please': { 'es': 'por favor', 'fr': 's\'il vous plaît', 'de': 'bitte', 'it': 'per favore', 'pt': 'por favor', 'ru': 'пожалуйста', 'ja': 'お願いします', 'zh': '请', 'ar': 'من فضلك', 'hi': 'कृपया', 'ko': '제발' },
            'sorry': { 'es': 'lo siento', 'fr': 'désolé', 'de': 'entschuldigung', 'it': 'scusa', 'pt': 'desculpa', 'ru': 'извините', 'ja': 'すみません', 'zh': '对不起', 'ar': 'آسف', 'hi': 'माफ़ करना', 'ko': '미안해요' },
            'excuse me': { 'es': 'disculpe', 'fr': 'excusez-moi', 'de': 'entschuldigen sie', 'it': 'mi scusi', 'pt': 'com licença', 'ru': 'извините', 'ja': 'すみません', 'zh': '不好意思', 'ar': 'المعذرة', 'hi': 'माफ़ करें', 'ko': '실례합니다' },
            
            // Time-based greetings
            'good morning': { 'es': 'buenos días', 'fr': 'bonjour', 'de': 'guten morgen', 'it': 'buongiorno', 'pt': 'bom dia', 'ru': 'доброе утро', 'ja': 'おはよう', 'zh': '早上好', 'ar': 'صباح الخير', 'hi': 'सुप्रभात', 'ko': '좋은 아침' },
            'good afternoon': { 'es': 'buenas tardes', 'fr': 'bon après-midi', 'de': 'guten tag', 'it': 'buon pomeriggio', 'pt': 'boa tarde', 'ru': 'добрый день', 'ja': 'こんにちは', 'zh': '下午好', 'ar': 'مساء الخير', 'hi': 'शुभ दोपहर', 'ko': '좋은 오후' },
            'good evening': { 'es': 'buenas noches', 'fr': 'bonsoir', 'de': 'guten abend', 'it': 'buonasera', 'pt': 'boa noite', 'ru': 'добрый вечер', 'ja': 'こんばんは', 'zh': '晚上好', 'ar': 'مساء الخير', 'hi': 'शुभ संध्या', 'ko': '좋은 저녁' },
            'good night': { 'es': 'buenas noches', 'fr': 'bonne nuit', 'de': 'gute nacht', 'it': 'buonanotte', 'pt': 'boa noite', 'ru': 'спокойной ночи', 'ja': 'おやすみ', 'zh': '晚安', 'ar': 'تصبح على خير', 'hi': 'शुभ रात्रि', 'ko': '잘 자' },
            
            // Questions
            'how are you': { 'es': '¿cómo estás?', 'fr': 'comment allez-vous?', 'de': 'wie geht es dir?', 'it': 'come stai?', 'pt': 'como você está?', 'ru': 'как дела?', 'ja': '元気ですか?', 'zh': '你好吗?', 'ar': 'كيف حالك؟', 'hi': 'आप कैसे हैं?', 'ko': '어떻게 지내세요?' },
            'what is your name': { 'es': '¿cómo te llamas?', 'fr': 'comment vous appelez-vous?', 'de': 'wie heißt du?', 'it': 'come ti chiami?', 'pt': 'qual é o seu nome?', 'ru': 'как тебя зовут?', 'ja': 'お名前は何ですか?', 'zh': '你叫什么名字?', 'ar': 'ما اسمك؟', 'hi': 'आपका नाम क्या है?', 'ko': '이름이 뭐예요?' },
            'where are you from': { 'es': '¿de dónde eres?', 'fr': 'd\'où venez-vous?', 'de': 'woher kommst du?', 'it': 'di dove sei?', 'pt': 'de onde você é?', 'ru': 'откуда ты?', 'ja': 'どちらから来ましたか?', 'zh': '你来自哪里?', 'ar': 'من أين أنت؟', 'hi': 'आप कहाँ से हैं?', 'ko': '어디서 왔어요?' },
            
            // Basic responses
            'yes': { 'es': 'sí', 'fr': 'oui', 'de': 'ja', 'it': 'sì', 'pt': 'sim', 'ru': 'да', 'ja': 'はい', 'zh': '是', 'ar': 'نعم', 'hi': 'हाँ', 'ko': '네' },
            'no': { 'es': 'no', 'fr': 'non', 'de': 'nein', 'it': 'no', 'pt': 'não', 'ru': 'нет', 'ja': 'いいえ', 'zh': '不', 'ar': 'لا', 'hi': 'नहीं', 'ko': '아니요' },
            'maybe': { 'es': 'tal vez', 'fr': 'peut-être', 'de': 'vielleicht', 'it': 'forse', 'pt': 'talvez', 'ru': 'может быть', 'ja': 'たぶん', 'zh': '也许', 'ar': 'ربما', 'hi': 'शायद', 'ko': '아마도' },
            
            // Common words
            'water': { 'es': 'agua', 'fr': 'eau', 'de': 'wasser', 'it': 'acqua', 'pt': 'água', 'ru': 'вода', 'ja': '水', 'zh': '水', 'ar': 'ماء', 'hi': 'पानी', 'ko': '물' },
            'food': { 'es': 'comida', 'fr': 'nourriture', 'de': 'essen', 'it': 'cibo', 'pt': 'comida', 'ru': 'еда', 'ja': '食べ物', 'zh': '食物', 'ar': 'طعام', 'hi': 'खाना', 'ko': '음식' },
            'help': { 'es': 'ayuda', 'fr': 'aide', 'de': 'hilfe', 'it': 'aiuto', 'pt': 'ajuda', 'ru': 'помощь', 'ja': '助け', 'zh': '帮助', 'ar': 'مساعدة', 'hi': 'मदद', 'ko': '도움' },
            'love': { 'es': 'amor', 'fr': 'amour', 'de': 'liebe', 'it': 'amore', 'pt': 'amor', 'ru': 'любовь', 'ja': '愛', 'zh': '爱', 'ar': 'حب', 'hi': 'प्रेम', 'ko': '사랑' },
            'friend': { 'es': 'amigo', 'fr': 'ami', 'de': 'freund', 'it': 'amico', 'pt': 'amigo', 'ru': 'друг', 'ja': '友達', 'zh': '朋友', 'ar': 'صديق', 'hi': 'दोस्त', 'ko': '친구' },
            'family': { 'es': 'familia', 'fr': 'famille', 'de': 'familie', 'it': 'famiglia', 'pt': 'família', 'ru': 'семья', 'ja': '家族', 'zh': '家庭', 'ar': 'عائلة', 'hi': 'परिवार', 'ko': '가족' },
            
            // Numbers (1-10)
            'one': { 'es': 'uno', 'fr': 'un', 'de': 'eins', 'it': 'uno', 'pt': 'um', 'ru': 'один', 'ja': '一', 'zh': '一', 'ar': 'واحد', 'hi': 'एक', 'ko': '하나' },
            'two': { 'es': 'dos', 'fr': 'deux', 'de': 'zwei', 'it': 'due', 'pt': 'dois', 'ru': 'два', 'ja': '二', 'zh': '二', 'ar': 'اثنان', 'hi': 'दो', 'ko': '둘' },
            'three': { 'es': 'tres', 'fr': 'trois', 'de': 'drei', 'it': 'tre', 'pt': 'três', 'ru': 'три', 'ja': '三', 'zh': '三', 'ar': 'ثلاثة', 'hi': 'तीन', 'ko': '셋' },
            
            // Days of week
            'monday': { 'es': 'lunes', 'fr': 'lundi', 'de': 'montag', 'it': 'lunedì', 'pt': 'segunda-feira', 'ru': 'понедельник', 'ja': '月曜日', 'zh': '星期一', 'ar': 'الاثنين', 'hi': 'सोमवार', 'ko': '월요일' },
            'tuesday': { 'es': 'martes', 'fr': 'mardi', 'de': 'dienstag', 'it': 'martedì', 'pt': 'terça-feira', 'ru': 'вторник', 'ja': '火曜日', 'zh': '星期二', 'ar': 'الثلاثاء', 'hi': 'मंगलवार', 'ko': '화요일' }
        };

        const lowerText = text.toLowerCase().trim();
        
        // Check for exact matches first
        if (mockTranslations[lowerText] && mockTranslations[lowerText][targetLang]) {
            return {
                text: mockTranslations[lowerText][targetLang],
                detectedLanguage: sourceLang === 'auto' ? 'en' : sourceLang,
                confidence: 95
            };
        }

        // Check for partial matches (for phrases containing known words)
        for (const [key, translations] of Object.entries(mockTranslations)) {
            if (lowerText.includes(key) && translations[targetLang]) {
                // If the text contains a known phrase, try to translate it
                const translatedPhrase = translations[targetLang];
                const modifiedText = lowerText.replace(key, translatedPhrase);
                return {
                    text: modifiedText.charAt(0).toUpperCase() + modifiedText.slice(1),
                    detectedLanguage: sourceLang === 'auto' ? 'en' : sourceLang,
                    confidence: 85
                };
            }
        }

        // For unknown text, provide a more realistic mock response
        return this.generateSmartMockTranslation(text, sourceLang, targetLang);
    }

    generateSmartMockTranslation(text, sourceLang, targetLang) {
        // Generate more realistic mock translations based on patterns
        const patterns = {
            'es': { prefix: '', suffix: '', modifier: (text) => text.toLowerCase() + ' (traducido)' },
            'fr': { prefix: '', suffix: '', modifier: (text) => text.toLowerCase() + ' (traduit)' },
            'de': { prefix: '', suffix: '', modifier: (text) => text.toLowerCase() + ' (übersetzt)' },
            'it': { prefix: '', suffix: '', modifier: (text) => text.toLowerCase() + ' (tradotto)' },
            'pt': { prefix: '', suffix: '', modifier: (text) => text.toLowerCase() + ' (traduzido)' },
            'ru': { prefix: '', suffix: '', modifier: (text) => text + ' (переведено)' },
            'ja': { prefix: '', suffix: '', modifier: (text) => text + ' (翻訳済み)' },
            'zh': { prefix: '', suffix: '', modifier: (text) => text + ' (翻译)' },
            'ar': { prefix: '', suffix: '', modifier: (text) => text + ' (مترجم)' },
            'hi': { prefix: '', suffix: '', modifier: (text) => text + ' (अनुवादित)' },
            'ko': { prefix: '', suffix: '', modifier: (text) => text + ' (번역됨)' }
        };

        const pattern = patterns[targetLang];
        if (pattern) {
            return {
                text: pattern.modifier(text),
                detectedLanguage: sourceLang === 'auto' ? 'en' : sourceLang,
                confidence: Math.floor(Math.random() * 15) + 70
            };
        }

        // Fallback
        return {
            text: `${text} (${this.getLanguageName(targetLang)} translation)`,
            detectedLanguage: sourceLang === 'auto' ? 'en' : sourceLang,
            confidence: 65
        };
    }

    async detectLanguage() {
        const sourceText = document.getElementById('sourceText').value.trim();
        const sourceLanguage = document.getElementById('sourceLanguage');

        if (!sourceText) {
            this.showNotification('Please enter text to detect language', 'warning');
            return;
        }

        this.showLoading(true);

        try {
            await this.delay(300);
            
            // Mock language detection
            const detectedLang = this.mockDetectLanguage(sourceText);
            sourceLanguage.value = detectedLang;
            this.updateLanguageFlags();
            
            this.showNotification(`Language detected: ${this.getLanguageName(detectedLang)}`, 'success');
            
        } catch (error) {
            this.showNotification('Language detection failed', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    mockDetectLanguage(text) {
        // Simple mock detection based on common words
        const patterns = {
            'es': ['hola', 'gracias', 'por favor', 'sí', 'no', 'cómo', 'qué'],
            'fr': ['bonjour', 'merci', 's\'il vous plaît', 'oui', 'non', 'comment', 'que'],
            'de': ['hallo', 'danke', 'bitte', 'ja', 'nein', 'wie', 'was'],
            'it': ['ciao', 'grazie', 'prego', 'sì', 'no', 'come', 'che'],
            'pt': ['olá', 'obrigado', 'por favor', 'sim', 'não', 'como', 'que']
        };

        const lowerText = text.toLowerCase();
        
        for (const [lang, words] of Object.entries(patterns)) {
            if (words.some(word => lowerText.includes(word))) {
                return lang;
            }
        }
        
        return 'en'; // Default to English
    }

    swapLanguages() {
        const sourceLanguage = document.getElementById('sourceLanguage');
        const targetLanguage = document.getElementById('targetLanguage');
        const sourceText = document.getElementById('sourceText');
        const targetText = document.getElementById('targetText');

        // Can't swap if source is auto-detect
        if (sourceLanguage.value === 'auto') {
            this.showNotification('Cannot swap when auto-detect is selected', 'warning');
            return;
        }

        // Swap language selections
        const tempLang = sourceLanguage.value;
        sourceLanguage.value = targetLanguage.value;
        targetLanguage.value = tempLang;

        // Swap text content if translation exists
        if (this.currentTranslation) {
            const tempText = sourceText.value;
            sourceText.value = this.currentTranslation.target;
            targetText.innerHTML = `<div class="translation-text">${tempText}</div>`;
            
            // Update current translation
            this.currentTranslation = {
                source: this.currentTranslation.target,
                target: tempText,
                sourceLang: this.currentTranslation.targetLang,
                targetLang: this.currentTranslation.sourceLang,
                timestamp: Date.now()
            };
        }

        this.updateLanguageFlags();
        this.updateCharacterCount();
        this.showNotification('Languages swapped!', 'success');
    }

    clearText() {
        document.getElementById('sourceText').value = '';
        document.getElementById('targetText').innerHTML = `
            <div class="placeholder-text">
                <i class="fas fa-language"></i>
                Translation will appear here...
            </div>
        `;
        document.getElementById('translationInfo').innerHTML = '';
        this.currentTranslation = null;
        this.updateCharacterCount();
        document.getElementById('sourceText').focus();
    }

    async copyTranslation() {
        if (!this.currentTranslation) {
            this.showNotification('No translation to copy', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(this.currentTranslation.target);
            this.showNotification('Translation copied to clipboard!', 'success');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = this.currentTranslation.target;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('Translation copied to clipboard!', 'success');
        }
    }

    saveToFavorites() {
        if (!this.currentTranslation) {
            this.showNotification('No translation to save', 'warning');
            return;
        }

        // Check if already in favorites
        const exists = this.favorites.some(fav => 
            fav.source === this.currentTranslation.source && 
            fav.target === this.currentTranslation.target
        );

        if (exists) {
            this.showNotification('Translation already in favorites', 'info');
            return;
        }

        this.favorites.unshift({
            ...this.currentTranslation,
            id: Date.now()
        });

        // Keep only last 50 favorites
        if (this.favorites.length > 50) {
            this.favorites = this.favorites.slice(0, 50);
        }

        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.showNotification('Saved to favorites!', 'success');

        // Update heart icon
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.innerHTML = '<i class="fas fa-heart" style="color: #ff4444;"></i>';
        setTimeout(() => {
            saveBtn.innerHTML = '<i class="fas fa-heart"></i>';
        }, 2000);
    }

    speakText(type) {
        if (!('speechSynthesis' in window)) {
            this.showNotification('Text-to-speech not supported in this browser', 'warning');
            return;
        }

        let text, lang;
        
        if (type === 'source') {
            text = document.getElementById('sourceText').value;
            lang = document.getElementById('sourceLanguage').value;
        } else {
            if (!this.currentTranslation) {
                this.showNotification('No translation to read', 'warning');
                return;
            }
            text = this.currentTranslation.target;
            lang = document.getElementById('targetLanguage').value;
        }

        if (!text.trim()) {
            this.showNotification('No text to read', 'warning');
            return;
        }
       

        // Stop any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.getSpeechLanguage(lang);
        utterance.rate = 0.8;
        utterance.pitch = 1;

        utterance.onstart = () => {
            const btn = document.getElementById(type === 'source' ? 'speakSourceBtn' : 'speakTargetBtn');
            btn.innerHTML = '<i class="fas fa-stop"></i>';
        };

        utterance.onend = () => {
            const btn = document.getElementById(type === 'source' ? 'speakSourceBtn' : 'speakTargetBtn');
            btn.innerHTML = '<i class="fas fa-volume-up"></i>';
        };

        speechSynthesis.speak(utterance);
    }

    getSpeechLanguage(code) {
        const speechCodes = {
            'en': 'en-US',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'it': 'it-IT',
            'pt': 'pt-PT',
            'ru': 'ru-RU',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'zh': 'zh-CN',
            'ar': 'ar-SA',
            'hi': 'hi-IN'
        };
        return speechCodes[code] || 'en-US';
    }

    autoTranslate() {
        // Auto-translate after user stops typing for 1 second
        clearTimeout(this.autoTranslateTimer);
        this.autoTranslateTimer = setTimeout(() => {
            const sourceText = document.getElementById('sourceText').value.trim();
            if (sourceText && sourceText.length > 2) {
                this.translateText();
            }
        }, 1000);
    }

    addToRecent(translation) {
        // Remove duplicate if exists
        this.recentTranslations = this.recentTranslations.filter(
            item => !(item.source === translation.source && item.target === translation.target)
        );

        // Add to beginning
        this.recentTranslations.unshift(translation);

        // Keep only last 10 translations
        if (this.recentTranslations.length > 10) {
            this.recentTranslations = this.recentTranslations.slice(0, 10);
        }

        localStorage.setItem('recentTranslations', JSON.stringify(this.recentTranslations));
        this.loadRecentTranslations();
    }

    loadRecentTranslations() {
        const container = document.getElementById('recentTranslations');
        
        if (this.recentTranslations.length === 0) {
            container.innerHTML = `
                <div class="no-recent">
                    <i class="fas fa-history"></i>
                    <p>No recent translations</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.recentTranslations.map(item => `
            <div class="recent-item" onclick="translationApp.loadRecentTranslation('${this.escapeHtml(item.source)}', '${this.escapeHtml(item.target)}', '${item.sourceLang}', '${item.targetLang}')">
                <div class="recent-text">
                    <span class="source-text">${this.truncateText(item.source, 30)}</span>
                    <i class="fas fa-arrow-right"></i>
                    <span class="target-text">${this.truncateText(item.target, 30)}</span>
                </div>
                <div class="recent-languages">${item.sourceLang.toUpperCase()} → ${item.targetLang.toUpperCase()}</div>
            </div>
        `).join('');
    }

    loadRecentTranslation(source, target, sourceLang, targetLang) {
        document.getElementById('sourceText').value = source;
        document.getElementById('sourceLanguage').value = sourceLang;
        document.getElementById('targetLanguage').value = targetLang;
        document.getElementById('targetText').innerHTML = `<div class="translation-text">${target}</div>`;
        
        this.currentTranslation = {
            source, target, sourceLang, targetLang, timestamp: Date.now()
        };
        
        this.updateLanguageFlags();
        this.updateCharacterCount();
        this.showNotification('Translation loaded!', 'success');
    }

    getLanguageName(code) {
        const names = {
            'auto': 'Auto-detect',
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese',
            'ar': 'Arabic',
            'hi': 'Hindi'
        };
        return names[code] || code.toUpperCase();
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.style.display = 'flex';
        } else {
            overlay.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        notification.innerHTML = `
            <i class="${icons[type]}"></i>
            <span>${message}</span>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.translationApp = new TranslationApp();
});

// Add notification styles
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.notification.show {
    transform: translateX(0);
}

.notification-success { background: #4CAF50; }
.notification-error { background: #f44336; }
.notification-warning { background: #ff9800; }
.notification-info { background: #2196F3; }

.no-recent {
    text-align: center;
    padding: 40px 20px;
    color: #666;
}

.no-recent i {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
}

.error-message {
    text-align: center;
    color: #f44336;
    padding: 20px;
}

.translation-text {
    padding: 20px;
    line-height: 1.6;
}

.translation-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #666;
    padding: 8px 0;
}

.recent-item {
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.recent-item:hover {
    background-color: #f5f5f5;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);


// For translations

// After you display a translation, add this:
function displayTranslation(originalText, translatedText, sourceLang, targetLang) {
    // Your existing code to show the translation...
    
    // Create favorite button
    const favoriteBtn = FavoritesHelper.createTranslationFavoriteButton(
        originalText, 
        translatedText, 
        {
            original: originalText,
            translated: translatedText,
            sourceLang: sourceLang,
            targetLang: targetLang
        }
    );
    
    // Add button to your results container
    const resultContainer = document.getElementById('translation-results'); // Replace with your actual container ID
    resultContainer.appendChild(favoriteBtn);
}
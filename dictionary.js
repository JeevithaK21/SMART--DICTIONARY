class DictionaryApp {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        this.currentAudio = null;
        this.isListening = false;
        
        this.initializeElements();
        this.bindEvents();
        this.updateFavoritesCount();
    }

    initializeElements() {
        // Search elements
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.voiceBtn = document.getElementById('voiceBtn');
        this.suggestions = document.getElementById('suggestions');
        
        // Results elements
        this.resultsSection = document.getElementById('resultsSection');
        this.wordHeader = document.getElementById('wordHeader');
        this.wordTitle = document.getElementById('wordTitle');
        this.phonetic = document.getElementById('phonetic');
        this.playAudio = document.getElementById('playAudio');
        this.addFavorite = document.getElementById('addFavorite');
        this.definitionsContainer = document.getElementById('definitionsContainer');
        this.loadingState = document.getElementById('loadingState');
        this.errorState = document.getElementById('errorState');
        
        // Modal elements
        this.loginModal = document.getElementById('loginModal');
        this.signupModal = document.getElementById('signupModal');
        this.loginBtn = document.querySelector('.login-btn');
        this.signupBtn = document.querySelector('.signup-btn');
        this.closeLogin = document.getElementById('closeLogin');
        this.closeSignup = document.getElementById('closeSignup');
        this.switchToSignup = document.getElementById('switchToSignup');
        this.switchToLogin = document.getElementById('switchToLogin');
        
        // Forms
        this.loginForm = document.getElementById('loginForm');
        this.signupForm = document.getElementById('signupForm');
        
        // Featured words
        this.featuredWords = document.querySelectorAll('.featured-word-card');
        
        // Favorites count
        this.favoritesCount = document.querySelector('.favorites-count');
    }

    bindEvents() {
        // Search events
        this.searchBtn.addEventListener('click', () => this.performSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
        this.searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
        this.voiceBtn.addEventListener('click', () => this.toggleVoiceSearch());
        
        // Audio and favorites
        this.playAudio.addEventListener('click', () => this.playPronunciation());
        this.addFavorite.addEventListener('click', () => this.toggleFavorite());
        
        // Modal events
        this.loginBtn.addEventListener('click', () => this.openModal('login'));
        this.signupBtn.addEventListener('click', () => this.openModal('signup'));
        this.closeLogin.addEventListener('click', () => this.closeModal('login'));
        this.closeSignup.addEventListener('click', () => this.closeModal('signup'));
        this.switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal('login');
            this.openModal('signup');
        });
        this.switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal('signup');
            this.openModal('login');
        });
        
        // Form submissions
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        
        // Featured word clicks
        this.featuredWords.forEach(card => {
            card.addEventListener('click', () => {
                const word = card.dataset.word;
                this.searchInput.value = word;
                this.performSearch();
                this.scrollToResults();
            });
        });
        
        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target === this.loginModal) this.closeModal('login');
            if (e.target === this.signupModal) this.closeModal('signup');
        });
        
        // Close suggestions on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSuggestions();
            }
        });
    }

    async performSearch() {
        const query = this.searchInput.value.trim();
        if (!query) {
            this.showNotification('Please enter a word to search', 'warning');
            return;
        }

        this.showLoading();
        this.hideSuggestions();
        this.addToSearchHistory(query);

        try {
            const data = await this.fetchWordData(query);
            this.displayResults(data, query);
        } catch (error) {
            this.showError();
            console.error('Search error:', error);
        }
    }

    async fetchWordData(word) {
        // Using Free Dictionary API
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        
        if (!response.ok) {
            throw new Error('Word not found');
        }
        
        return await response.json();
    }

    displayResults(data, searchWord) {
        this.hideLoading();
        this.hideError();
        
        if (!data || data.length === 0) {
            this.showError();
            return;
        }

        const wordData = data[0];
        this.currentWord = searchWord.toLowerCase();
        
        // Display word header
        this.wordTitle.textContent = wordData.word;
        this.phonetic.textContent = wordData.phonetic || this.getPhonetic(wordData.phonetics);
        
        // Store audio URL
        this.currentAudioUrl = this.getAudioUrl(wordData.phonetics);
        this.playAudio.style.display = this.currentAudioUrl ? 'block' : 'none';
        
        // Update favorite button
        this.updateFavoriteButton();
        
        // Display definitions
        this.displayDefinitions(wordData.meanings);
        
        // Show word header and scroll to results
        this.wordHeader.style.display = 'block';
        this.scrollToResults();
    }

    getPhonetic(phonetics) {
        if (!phonetics || phonetics.length === 0) return '';
        const phoneticWithText = phonetics.find(p => p.text);
        return phoneticWithText ? phoneticWithText.text : '';
    }

    getAudioUrl(phonetics) {
        if (!phonetics || phonetics.length === 0) return null;
        const phoneticWithAudio = phonetics.find(p => p.audio);
        return phoneticWithAudio ? phoneticWithAudio.audio : null;
    }

    displayDefinitions(meanings) {
        this.definitionsContainer.innerHTML = '';
        
        meanings.forEach((meaning, index) => {
            const card = document.createElement('div');
            card.className = 'definition-card';
            card.innerHTML = this.createDefinitionCardHTML(meaning, index);
            this.definitionsContainer.appendChild(card);
        });
    }

    createDefinitionCardHTML(meaning, index) {
        const definitions = meaning.definitions.slice(0, 3); // Limit to 3 definitions
        
        let definitionsHTML = definitions.map(def => `
            <div class="definition-item">
                <p class="definition-text">${def.definition}</p>
                ${def.example ? `<div class="example">"${def.example}"</div>` : ''}
            </div>
        `).join('');

        let synonymsHTML = '';
        if (meaning.synonyms && meaning.synonyms.length > 0) {
            const limitedSynonyms = meaning.synonyms.slice(0, 5);
            synonymsHTML = `
                <div class="synonyms">
                    <h4>Synonyms</h4>
                    <div class="synonym-list">
                        ${limitedSynonyms.map(syn => `<span class="synonym-tag" onclick="app.searchWord('${syn}')">${syn}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        let antonymsHTML = '';
        if (meaning.antonyms && meaning.antonyms.length > 0) {
            const limitedAntonyms = meaning.antonyms.slice(0, 5);
            antonymsHTML = `
                <div class="antonyms">
                    <h4>Antonyms</h4>
                    <div class="antonym-list">
                        ${limitedAntonyms.map(ant => `<span class="antonym-tag" onclick="app.searchWord('${ant}')">${ant}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        return `
            <div class="part-of-speech">${meaning.partOfSpeech}</div>
            ${definitionsHTML}
            ${synonymsHTML}
            ${antonymsHTML}
        `;
    }

    searchWord(word) {
        this.searchInput.value = word;
        this.performSearch();
    }

    playPronunciation() {
        if (!this.currentAudioUrl) {
            this.showNotification('No audio available for this word', 'info');
            return;
        }

        if (this.currentAudio) {
            this.currentAudio.pause();
        }

        this.currentAudio = new Audio(this.currentAudioUrl);
        this.currentAudio.play().catch(error => {
            console.error('Audio playback error:', error);
            this.showNotification('Audio playback failed', 'error');
        });
    }

    toggleFavorite() {
        if (!this.currentWord) return;

        const isFavorited = this.favorites.includes(this.currentWord);
        
        if (isFavorited) {
            this.favorites = this.favorites.filter(word => word !== this.currentWord);
            this.showNotification('Removed from favorites', 'success');
        } else {
            this.favorites.push(this.currentWord);
            this.showNotification('Added to favorites', 'success');
        }

        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.updateFavoriteButton();
        this.updateFavoritesCount();
    }

    updateFavoriteButton() {
        if (!this.currentWord) return;
        
        const isFavorited = this.favorites.includes(this.currentWord);
        const icon = this.addFavorite.querySelector('i');
        
        if (isFavorited) {
            this.addFavorite.classList.add('active');
            icon.className = 'fas fa-heart';
        } else {
            this.addFavorite.classList.remove('active');
            icon.className = 'far fa-heart';
        }
    }

    updateFavoritesCount() {
        this.favoritesCount.textContent = this.favorites.length;
    }

    handleSearchInput(e) {
        const query = e.target.value.trim();
        if (query.length < 2) {
            this.hideSuggestions();
            return;
        }

        this.showSuggestions(query);
    }

    showSuggestions(query) {
        // Simple word suggestions based on common English words
        const commonWords = [
            'aberration', 'benevolent', 'capricious', 'deleterious', 'ephemeral',
            'facetious', 'gregarious', 'halcyon', 'idiosyncratic', 'juxtapose',
            'kaleidoscope', 'labyrinthine', 'mellifluous', 'nefarious', 'obsequious',
            'perspicacious', 'quixotic', 'resplendent', 'serendipity', 'ubiquitous',
            'vivacious', 'whimsical', 'xenophobic', 'zealous', 'beautiful',
            'wonderful', 'amazing', 'incredible', 'fantastic', 'excellent',
            'brilliant', 'magnificent', 'outstanding', 'remarkable', 'extraordinary'
        ];

        const filteredWords = commonWords.filter(word => 
            word.toLowerCase().startsWith(query.toLowerCase())
        ).slice(0, 5);

        if (filteredWords.length > 0) {
            this.suggestions.innerHTML = filteredWords.map(word => 
                `<div class="suggestion-item" onclick="app.selectSuggestion('${word}')">${word}</div>`
            ).join('');
            this.suggestions.style.display = 'block';
        } else {
            this.hideSuggestions();
        }
    }

    selectSuggestion(word) {
        this.searchInput.value = word;
        this.hideSuggestions();
        this.performSearch();
    }

    hideSuggestions() {
        this.suggestions.style.display = 'none';
    }

    toggleVoiceSearch() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showNotification('Voice search is not supported in your browser', 'error');
            return;
        }

        if (this.isListening) {
            this.stopVoiceSearch();
            return;
        }

        this.startVoiceSearch();
    }

    startVoiceSearch() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            this.voiceBtn.style.background = '#ff4757';
            this.showNotification('Listening... Speak now', 'info');
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.searchInput.value = transcript;
            this.performSearch();
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.showNotification('Voice search failed. Please try again.', 'error');
            this.stopVoiceSearch();
        };

        this.recognition.onend = () => {
            this.stopVoiceSearch();
        };

        this.recognition.start();
    }

    stopVoiceSearch() {
        if (this.recognition) {
            this.recognition.stop();
        }
        
        this.isListening = false;
        this.voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        this.voiceBtn.style.background = '';
    }

    addToSearchHistory(word) {
        if (!this.searchHistory.includes(word)) {
            this.searchHistory.unshift(word);
            if (this.searchHistory.length > 20) {
                this.searchHistory = this.searchHistory.slice(0, 20);
            }
            localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
        }
    }

    showLoading() {
        this.loadingState.style.display = 'block';
        this.wordHeader.style.display = 'none';
        this.definitionsContainer.innerHTML = '';
        this.hideError();
    }

    hideLoading() {
        this.loadingState.style.display = 'none';
    }

    showError() {
        this.errorState.style.display = 'block';
        this.wordHeader.style.display = 'none';
        this.definitionsContainer.innerHTML = '';
        this.hideLoading();
    }

    hideError() {
        this.errorState.style.display = 'none';
    }

    scrollToResults() {
        this.resultsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    openModal(type) {
        if (type === 'login') {
            this.loginModal.style.display = 'block';
        } else if (type === 'signup') {
            this.signupModal.style.display = 'block';
        }
        document.body.style.overflow = 'hidden';
    }

    closeModal(type) {
        if (type === 'login') {
            this.loginModal.style.display = 'none';
        } else if (type === 'signup') {
            this.signupModal.style.display = 'none';
        }
        document.body.style.overflow = 'auto';
    }

    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
        const password = formData.get('password') || e.target.querySelector('input[type="password"]').value;
        
        // Simulate login process
        this.showNotification('Login successful! Welcome back.', 'success');
        this.closeModal('login');
        
        // Update UI to show logged-in state
        this.updateAuthUI(email);
    }

    handleSignup(e) {
        e.preventDefault();
        const inputs = e.target.querySelectorAll('input');
        const name = inputs[0].value;
        const email = inputs[1].value;
        const password = inputs[2].value;
        
        // Simulate signup process
        this.showNotification('Account created successfully! Welcome to SmartDict.', 'success');
        this.closeModal('signup');
        
        // Update UI to show logged-in state
        this.updateAuthUI(email);
    }

    updateAuthUI(email) {
        // Update the auth buttons to show user info
        const authButtons = document.querySelector('.auth-buttons');
        authButtons.innerHTML = `
            <div class="user-info">
                <i class="fas fa-user-circle"></i>
                <span>${email.split('@')[0]}</span>
                <button class="logout-btn" onclick="app.logout()">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        `;
    }

    logout() {
        // Reset auth UI
        const authButtons = document.querySelector('.auth-buttons');
        authButtons.innerHTML = `
            <button class="auth-btn login-btn">
                <i class="fas fa-sign-in-alt"></i>
                Login
            </button>
            <button class="auth-btn signup-btn">
                <i class="fas fa-user-plus"></i>
                Sign Up
            </button>
        `;
        
        // Re-bind events for new buttons
        document.querySelector('.login-btn').addEventListener('click', () => this.openModal('login'));
        document.querySelector('.signup-btn').addEventListener('click', () => this.openModal('signup'));
        
        this.showNotification('Logged out successfully', 'info');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 3000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        return colors[type] || '#3498db';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DictionaryApp();
    
    // Add some sample searches for demonstration
    const sampleWords = ['serendipity', 'eloquent', 'ubiquitous'];
    console.log('Dictionary app loaded! Try searching for:', sampleWords.join(', '));
});
// Thesaurus JavaScript functionality
class ThesaurusApp {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        this.currentWord = '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.hideResults();
    }

    bindEvents() {
        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        const thesaurusInput = document.getElementById('thesaurusInput');
        const favoriteBtn = document.getElementById('favoriteBtn');

        // Search button click
        searchBtn.addEventListener('click', () => this.handleSearch());

        // Enter key press in search input
        thesaurusInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Input change for real-time validation
        thesaurusInput.addEventListener('input', (e) => {
            this.validateInput(e.target.value);
        });

        // Favorite button click
        favoriteBtn.addEventListener('click', () => this.toggleFavorite());

        // Modal functionality
        this.bindModalEvents();

        // Suggestion buttons are handled by onclick in HTML
    }

    bindModalEvents() {
        const loginBtn = document.querySelector('.login-btn');
        const signupBtn = document.querySelector('.signup-btn');
        const loginModal = document.getElementById('loginModal');
        const signupModal = document.getElementById('signupModal');
        const closeBtns = document.querySelectorAll('.close');

        // Open modals
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'block';
        });

        signupBtn.addEventListener('click', () => {
            signupModal.style.display = 'block';
        });

        // Close modals
        closeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Handle form submissions
        document.querySelectorAll('.auth-form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAuthSubmit(e.target);
            });
        });
    }

    handleSearch() {
        const input = document.getElementById('thesaurusInput');
        const word = input.value.trim().toLowerCase();

        if (!word) {
            this.showError('Please enter a word to search.');
            return;
        }

        if (word.length < 2) {
            this.showError('Please enter at least 2 characters.');
            return;
        }

        this.currentWord = word;
        this.showLoading();
        this.searchThesaurus(word);
    }

    validateInput(value) {
        const searchBtn = document.getElementById('searchBtn');
        if (value.trim().length >= 2) {
            searchBtn.disabled = false;
            searchBtn.style.opacity = '1';
        } else {
            searchBtn.disabled = true;
            searchBtn.style.opacity = '0.6';
        }
    }

    async searchThesaurus(word) {
        try {
            // Simulate API call with mock data
            await this.delay(1000); // Simulate network delay
            
            const results = this.getMockThesaurusData(word);
            
            if (results.synonyms.length === 0 && results.antonyms.length === 0) {
                this.showNoResults();
            } else {
                this.displayResults(word, results);
                this.addToSearchHistory(word);
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showError('An error occurred while searching. Please try again.');
        }
    }

    getMockThesaurusData(word) {
        // Mock thesaurus data for demonstration
        const thesaurusData = {
            'happy': {
                synonyms: ['joyful', 'cheerful', 'delighted', 'pleased', 'content', 'elated', 'glad', 'merry', 'upbeat', 'ecstatic'],
                antonyms: ['sad', 'unhappy', 'miserable', 'depressed', 'gloomy', 'melancholy']
            },
            'beautiful': {
                synonyms: ['gorgeous', 'stunning', 'attractive', 'lovely', 'pretty', 'elegant', 'magnificent', 'charming', 'exquisite', 'breathtaking'],
                antonyms: ['ugly', 'hideous', 'unattractive', 'plain', 'repulsive']
            },
            'intelligent': {
                synonyms: ['smart', 'clever', 'brilliant', 'wise', 'bright', 'sharp', 'astute', 'quick-witted', 'knowledgeable', 'intellectual'],
                antonyms: ['stupid', 'dumb', 'ignorant', 'foolish', 'unintelligent']
            },
            'strong': {
                synonyms: ['powerful', 'mighty', 'robust', 'sturdy', 'tough', 'solid', 'muscular', 'vigorous', 'firm', 'resilient'],
                antonyms: ['weak', 'frail', 'feeble', 'fragile', 'delicate']
            },
            'fast': {
                synonyms: ['quick', 'rapid', 'swift', 'speedy', 'hasty', 'brisk', 'fleet', 'lightning', 'expeditious', 'prompt'],
                antonyms: ['slow', 'sluggish', 'leisurely', 'gradual', 'delayed']
            },
            'big': {
                synonyms: ['large', 'huge', 'enormous', 'massive', 'giant', 'vast', 'immense', 'colossal', 'tremendous', 'gigantic'],
                antonyms: ['small', 'tiny', 'little', 'miniature', 'petite']
            },
            'good': {
                synonyms: ['excellent', 'great', 'wonderful', 'fantastic', 'superb', 'outstanding', 'remarkable', 'fine', 'terrific', 'marvelous'],
                antonyms: ['bad', 'terrible', 'awful', 'horrible', 'poor']
            },
            'bad': {
                synonyms: ['terrible', 'awful', 'horrible', 'dreadful', 'poor', 'wicked', 'evil', 'nasty', 'rotten', 'lousy'],
                antonyms: ['good', 'excellent', 'great', 'wonderful', 'fantastic']
            }
        };

        return thesaurusData[word] || { synonyms: [], antonyms: [] };
    }

    showLoading() {
        const resultsSection = document.getElementById('resultsSection');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const resultsContainer = document.getElementById('resultsContainer');

        resultsSection.style.display = 'block';
        loadingSpinner.style.display = 'block';
        resultsContainer.style.display = 'none';
    }

    hideResults() {
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'none';
    }

    displayResults(word, results) {
        const loadingSpinner = document.getElementById('loadingSpinner');
        const resultsContainer = document.getElementById('resultsContainer');
        const searchedWord = document.getElementById('searchedWord');
        const synonymsGrid = document.getElementById('synonymsGrid');
        const antonymsGrid = document.getElementById('antonymsGrid');
        const noResults = document.getElementById('noResults');

        // Hide loading and show results
        loadingSpinner.style.display = 'none';
        resultsContainer.style.display = 'block';
        noResults.style.display = 'none';

        // Set the searched word
        searchedWord.textContent = this.capitalizeFirst(word);

        // Update favorite button
        this.updateFavoriteButton(word);

        // Display synonyms
        this.displayWordList(synonymsGrid, results.synonyms, 'synonym');

        // Display antonyms
        this.displayWordList(antonymsGrid, results.antonyms, 'antonym');

        // Show/hide sections based on availability
        const synonymsSection = document.querySelector('.synonyms-section');
        const antonymsSection = document.querySelector('.antonyms-section');

        synonymsSection.style.display = results.synonyms.length > 0 ? 'block' : 'none';
        antonymsSection.style.display = results.antonyms.length > 0 ? 'block' : 'none';
    }

    displayWordList(container, words, type) {
        container.innerHTML = '';
        
        if (words.length === 0) {
            container.innerHTML = `<p class="no-words">No ${type}s found</p>`;
            return;
        }

        words.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-item';
            wordElement.innerHTML = `
                <span class="word-text">${word}</span>
                <button class="word-action" onclick="thesaurusApp.searchWord('${word}')" title="Search this word">
                    <i class="fas fa-search"></i>
                </button>
            `;
            container.appendChild(wordElement);
        });
    }

    showNoResults() {
        const loadingSpinner = document.getElementById('loadingSpinner');
        const resultsContainer = document.getElementById('resultsContainer');
        const noResults = document.getElementById('noResults');

        loadingSpinner.style.display = 'none';
        resultsContainer.style.display = 'none';
        noResults.style.display = 'block';
    }

    showError(message) {
        // Create or update error message
        let errorDiv = document.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            document.querySelector('.search-section').appendChild(errorDiv);
        }

        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        errorDiv.style.display = 'block';

        // Hide error after 3 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }

    // Function to be called from HTML onclick
    searchWord(word) {
        const input = document.getElementById('thesaurusInput');
        input.value = word;
        this.handleSearch();
    }

    toggleFavorite() {
        if (!this.currentWord) return;

        const favoriteBtn = document.getElementById('favoriteBtn');
        const icon = favoriteBtn.querySelector('i');

        if (this.favorites.includes(this.currentWord)) {
            // Remove from favorites
            this.favorites = this.favorites.filter(word => word !== this.currentWord);
            icon.className = 'far fa-heart';
            this.showNotification('Removed from favorites');
        } else {
            // Add to favorites
            this.favorites.push(this.currentWord);
            icon.className = 'fas fa-heart';
            this.showNotification('Added to favorites');
        }

        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    updateFavoriteButton(word) {
        const favoriteBtn = document.getElementById('favoriteBtn');
        const icon = favoriteBtn.querySelector('i');

        if (this.favorites.includes(word)) {
            icon.className = 'fas fa-heart';
        } else {
            icon.className = 'far fa-heart';
        }
    }

    addToSearchHistory(word) {
        if (!this.searchHistory.includes(word)) {
            this.searchHistory.unshift(word);
            // Keep only last 10 searches
            this.searchHistory = this.searchHistory.slice(0, 10);
            localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
        }
    }

    handleAuthSubmit(form) {
        const formData = new FormData(form);
        const isLogin = form.closest('#loginModal') !== null;
        
        // Simulate authentication
        this.showNotification(isLogin ? 'Login successful!' : 'Account created successfully!');
        form.closest('.modal').style.display = 'none';
        form.reset();
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.thesaurusApp = new ThesaurusApp();
});

// Global function for HTML onclick events
function searchWord(word) {
    if (window.thesaurusApp) {
        window.thesaurusApp.searchWord(word);
    }
}
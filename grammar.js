// Grammar page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeGrammarPage();
});

// Grammar quiz data
const quizQuestions = [
    {
        question: "Which sentence uses correct subject-verb agreement?",
        options: [
            "The team are playing well.",
            "The team is playing well.",
            "The team were playing well.",
            "The team have playing well."
        ],
        correct: 1,
        explanation: "Collective nouns like 'team' are usually treated as singular, so they take singular verbs."
    },
    {
        question: "Choose the correct sentence:",
        options: [
            "I have less friends than you.",
            "I have fewer friends than you.",
            "I have lesser friends than you.",
            "I have few friends than you."
        ],
        correct: 1,
        explanation: "Use 'fewer' with countable nouns (friends) and 'less' with uncountable nouns."
    },
    {
        question: "Which sentence is punctuated correctly?",
        options: [
            "I bought apples, oranges, and bananas.",
            "I bought apples, oranges and bananas.",
            "I bought apples oranges, and bananas.",
            "I bought apples, oranges, bananas."
        ],
        correct: 0,
        explanation: "The Oxford comma (before 'and' in a series) helps clarify meaning and is generally recommended."
    },
    {
        question: "Select the sentence with proper tense usage:",
        options: [
            "If I was rich, I would travel the world.",
            "If I were rich, I would travel the world.",
            "If I am rich, I would travel the world.",
            "If I will be rich, I would travel the world."
        ],
        correct: 1,
        explanation: "Use the subjunctive mood 'were' for hypothetical situations, not 'was'."
    },
    {
        question: "Which preposition is correct?",
        options: [
            "I'll meet you in Monday.",
            "I'll meet you at Monday.",
            "I'll meet you on Monday.",
            "I'll meet you by Monday."
        ],
        correct: 2,
        explanation: "Use 'on' with specific days of the week."
    },
    {
        question: "Choose the correct article usage:",
        options: [
            "I need a advice from you.",
            "I need an advice from you.",
            "I need the advice from you.",
            "I need advice from you."
        ],
        correct: 3,
        explanation: "'Advice' is an uncountable noun and doesn't need an article in this context."
    },
    {
        question: "Which sentence avoids a dangling modifier?",
        options: [
            "Walking to school, the rain started falling.",
            "Walking to school, I felt the rain start falling.",
            "The rain started falling walking to school.",
            "Walking to school, it started raining."
        ],
        correct: 1,
        explanation: "The subject 'I' clearly performs the action 'walking', avoiding the dangling modifier."
    },
    {
        question: "Select the grammatically correct sentence:",
        options: [
            "Between you and I, this is important.",
            "Between you and me, this is important.",
            "Between yourself and I, this is important.",
            "Between yourself and myself, this is important."
        ],
        correct: 1,
        explanation: "After prepositions like 'between', use object pronouns (me, him, her, us, them)."
    },
    {
        question: "Which sentence uses the apostrophe correctly?",
        options: [
            "The dog's are barking loudly.",
            "The dogs' are barking loudly.",
            "The dogs are barking loudly.",
            "The dog's barking loudly."
        ],
        correct: 2,
        explanation: "No apostrophe is needed for plural nouns that aren't possessive."
    },
    {
        question: "Choose the sentence with correct parallel structure:",
        options: [
            "I like reading, writing, and to paint.",
            "I like reading, writing, and painting.",
            "I like to read, writing, and painting.",
            "I like reading, to write, and painting."
        ],
        correct: 1,
        explanation: "Parallel structure requires all items in a series to have the same grammatical form."
    }
];

// Grammar rules data
const grammarRules = {
    tenses: {
        title: "Verb Tenses",
        content: `
            <h3>Understanding Verb Tenses</h3>
            <div class="rule-section">
                <h4>Present Tense</h4>
                <ul>
                    <li><strong>Simple Present:</strong> I walk to school. (habitual actions)</li>
                    <li><strong>Present Continuous:</strong> I am walking to school. (ongoing actions)</li>
                    <li><strong>Present Perfect:</strong> I have walked to school. (completed actions with present relevance)</li>
                </ul>
            </div>
            <div class="rule-section">
                <h4>Past Tense</h4>
                <ul>
                    <li><strong>Simple Past:</strong> I walked to school. (completed actions)</li>
                    <li><strong>Past Continuous:</strong> I was walking to school. (ongoing past actions)</li>
                    <li><strong>Past Perfect:</strong> I had walked to school. (actions completed before another past action)</li>
                </ul>
            </div>
            <div class="rule-section">
                <h4>Future Tense</h4>
                <ul>
                    <li><strong>Simple Future:</strong> I will walk to school. (future actions)</li>
                    <li><strong>Future Continuous:</strong> I will be walking to school. (ongoing future actions)</li>
                    <li><strong>Future Perfect:</strong> I will have walked to school. (actions completed by a future time)</li>
                </ul>
            </div>
        `
    },
    punctuation: {
        title: "Punctuation Rules",
        content: `
            <h3>Essential Punctuation Guidelines</h3>
            <div class="rule-section">
                <h4>Comma Usage</h4>
                <ul>
                    <li>Use commas to separate items in a series: "I bought apples, oranges, and bananas."</li>
                    <li>Use commas before coordinating conjunctions: "I wanted to go, but it was raining."</li>
                    <li>Use commas after introductory elements: "After the movie, we went home."</li>
                    <li>Use commas around non-essential information: "My brother, who lives in Tokyo, is visiting."</li>
                </ul>
            </div>
            <div class="rule-section">
                <h4>Semicolon Usage</h4>
                <ul>
                    <li>Connect related independent clauses: "I love reading; it relaxes me."</li>
                    <li>Separate items in a complex series: "I visited Paris, France; Rome, Italy; and Madrid, Spain."</li>
                </ul>
            </div>
            <div class="rule-section">
                <h4>Apostrophe Usage</h4>
                <ul>
                    <li>Show possession: "The cat's toy" (singular), "The cats' toys" (plural)</li>
                    <li>Form contractions: "don't" (do not), "it's" (it is)</li>
                    <li>Note: "its" (possessive) vs "it's" (it is)</li>
                </ul>
            </div>
        `
    },
    articles: {
        title: "Articles (A, An, The)",
        content: `
            <h3>Using Articles Correctly</h3>
            <div class="rule-section">
                <h4>Indefinite Articles (A, An)</h4>
                <ul>
                    <li>Use "a" before consonant sounds: "a book," "a university" (u sounds like "you")</li>
                    <li>Use "an" before vowel sounds: "an apple," "an hour" (h is silent)</li>
                    <li>Use with singular countable nouns when introducing something new</li>
                </ul>
            </div>
            <div class="rule-section">
                <h4>Definite Article (The)</h4>
                <ul>
                    <li>Use when both speaker and listener know what is being referred to</li>
                    <li>Use with superlatives: "the best," "the tallest"</li>
                    <li>Use with unique things: "the sun," "the moon"</li>
                    <li>Use with specific groups: "the elderly," "the poor"</li>
                </ul>
            </div>
            <div class="rule-section">
                <h4>No Article</h4>
                <ul>
                    <li>With uncountable nouns in general: "I love music" (not "the music")</li>
                    <li>With plural nouns in general: "Dogs are loyal" (not "The dogs")</li>
                    <li>With proper nouns: "John," "Paris" (exceptions: "the United States")</li>
                </ul>
            </div>
        `
    },
    prepositions: {
        title: "Prepositions",
        content: `
            <h3>Common Preposition Usage</h3>
            <div class="rule-section">
                <h4>Time Prepositions</h4>
                <ul>
                    <li><strong>In:</strong> months, years, seasons, parts of day - "in January," "in 2023," "in the morning"</li>
                    <li><strong>On:</strong> specific days, dates - "on Monday," "on December 25th"</li>
                    <li><strong>At:</strong> specific times - "at 3 o'clock," "at noon," "at midnight"</li>
                </ul>
            </div>
            <div class="rule-section">
                <h4>Place Prepositions</h4>
                <ul>
                    <li><strong>In:</strong> enclosed spaces - "in the room," "in the car," "in London"</li>
                    <li><strong>On:</strong> surfaces, floors, streets - "on the table," "on the second floor," "on Main Street"</li>
                    <li><strong>At:</strong> specific points, addresses - "at the corner," "at 123 Oak Street," "at school"</li>
                </ul>
            </div>
            <div class="rule-section">
                <h4>Common Prepositional Phrases</h4>
                <ul>
                    <li>Interested <strong>in</strong> something</li>
                    <li>Good <strong>at</strong> something</li>
                    <li>Afraid <strong>of</strong> something</li>
                    <li>Depend <strong>on</strong> something</li>
                    <li>Listen <strong>to</strong> something</li>
                </ul>
            </div>
        `
    },
    subjectverb: {
        title: "Subject-Verb Agreement",
        content: `
            <h3>Subject-Verb Agreement Rules</h3>
            <div class="rule-section">
                <h4>Basic Rules</h4>
                <ul>
                    <li>Singular subjects take singular verbs: "The cat runs."</li>
                    <li>Plural subjects take plural verbs: "The cats run."</li>
                    <li>Third person singular (he, she, it) adds -s to the verb: "She walks."</li>
                </ul>
            </div>
            <div class="rule-section">
                <h4>Special Cases</h4>
                <ul>
                    <li><strong>Collective nouns:</strong> Usually singular - "The team is winning."</li>
                    <li><strong>Compound subjects with 'and':</strong> Usually plural - "Tom and Jerry are friends."</li>
                    <li><strong>Subjects with 'or'/'nor':</strong> Agree with the nearest subject - "Neither the teacher nor the students are ready."</li>
                    <li><strong>Indefinite pronouns:</strong> Everyone, someone, anyone = singular; Both, few, many = plural</li>
                </ul>
            </div>
            <div class="rule-section">
                <h4>Tricky Situations</h4>
                <ul>
                    <li><strong>Inverted order:</strong> "There are many books on the shelf."</li>
                    <li><strong>Relative clauses:</strong> "One of the students who are here..."</li>
                    <li><strong>Amounts:</strong> "Five dollars is enough." (treated as one unit)</li>
                </ul>
            </div>
        `
    },
    modifiers: {
        title: "Modifiers (Adjectives & Adverbs)",
        content: `
            <h3>Using Modifiers Correctly</h3>
            <div class="rule-section">
                <h4>Adjectives vs Adverbs</h4>
                <ul>
                    <li><strong>Adjectives</strong> modify nouns: "The quick cat" (not "The quickly cat")</li>
                    <li><strong>Adverbs</strong> modify verbs, adjectives, or other adverbs: "She runs quickly"</li>
                    <li>Many adverbs end in -ly: quick → quickly, careful → carefully</li>
                </ul>
            </div>
            <div class="rule-section">
                <h4>Comparative and Superlative</h4>
                <ul>
                    <li><strong>One syllable:</strong> fast → faster → fastest</li>
                    <li><strong>Two syllables ending in -y:</strong> happy → happier → happiest</li>
                    <li><strong>Longer adjectives:</strong> beautiful → more beautiful → most beautiful</li>
                    <li><strong>Irregular:</strong> good → better → best; bad → worse → worst</li>
                </ul>
            </div>
            <div class="rule-section">
                <h4>Avoiding Dangling Modifiers</h4>
                <ul>
                    <li><strong>Wrong:</strong> "Walking to school, the rain started falling."</li>
                    <li><strong>Right:</strong> "Walking to school, I felt the rain start falling."</li>
                    <li>Make sure the modifier clearly refers to the right noun</li>
                </ul>
            </div>
        `
    }
};

// Quiz state
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let quizStarted = false;

// Initialize the grammar page
function initializeGrammarPage() {
    loadQuestion();
    updateScore();
}

// Grammar Rules Functions
function showRules(category) {
    const modal = document.getElementById('ruleModal');
    const content = document.getElementById('ruleContent');
    
    if (grammarRules[category]) {
        content.innerHTML = grammarRules[category].content;
        modal.style.display = 'block';
    }
}

function closeModal() {
    document.getElementById('ruleModal').style.display = 'none';
}

// Quiz Functions
function loadQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        showQuizComplete();
        return;
    }
    
    const question = quizQuestions[currentQuestion];
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('quizOptions');
    
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';
    selectedAnswer = null;
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.innerHTML = `
            <input type="radio" id="option${index}" name="quizOption" value="${index}">
            <label for="option${index}">${option}</label>
        `;
        optionDiv.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(optionDiv);
    });
    
    // Reset submit button
    const submitBtn = document.querySelector('.quiz-btn:not(.secondary)');
    submitBtn.textContent = 'Submit Answer';
    submitBtn.disabled = false;
}

function selectAnswer(answerIndex) {
    selectedAnswer = answerIndex;
    
    // Update visual feedback
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((option, index) => {
        option.classList.remove('selected');
        if (index === answerIndex) {
            option.classList.add('selected');
        }
    });
    
    // Check the radio button
    document.getElementById(`option${answerIndex}`).checked = true;
}

function submitAnswer() {
    if (selectedAnswer === null) {
        alert('Please select an answer first!');
        return;
    }
    
    const question = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    const submitBtn = document.querySelector('.quiz-btn:not(.secondary)');
    
    // Show correct/incorrect feedback
    options.forEach((option, index) => {
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedAnswer && index !== question.correct) {
            option.classList.add('incorrect');
        }
    });
    
    // Update score
    if (selectedAnswer === question.correct) {
        score++;
        updateScore();
    }
    
    // Show explanation
    showExplanation(question.explanation);
    
    // Update submit button
    submitBtn.textContent = 'Answer Submitted';
    submitBtn.disabled = true;
}

function showExplanation(explanation) {
    const questionText = document.getElementById('questionText');
    const originalText = questionText.textContent;
    
    questionText.innerHTML = `
        ${originalText}
        <div class="explanation">
            <strong>Explanation:</strong> ${explanation}
        </div>
    `;
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}

function showQuizComplete() {
    const quizContainer = document.getElementById('quizContainer');
    const percentage = Math.round((score / quizQuestions.length) * 100);
    
    let message = '';
    if (percentage >= 90) {
        message = 'Excellent! You have a strong grasp of grammar rules.';
    } else if (percentage >= 70) {
        message = 'Good work! Keep practicing to improve further.';
    } else if (percentage >= 50) {
        message = 'Not bad! Review the grammar rules to strengthen your knowledge.';
    } else {
        message = 'Keep studying! Grammar takes practice to master.';
    }
    
    quizContainer.innerHTML = `
        <div class="quiz-complete">
            <h3>Quiz Complete!</h3>
            <div class="final-score">
                <p>Your Score: <strong>${score}/${quizQuestions.length}</strong> (${percentage}%)</p>
            </div>
            <p>${message}</p>
            <div class="quiz-controls">
                <button class="quiz-btn" onclick="restartQuiz()">Take Quiz Again</button>
                <button class="quiz-btn secondary" onclick="reviewRules()">Review Grammar Rules</button>
            </div>
        </div>
    `;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    updateScore();
    
    // Reset quiz container
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = `
        <div class="quiz-question">
            <p id="questionText">Loading question...</p>
            <div class="quiz-options" id="quizOptions">
                <!-- Options will be populated by JavaScript -->
            </div>
            <div class="quiz-controls">
                <button class="quiz-btn" onclick="submitAnswer()">Submit Answer</button>
                <button class="quiz-btn secondary" onclick="nextQuestion()">Next Question</button>
            </div>
        </div>
        <div class="quiz-score">
            Score: <span id="quizScore">0</span>/10
        </div>
    `;
    
    loadQuestion();
}

function reviewRules() {
    // Scroll to grammar rules section
    document.querySelector('.grammar-rules').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function updateScore() {
    const scoreElement = document.getElementById('quizScore');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

// Auth Functions
function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

function showSignup() {
    document.getElementById('signupModal').style.display = 'block';
}

function closeAuthModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Handle form submissions (basic implementation)
document.addEventListener('submit', function(event) {
    event.preventDefault();
    
    if (event.target.closest('#loginModal')) {
        alert('Login functionality would be implemented here.');
        closeAuthModal('loginModal');
    } else if (event.target.closest('#signupModal')) {
        alert('Sign up functionality would be implemented here.');
        closeAuthModal('signupModal');
    }
});

// Keyboard navigation for quiz
document.addEventListener('keydown', function(event) {
    if (event.target.closest('.grammar-quiz')) {
        const options = document.querySelectorAll('.quiz-option');
        const currentSelected = document.querySelector('.quiz-option.selected');
        
        if (event.key >= '1' && event.key <= '4') {
            const optionIndex = parseInt(event.key) - 1;
            if (options[optionIndex]) {
                selectAnswer(optionIndex);
            }
        } else if (event.key === 'Enter') {
            if (currentSelected && selectedAnswer !== null) {
                submitAnswer();
            }
        }
    }
});

// Initialize tooltips for grammar rules
function addTooltips() {
    const categories = document.querySelectorAll('.rule-category');
    categories.forEach(category => {
        category.addEventListener('mouseenter', function() {
            // Add hover effect
            this.style.transform = 'translateY(-2px)';
        });
        
        category.addEventListener('mouseleave', function() {
            // Remove hover effect
            this.style.transform = 'translateY(0)';
        });
    });
}

// Call initialization functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addTooltips();
});
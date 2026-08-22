// ==========================================================================
// MULTI-HOSPITAL CONFIGURATION
// ==========================================================================
const HOSPITAL_CONFIG = {
    demo_hospital: { name: "ABC Hospital", logo: "🏥", primaryColor: "#2563eb" },
    hosp_A: { name: "City General", logo: "🏢", primaryColor: "#059669" },
    hosp_B: { name: "Valley Health", logo: "🩺", primaryColor: "#7c3aed" }
};

const params = new URLSearchParams(window.location.search);
const hospitalId = params.get('hospitalId') || 'demo_hospital';
if (!params.has('hospitalId')) {
    console.warn("No hospitalId found in URL. Falling back to 'demo_hospital'.");
}

const currentHospital = HOSPITAL_CONFIG[hospitalId] || HOSPITAL_CONFIG['demo_hospital'];
document.documentElement.style.setProperty('--brand-primary', currentHospital.primaryColor);
document.getElementById('hospitalName').textContent = currentHospital.name;
document.getElementById('hospitalLogo').textContent = currentHospital.logo;

// ==========================================================================
// DATA STRUCTURE FOR FIREBASE (ZERO-PII COMPLIANT)
// ==========================================================================
let feedbackData = {
    hospitalId: hospitalId,
    categories: {}, 
    tags: {},
    comment: "",
    timestamp: null
};

// ==========================================================================
// CONFIGURATIONS
// ==========================================================================
const CATEGORIES = [
    { id: 'Doctor', icon: '👨‍⚕️', text: 'Doctor', tags: ['Listened well', 'Explained clearly', 'Felt rushed', 'Very kind'] },
    { id: 'Nursing', icon: '👩‍⚕️', text: 'Nursing', tags: ['Caring', 'Responsive', 'Gentle', 'Unavailable'] },
    { id: 'Staff', icon: '🤝', text: 'Staff', tags: ['Helpful', 'Polite', 'Rude', 'Efficient'] },
    { id: 'Cleanliness', icon: '🧹', text: 'Cleanliness', tags: ['Spotless', 'Bathroom dirty', 'Dusty', 'Smelled nice'] },
    { id: 'Facilities', icon: '🏥', text: 'Facilities', tags: ['Comfortable', 'Noisy', 'Cold', 'Modern'] },
    { id: 'Waiting Time', icon: '⏱️', text: 'Waiting Time', tags: ['Very fast', 'Reasonable', 'Long', 'Unacceptable'] },
    { id: 'Billing', icon: '💳', text: 'Billing', tags: ['Clear', 'Confusing', 'Fast', 'Errors'] }
];

const RATING_RESPONSES = {
    5: "Wonderful! ❤️",
    4: "Great! 😊",
    3: "Good 🙂",
    2: "We're sorry. We'd like to improve.",
    1: "We're sorry. Please tell us how we can do better."
};

// ==========================================================================
// STATE & DOM
// ==========================================================================
let currentScreen = 'welcome';
let activeCategory = null;

const screens = {
    welcome: document.getElementById('screen-welcome'),
    categories: document.getElementById('screen-categories'),
    categoryRating: document.getElementById('screen-category-rating'),
    followupTags: document.getElementById('screen-followup-tags'),
    confirmation: document.getElementById('screen-confirmation'),
    text: document.getElementById('screen-text'),
    terms: document.getElementById('screen-terms'),
    review: document.getElementById('screen-review'),
    thankyou: document.getElementById('screen-thankyou')
};

const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const categoriesList = document.getElementById('categoriesList');
const doneCategoriesAction = document.getElementById('doneCategoriesAction');

// ==========================================================================
// RIPPLE EFFECT LOGIC
// ==========================================================================
document.addEventListener('click', function (e) {
    const target = e.target.closest('.ripple-btn');
    if (!target) return;
    
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${e.clientX - rect.left - radius}px`;
    ripple.style.top = `${e.clientY - rect.top - radius}px`;
    ripple.classList.add('ripple');
    
    // Remove existing ripples if any
    const existingRipple = target.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    target.appendChild(ripple);
    setTimeout(() => { ripple.remove(); }, 600);
});

// ==========================================================================
// NAVIGATION & PROGRESS
// ==========================================================================
function showScreen(screenName) {
    if (screens[currentScreen]) {
        screens[currentScreen].classList.remove('active');
        screens[currentScreen].classList.add('exit');
        const prevScreen = screens[currentScreen];
        setTimeout(() => prevScreen.classList.remove('exit'), 400);
    }
    
    currentScreen = screenName;
    
    setTimeout(() => {
        screens[screenName].classList.add('active');
        updateProgress();
        triggerStaggerAnimation(screens[screenName]);
    }, 400);
}

function triggerStaggerAnimation(screenElement) {
    const list = screenElement.querySelector('.staggered-list');
    if (list) {
        const items = list.querySelectorAll('.stagger-item, .category-row-btn, .quick-tag-btn, .review-item');
        items.forEach(i => i.classList.remove('show'));
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('stagger-item', 'show');
            }, 50 * index);
        });
    }
}

function updateProgress() {
    if (currentScreen === 'welcome' || currentScreen === 'thankyou') {
        progressContainer.style.opacity = '0';
        return;
    }
    progressContainer.style.opacity = '1';
    
    const total = CATEGORIES.length;
    const rated = Object.keys(feedbackData.categories).length;
    let percent = 0;
    
    if (currentScreen === 'categories' || currentScreen === 'categoryRating' || currentScreen === 'followupTags' || currentScreen === 'confirmation') {
        percent = 10 + Math.min(50, (rated / total) * 50);
    } else if (currentScreen === 'text') percent = 70;
    else if (currentScreen === 'terms') percent = 85;
    else if (currentScreen === 'review') percent = 95;
    
    progressBar.style.width = `${percent}%`;
}

// ==========================================================================
// FLOW CONTROLLERS
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { document.getElementById('ambulance-enter').classList.add('animate'); }, 500);
    renderCategoryMenu();
    
    // Help button pulse
    setTimeout(() => {
        const btn = document.getElementById('helpBtn');
        btn.classList.add('pulse-once');
        setTimeout(() => btn.classList.remove('pulse-once'), 1500);
    }, 2000);
});

document.getElementById('startBtn').addEventListener('click', () => { showScreen('categories'); });

// Category Menu
function renderCategoryMenu() {
    categoriesList.innerHTML = '';
    CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-row-btn ripple-btn';
        btn.innerHTML = `<span class="icon">${cat.icon}</span><span class="text">${cat.text}</span>`;
        
        if (feedbackData.categories[cat.id] !== undefined) {
            btn.classList.add('completed');
            btn.innerHTML += `<span style="margin-left:auto;">✅</span>`;
        } else {
            btn.addEventListener('click', () => {
                activeCategory = cat;
                setupCategoryRating();
                showScreen('categoryRating');
            });
        }
        categoriesList.appendChild(btn);
    });
    
    if (Object.keys(feedbackData.categories).length > 0) {
        doneCategoriesAction.style.display = 'block';
        document.getElementById('categoryMenuTitle').textContent = "Want to tell us about something else?";
    }
}
document.getElementById('doneCategoriesBtn').addEventListener('click', () => { showScreen('text'); });

// Single Category Rating
function setupCategoryRating() {
    document.getElementById('dynamicCategoryQuestion').textContent = `How was the ${activeCategory.id.toLowerCase()}?`;
    const resp = document.getElementById('dynamicRatingResponse');
    resp.classList.remove('show');
    
    const container = document.getElementById('dynamicStarsContainer');
    const stars = container.querySelectorAll('.star');
    stars.forEach(s => {
        s.classList.remove('active', 'pop', 'pop-glow');
        const newStar = s.cloneNode(true);
        s.parentNode.replaceChild(newStar, s);
    });
    
    container.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', () => {
            const val = parseInt(star.getAttribute('data-value'));
            feedbackData.categories[activeCategory.id] = val;
            
            container.querySelectorAll('.star').forEach(s => {
                const sv = parseInt(s.getAttribute('data-value'));
                if (sv <= val) {
                    s.classList.add('active', val === 5 && sv === 5 ? 'pop-glow' : 'pop');
                    setTimeout(() => s.classList.remove('pop', 'pop-glow'), 600);
                } else {
                    s.classList.remove('active');
                }
            });
            
            resp.textContent = RATING_RESPONSES[val] || "Recorded";
            resp.classList.add('show');
            
            setTimeout(() => {
                setupFollowupTags();
                showScreen('followupTags');
            }, 1000);
        });
    });
}

// Follow-up Tags
function setupFollowupTags() {
    document.getElementById('followupTagsQuestion').textContent = `Anything about the ${activeCategory.id.toLowerCase()}?`;
    const container = document.getElementById('followupTagsContainer');
    container.innerHTML = '';
    
    activeCategory.tags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'quick-tag-btn ripple-btn';
        btn.textContent = tag;
        btn.addEventListener('click', () => {
            feedbackData.tags[activeCategory.id] = tag;
            showConfirmation();
        });
        container.appendChild(btn);
    });
}
document.getElementById('skipTagsBtn').addEventListener('click', () => { showConfirmation(); });

// Confirmation
function showConfirmation() {
    showScreen('confirmation');
    setTimeout(() => {
        renderCategoryMenu();
        showScreen('categories');
    }, 1500);
}

// Text Comment
document.getElementById('skipTextBtn').addEventListener('click', () => {
    feedbackData.comment = "";
    showScreen('terms');
});
document.getElementById('continueTextBtn').addEventListener('click', () => {
    feedbackData.comment = document.getElementById('feedbackText').value.trim();
    showScreen('terms');
});

// Terms
document.getElementById('termsCheckbox').addEventListener('change', (e) => {
    document.getElementById('termsNextBtn').disabled = !e.target.checked;
});
document.getElementById('termsNextBtn').addEventListener('click', prepareReviewScreen);

// Review Screen
function prepareReviewScreen() {
    const container = document.getElementById('reviewContainer');
    container.innerHTML = '';
    
    for (const [cat, val] of Object.entries(feedbackData.categories)) {
        const div = document.createElement('div');
        div.className = 'review-item ripple-btn'; // Make list items ripple on touch
        const tag = feedbackData.tags[cat];
        div.innerHTML = `
            <span class="review-label">${cat} ${tag ? ` <span style="font-weight:normal; font-size:12px; color:var(--text-muted);">(${tag})</span>` : ''}</span>
            <span class="review-stars">${'⭐'.repeat(val)}</span>
        `;
        container.appendChild(div);
    }
    
    if (feedbackData.comment) {
        const div = document.createElement('div');
        div.className = 'review-item ripple-btn';
        div.innerHTML = `<span class="review-label">Comment</span><span class="review-value">Anonymous</span>`;
        container.appendChild(div);
    }
    showScreen('review');
}

// Submit & Confetti
document.getElementById('submitFeedbackBtn').addEventListener('click', () => {
    const btn = document.getElementById('submitFeedbackBtn');
    btn.querySelector('.btn-text').style.display = 'none';
    document.getElementById('submitSpinner').style.display = 'inline-block';
    
    feedbackData.timestamp = new Date().toISOString();
    saveFeedback(feedbackData);
    
    setTimeout(() => {
        progressBar.style.width = `100%`;
        showScreen('thankyou');
        
        // Confetti
        createConfetti();
        
        setTimeout(() => { document.getElementById('ambulance-exit').classList.add('animate'); }, 1500);
        setTimeout(() => { document.getElementById('farewellText').style.opacity = '1'; }, 2500);
    }, 1000); // Simulate network delay
});

function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = [currentHospital.primaryColor, '#F59E0B', '#10B981', '#EF4444', '#3B82F6'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti fall';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(confetti);
    }
}

// ==========================================================================
// FIREBASE (ZERO-PII COMPLIANT)
// ==========================================================================
function saveFeedback(data) {
    // NOTE: This Zero-PII structure keeps the data classified as an anonymous 
    // business review rather than medical data.
    // This will later be swapped for a Firestore write scoped by hospitalId.
    console.log("=== FINAL ANONYMOUS FEEDBACK READY FOR FIRESTORE ===");
    console.log(JSON.stringify(data, null, 2));
    console.log("====================================================");
}

// ==========================================================================
// HELP MODAL
// ==========================================================================
const helpModal = document.getElementById('helpModal');
document.getElementById('helpBtn').addEventListener('click', () => {
    helpModal.classList.add('active');
    triggerStaggerAnimation(helpModal);
});
document.getElementById('closeHelpBtn').addEventListener('click', () => { helpModal.classList.remove('active'); });
helpModal.addEventListener('click', (e) => { if (e.target === helpModal) helpModal.classList.remove('active'); });

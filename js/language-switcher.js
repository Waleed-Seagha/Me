// Language Switcher Script

// Default language is English
let currentLanguage = localStorage.getItem('language') || 'en';

// Function to set the page direction based on language
function setPageDirection(language) {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
}

// Function to update all translatable elements on the page
function updatePageContent(language) {
    // Update navigation menu items
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });

    // Update page title if available
    const pageTitle = document.querySelector('title');
    if (pageTitle) {
        const pageName = window.location.pathname.split('/').pop().split('.')[0];
        if (pageName === 'index' || pageName === '') {
            pageTitle.textContent = 'Portfolio Waleed';
        } else if (translations[language][pageName]) {
            pageTitle.textContent = translations[language][pageName] + ' - Waleed';
        }
    }

    // Update button text if available
    const hireButton = document.querySelector('.b1');
    const resumeButton = document.querySelector('.b2');
    
    if (hireButton && translations[language]['hire_me']) {
        hireButton.value = translations[language]['hire_me'];
    }
    
    if (resumeButton && translations[language]['download_resume']) {
        resumeButton.value = translations[language]['download_resume'];
    }

    // Update language switcher buttons active state
    const arButton = document.getElementById('lang-ar');
    const enButton = document.getElementById('lang-en');
    
    if (arButton && enButton) {
        if (language === 'ar') {
            arButton.classList.add('active-lang');
            enButton.classList.remove('active-lang');
        } else {
            enButton.classList.add('active-lang');
            arButton.classList.remove('active-lang');
        }
    }
}

// Function to switch language
function switchLanguage(language) {
    currentLanguage = language;
    localStorage.setItem('language', language);
    setPageDirection(language);
    updatePageContent(language);
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    const langEnBtn = document.getElementById('lang-en');
    const langArBtn = document.getElementById('lang-ar');
    const html = document.documentElement;

    // Set initial language
    const savedLang = localStorage.getItem('language') || 'ar';
    html.lang = savedLang;
    updateLanguageButtons(savedLang);

    // Language switch functionality
    langEnBtn.addEventListener('click', () => {
        html.lang = 'en';
        localStorage.setItem('language', 'en');
        updateLanguageButtons('en');
        updateContent('en');
    });

    langArBtn.addEventListener('click', () => {
        html.lang = 'ar';
        localStorage.setItem('language', 'ar');
        updateLanguageButtons('ar');
        updateContent('ar');
    });

    function updateLanguageButtons(lang) {
        if (lang === 'en') {
            langEnBtn.classList.add('active-lang');
            langArBtn.classList.remove('active-lang');
        } else {
            langArBtn.classList.add('active-lang');
            langEnBtn.classList.remove('active-lang');
        }
    }

    function updateContent(lang) {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }
});
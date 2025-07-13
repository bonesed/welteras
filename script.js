document.addEventListener('DOMContentLoaded', function() {

    /**
     * Countdown Timer for Campaign
     */
    function setupCountdown() {
        const countdownElement = document.getElementById('countdown');
        if (!countdownElement) return;

        // Set the end date for the campaign (October 31, 2025)
        // A more robust way to set the date to avoid parsing issues across browsers.
        // Note: Month is 0-indexed, so 9 represents October.
        const campaignEndDate = new Date(2025, 10, 3, 23, 59, 59).getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = campaignEndDate - now;

            if (distance < 0) {
                countdownElement.innerHTML = "<div>キャンペーンは終了しました</div>";
                if (typeof interval !== 'undefined') {
                    clearInterval(interval);
                }
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').innerText = String(days).padStart(2, '0');
            document.getElementById('hours').innerText = String(hours).padStart(2, '0');
            document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
            document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
        };

        const interval = setInterval(updateTimer, 1000);
        updateTimer(); // Initial call
    }

    /**
     * Scroll Animation
     * Fades in sections as they enter the viewport
     */
    function setupScrollAnimations() {
        const sections = document.querySelectorAll('.section');
        if (sections.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); 
                }
            });
        }, {
            root: null,
            threshold: 0.1
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    /**
     * Form Submission Handler (for pre-registration)
     * Submits data to a Google Form in the background without leaving the page.
     */
    function setupFormHandler() {
        const form = document.getElementById('register-form');
        if (!form) return;

        let submitted = false;

        form.addEventListener('submit', function(e) {
            // Check if the action URL is still a placeholder
            if (form.action.includes('【')) {
                e.preventDefault();
                alert('フォームがまだ設定されていません。');
                return;
            }
            // Check if privacy policy is checked
            const privacyCheckbox = form.querySelector('input[name="privacy"]');
            if (privacyCheckbox && !privacyCheckbox.checked) {
                e.preventDefault();
                alert('プライバシーポリシーに同意してください。');
                return;
            }
            
            form.target = 'hidden_iframe';
            submitted = true;
        });

        const iframe = document.createElement('iframe');
        iframe.name = 'hidden_iframe';
        iframe.id = 'hidden_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        iframe.addEventListener('load', function() {
            if (submitted) {
                const ctaContainer = document.getElementById('campaign-cta-container');
                if (ctaContainer) {
                    ctaContainer.innerHTML = `
                        <h3 class="cta-title">ご登録ありがとうございます！</h3>
                        <p>リリース情報を楽しみにお待ちください。</p>
                    `;
                }
            }
        });
    }

    // Initialize all functions
    setupCountdown();
    setupScrollAnimations();
    setupFormHandler();

});


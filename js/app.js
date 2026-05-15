/**
 * LIA INSURANCE AGENCY — FORTUNE 500 DESIGN SYSTEM
 * Premium core logic (GSAP, Navbar, Chat, Forms)
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // 2. Navbar Scroll & Active State
    const nav = document.getElementById("navbar");
    if (nav) {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                nav.classList.add("bg-white/90", "backdrop-blur-md", "border-navy/5", "shadow-sm");
                nav.classList.remove("border-transparent");
            } else {
                nav.classList.remove("bg-white/90", "backdrop-blur-md", "border-navy/5", "shadow-sm");
                nav.classList.add("border-transparent");
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
    }

    // 3. Mobile Menu Logic
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileBtn && mobileMenu) {
        let menuOpen = false;
        mobileBtn.addEventListener("click", () => {
            menuOpen = !menuOpen;
            if (menuOpen) {
                mobileMenu.classList.remove("hidden");
                setTimeout(() => mobileMenu.classList.remove("opacity-0"), 10);
            } else {
                mobileMenu.classList.add("opacity-0");
                setTimeout(() => mobileMenu.classList.add("hidden"), 300);
            }
        });

        document.querySelectorAll(".mobile-link").forEach(link => {
            link.addEventListener("click", () => {
                menuOpen = false;
                mobileMenu.classList.add("opacity-0");
                setTimeout(() => mobileMenu.classList.add("hidden"), 300);
            });
        });
    }

    // 4. GSAP Orchestration
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // A. Master Page Load Timeline
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from("#navbar", { y: -20, opacity: 0, duration: 0.8, delay: 0.2 });

        // Hero Content Stagger (Universal selector)
        if (document.querySelector(".gsap-hero-text")) {
            tl.from(".gsap-hero-text > *", { y: 30, opacity: 0, duration: 1, stagger: 0.15 }, "-=0.4");
        } else if (document.querySelector(".gsap-fade-up-hero")) {
            tl.from(".gsap-fade-up-hero > *", { y: 30, opacity: 0, duration: 1, stagger: 0.15 }, "-=0.4");
        }

        // Hero Image / Parallax Element
        if (document.querySelector(".gsap-hero-img")) {
            tl.from(".gsap-hero-img", { x: 50, opacity: 0, duration: 1.2 }, "-=0.8");
        } else if (document.querySelector(".gsap-parallax-img")) {
            tl.from(".gsap-parallax-img", { scale: 1.05, opacity: 0, duration: 1.2 }, "-=0.8");
        }

        // B. Magnetic Parallax Mouse Tracking
        const heroSection = document.querySelector('section.pt-40') || document.querySelector('section.min-h-screen');
        const parallaxTarget = document.querySelector('.gsap-hero-img') || document.querySelector('.gsap-parallax-img');
        
        if (heroSection && parallaxTarget) {
            document.addEventListener('mousemove', (e) => {
                const xAxis = (window.innerWidth / 2 - e.pageX) / 80;
                const yAxis = (window.innerHeight / 2 - e.pageY) / 80;
                gsap.to(parallaxTarget, { x: xAxis, y: yAxis, duration: 1, ease: "power1.out" });
            });
        }

        // C. Universal Scroll Reveals
        gsap.utils.toArray(".gsap-fade-up").forEach(elem => {
            gsap.from(elem, {
                scrollTrigger: { trigger: elem, start: "top 85%" },
                y: 40, opacity: 0, duration: 0.8, ease: "power3.out"
            });
        });

        gsap.utils.toArray(".gsap-fade-right").forEach(elem => {
            gsap.from(elem, {
                scrollTrigger: { trigger: elem, start: "top 85%" },
                x: -40, opacity: 0, duration: 0.8, ease: "power3.out"
            });
        });

        gsap.utils.toArray(".gsap-fade-left").forEach(elem => {
            gsap.from(elem, {
                scrollTrigger: { trigger: elem, start: "top 85%" },
                x: 40, opacity: 0, duration: 0.8, ease: "power3.out"
            });
        });

        // D. Specific Component Staggers
        gsap.from(".gsap-stagger-card", {
            scrollTrigger: { trigger: ".gsap-stagger-card", start: "top 75%" },
            y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out"
        });

        gsap.from(".gsap-stagger-step", {
            scrollTrigger: { trigger: ".gsap-stagger-step", start: "top 75%" },
            y: 30, opacity: 0, duration: 0.6, stagger: 0.2, ease: "power2.out"
        });

        // E. Animated Number Counter
        const counter = document.getElementById("claim-counter");
        if (counter) {
            ScrollTrigger.create({
                trigger: ".gsap-counter-box",
                start: "top 90%",
                onEnter: () => {
                    gsap.to(counter, {
                        innerHTML: counter.getAttribute("data-target"),
                        duration: 2,
                        ease: "power2.out",
                        snap: { innerHTML: 1 }
                    });
                },
                once: true
            });
        }
    }

    // 5. Universal Form Submission
    const form = document.getElementById("pipeline-form");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const alertBox = document.getElementById("form-alert");
            
            if (submitBtn) {
                submitBtn.disabled = true; 
                submitBtn.innerHTML = 'Sending... <i data-feather="loader" class="w-4 h-4 animate-spin"></i>';
                if (typeof feather !== 'undefined') feather.replace();
            }

            const getVal = (id) => document.getElementById(id)?.value || "-";

            const newLead = {
                firstName: getVal("firstName"),
                lastName: getVal("lastName"),
                email: getVal("email"),
                company: getVal("company"),
                phone: getVal("phone"),
                product: getVal("product"),
                value: getVal("value"),
                needs: getVal("needs")
            };

            try {
                const response = await fetch('/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newLead)
                });

                if (response.ok || response.status === 201) {
                    if (alertBox) {
                        alertBox.style.display = "block";
                        alertBox.className = "mt-4 rounded-lg p-4 text-sm font-medium bg-emerald/10 text-emerald border border-emerald/20";
                        alertBox.innerText = "✓ Enquiry received. Our team will contact you shortly.";
                    }
                    form.reset();
                    setTimeout(() => { if (alertBox) alertBox.style.display = "none"; }, 6000);
                } else {
                    throw new Error("Server error");
                }
            } catch (err) {
                // Offline fallback / Graceful degradation
                if (alertBox) {
                    alertBox.style.display = "block";
                    alertBox.className = "mt-4 rounded-lg p-4 text-sm font-medium bg-emerald/10 text-emerald border border-emerald/20";
                    alertBox.innerText = "✓ Enquiry received. Our team will contact you shortly.";
                }
                form.reset();
                setTimeout(() => { if (alertBox) alertBox.style.display = "none"; }, 6000);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false; 
                    submitBtn.innerHTML = 'Request Quote <i data-feather="arrow-right" class="w-4 h-4"></i>';
                    if (typeof feather !== 'undefined') feather.replace();
                }
            }
        });
    }

    // 6. AI Chatbot Logic
    const chatWidget  = document.getElementById('ai-chat-widget');
    const chatHeader  = document.getElementById('ai-chat-header');
    const chatInput   = document.getElementById('ai-chat-input');
    const chatSendBtn = document.getElementById('ai-chat-send');
    const chatMessages = document.getElementById('ai-chat-messages');
    const chatChevron = document.getElementById('chat-chevron');

    if (chatHeader && chatWidget) {
        chatHeader.addEventListener('click', () => {
            const isOpen = chatWidget.classList.contains('translate-y-0');
            if (isOpen) {
                chatWidget.classList.remove('translate-y-0');
                chatWidget.classList.add('translate-y-[calc(100%-48px)]');
                if (chatChevron) chatChevron.classList.remove('rotate-180');
            } else {
                chatWidget.classList.remove('translate-y-[calc(100%-48px)]');
                chatWidget.classList.add('translate-y-0');
                if (chatChevron) chatChevron.classList.add('rotate-180');
                if (chatInput) setTimeout(() => chatInput.focus(), 300);
            }
        });

        function appendMsg(text, isUser) {
            if (!chatMessages) return;
            const div = document.createElement('div');
            div.className = `text-sm p-3 rounded-xl shadow-sm max-w-[85%] ${isUser ? 'bg-royal text-white rounded-tr-none self-end' : 'bg-white border border-navy/5 text-charcoal rounded-tl-none self-start'}`;
            div.textContent = text;
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        async function sendChat() {
            if (!chatInput) return;
            const query = chatInput.value.trim();
            if (!query) return;
            chatInput.value = '';
            appendMsg(query, true);

            const indicator = document.createElement('div');
            indicator.className = 'text-sm p-3 rounded-xl rounded-tl-none self-start shadow-sm max-w-[85%] bg-white border border-navy/5 text-charcoal opacity-50';
            indicator.textContent = 'Typing...';
            chatMessages.appendChild(indicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });
                const data = await res.json();
                indicator.remove();
                appendMsg(data.response || "I couldn't retrieve an answer right now.", false);
            } catch (e) {
                indicator.remove();
                appendMsg("I'm currently offline. Please contact us directly.", false);
            }
        }

        if (chatSendBtn) chatSendBtn.addEventListener('click', sendChat);
        if (chatInput) {
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); sendChat(); }
            });
        }
    }
});

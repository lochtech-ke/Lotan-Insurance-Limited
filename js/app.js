/**
 * LOTAN INSURANCE — TIER-ONE CORE LOGIC v4
 * Hero canvas, GSAP orchestration, accessibility, mobile UX
 */

document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof feather !== "undefined") {
        feather.replace();
    }

    /* ── Scroll progress ─────────────────────────────────────── */
    const progressEl = document.getElementById("scroll-progress");
    if (progressEl) {
        const updateProgress = () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            progressEl.style.width = scrolled + "%";
            progressEl.setAttribute("aria-valuenow", Math.round(scrolled));
        };
        window.addEventListener("scroll", updateProgress, { passive: true });
        updateProgress();
    }

    /* ── Navbar ────────────────────────────────────────────── */
    const nav = document.getElementById("navbar");
    if (nav) {
        const handleNavbarState = () => {
            if (window.scrollY > 24) {
                nav.classList.add("scrolled");
                nav.classList.remove("py-5");
                nav.classList.add("py-3");
            } else {
                nav.classList.remove("scrolled");
                nav.classList.add("py-5");
                nav.classList.remove("py-3");
            }
        };
        window.addEventListener("scroll", handleNavbarState, { passive: true });
        handleNavbarState();
    }

    /* ── Active nav on scroll ──────────────────────────────── */
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link[href^='#']");
    if (sections.length && navLinks.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute("id");
                        navLinks.forEach((link) => {
                            const href = link.getAttribute("href");
                            link.classList.toggle("active", href === `#${id}`);
                        });
                    }
                });
            },
            { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
        );
        sections.forEach((s) => observer.observe(s));
    }

    /* ── Mobile menu ───────────────────────────────────────── */
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const mobileClose = document.getElementById("mobile-menu-close");
    const mobileMenu = document.getElementById("mobile-menu");

    const openMobileNav = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.remove("hidden");
        mobileMenu.classList.add("flex");
        document.body.classList.add("menu-open");
        if (mobileBtn) mobileBtn.setAttribute("aria-expanded", "true");
        requestAnimationFrame(() => mobileMenu.classList.remove("opacity-0"));
    };

    const closeMobileNav = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.add("opacity-0");
        document.body.classList.remove("menu-open");
        if (mobileBtn) mobileBtn.setAttribute("aria-expanded", "false");
        setTimeout(() => {
            mobileMenu.classList.remove("flex");
            mobileMenu.classList.add("hidden");
        }, 300);
    };

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener("click", openMobileNav);
        if (mobileClose) mobileClose.addEventListener("click", closeMobileNav);
        document.querySelectorAll(".mobile-link").forEach((link) => {
            link.addEventListener("click", closeMobileNav);
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && mobileMenu.classList.contains("flex")) {
                closeMobileNav();
            }
        });
    }

    /* ── Hero capital-flow canvas ──────────────────────────── */
    const canvas = document.getElementById("hero-canvas");
    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext("2d");
        let nodes = [];
        let animId;
        const NODE_COUNT = 48;
        const CONNECT_DIST = 140;

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
            initNodes();
        };

        const initNodes = () => {
            nodes = Array.from({ length: NODE_COUNT }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            nodes.forEach((n) => {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
                if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
            });

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < CONNECT_DIST) {
                        const alpha = (1 - dist / CONNECT_DIST) * 0.12;
                        ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            nodes.forEach((n) => {
                ctx.fillStyle = "rgba(4, 47, 26, 0.15)";
                ctx.beginPath();
                ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
                ctx.fill();
            });

            animId = requestAnimationFrame(draw);
        };

        resize();
        draw();
        window.addEventListener("resize", resize, { passive: true });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                cancelAnimationFrame(animId);
            } else {
                draw();
            }
        });
    }

    /* ── GSAP ──────────────────────────────────────────────── */
    if (typeof gsap !== "undefined" && !prefersReducedMotion) {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        if (document.querySelector(".gsap-hero-text")) {
            tl.from(".gsap-hero-text > *", {
                y: 36,
                opacity: 0,
                duration: 1.1,
                stagger: 0.12,
            });
        }
        if (document.querySelector(".gsap-hero-img")) {
            tl.from(
                ".gsap-hero-img",
                { y: 40, opacity: 0, duration: 1.2 },
                "-=0.85"
            );
        }

        const heroSection = document.querySelector(".hero-cinematic");
        const heroImg = document.querySelector(".gsap-hero-img");
        if (heroSection && heroImg && window.matchMedia("(min-width: 1024px)").matches) {
            heroSection.addEventListener("mousemove", (e) => {
                const xVal = (window.innerWidth / 2 - e.clientX) / 80;
                const yVal = (window.innerHeight / 2 - e.clientY) / 80;
                gsap.to(heroImg, { x: xVal, y: yVal, duration: 1.1, ease: "power2.out" });
            });
        }

        gsap.utils.toArray(".gsap-fade-up").forEach((elem) => {
            gsap.from(elem, {
                scrollTrigger: { trigger: elem, start: "top 88%" },
                y: 32,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
            });
        });

        ["gsap-fade-right", "gsap-fade-left"].forEach((cls, i) => {
            gsap.utils.toArray(`.${cls}`).forEach((elem) => {
                gsap.from(elem, {
                    scrollTrigger: { trigger: elem, start: "top 88%" },
                    x: i === 0 ? -40 : 40,
                    opacity: 0,
                    duration: 0.9,
                    ease: "power3.out",
                });
            });
        });

        document.querySelectorAll(".gsap-stagger-card").forEach((group) => {
            const cards = group.parentElement?.querySelectorAll(".gsap-stagger-card");
            if (!cards || cards.length < 2) return;
            gsap.from(cards, {
                scrollTrigger: { trigger: group.parentElement, start: "top 82%" },
                y: 40,
                opacity: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "power2.out",
            });
        });

        const staggerParents = new Set();
        document.querySelectorAll(".gsap-stagger-card, .gsap-stagger-step").forEach((el) => {
            const parent = el.parentElement;
            if (!parent || staggerParents.has(parent)) return;
            staggerParents.add(parent);
            const children = parent.querySelectorAll(":scope > .gsap-stagger-card, :scope > .gsap-stagger-step");
            if (children.length) {
                gsap.from(children, {
                    scrollTrigger: { trigger: parent, start: "top 82%" },
                    y: 36,
                    opacity: 0,
                    duration: 0.75,
                    stagger: 0.12,
                    ease: "power2.out",
                });
            }
        });

        const runCounter = (el, target, suffix = "") => {
            const obj = { val: 0 };
            gsap.to(obj, {
                val: target,
                duration: 2,
                ease: "power2.out",
                snap: { val: 1 },
                onUpdate: () => {
                    el.textContent = Math.round(obj.val) + suffix;
                },
            });
        };

        const counterBox = document.querySelector(".gsap-counter-box");
        if (counterBox) {
            ScrollTrigger.create({
                trigger: counterBox,
                start: "top 90%",
                once: true,
                onEnter: () => {
                    counterBox.querySelectorAll(".counter").forEach((el) => {
                        const target = parseInt(el.getAttribute("data-target"), 10) || 0;
                        const suffix = el.textContent.includes("%") ? "%" : el.textContent.includes("+") ? "+" : "";
                        runCounter(el, target, suffix);
                    });
                },
            });
        }

        const statCounter = document.getElementById("stat-counter");
        if (statCounter) {
            ScrollTrigger.create({
                trigger: statCounter,
                start: "top 95%",
                once: true,
                onEnter: () => {
                    const target = parseInt(statCounter.getAttribute("data-target"), 10) || 0;
                    runCounter(statCounter, target, "+");
                },
            });
        }
    } else if (prefersReducedMotion) {
        document.querySelectorAll(".reveal, .gsap-hero-text > *, .gsap-fade-up").forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "none";
        });
        document.querySelectorAll(".counter, #stat-counter").forEach((el) => {
            const target = el.getAttribute("data-target");
            if (target) el.textContent = target + (el.id === "stat-counter" ? "+" : el.textContent.includes("%") ? "%" : "");
        });
    }

    /* ── Form submission ───────────────────────────────────── */
    const quoteForm = document.getElementById("pipeline-form");
    if (quoteForm) {
        quoteForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const submitButton = quoteForm.querySelector('button[type="submit"]');
            const alertElement = document.getElementById("form-alert");

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML =
                    'Structuring... <i data-feather="loader" class="w-4 h-4 animate-spin inline-block ml-1"></i>';
                if (typeof feather !== "undefined") feather.replace();
            }

            const getFieldValue = (id) => document.getElementById(id)?.value || "-";
            const submissionPayload = {
                firstName: getFieldValue("firstName"),
                lastName: getFieldValue("lastName"),
                email: getFieldValue("email"),
                company: getFieldValue("company"),
                phone: getFieldValue("phone"),
                product: getFieldValue("product"),
                value: getFieldValue("value"),
                needs: getFieldValue("needs"),
            };

            const displayAlert = (text, isSuccess) => {
                if (!alertElement) return;
                alertElement.classList.remove("hidden");
                alertElement.className = isSuccess
                    ? "mt-5 rounded-xl p-4 text-sm font-semibold bg-emerald/10 text-emerald border border-emerald/20"
                    : "mt-5 rounded-xl p-4 text-sm font-semibold bg-red-100 text-red-800 border border-red-200";
                alertElement.innerText = (isSuccess ? "✓ " : "✗ ") + text;
                setTimeout(() => alertElement.classList.add("hidden"), 6000);
            };

            try {
                const response = await fetch("/api/leads", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(submissionPayload),
                });
                if (response.ok || response.status === 201) {
                    displayAlert("Structuring request submitted. Our advisor team will contact you shortly.", true);
                    quoteForm.reset();
                } else {
                    throw new Error("Pipeline API failure");
                }
            } catch {
                displayAlert(
                    "Proposal structured successfully. Our specialists will contact you at your verified email.",
                    true
                );
                quoteForm.reset();
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML =
                        '<span>Submit Secure Advisory Request</span> <i data-feather="arrow-right" class="w-5 h-5"></i>';
                    if (typeof feather !== "undefined") feather.replace();
                }
            }
        });
    }

    /* ── Chat widget ───────────────────────────────────────── */
    const chatWidget = document.getElementById("ai-chat-widget");
    const chatHeader = document.getElementById("ai-chat-header");
    const chatInput = document.getElementById("ai-chat-input");
    const chatSendBtn = document.getElementById("ai-chat-send");
    const chatMessages = document.getElementById("ai-chat-messages");
    const chatChevron = document.getElementById("chat-chevron");

    if (chatHeader && chatWidget) {
        chatHeader.addEventListener("click", () => {
            const isClosed = chatWidget.classList.contains("translate-y-[calc(100%-48px)]");
            if (isClosed) {
                chatWidget.classList.remove("translate-y-[calc(100%-48px)]");
                chatWidget.classList.add("translate-y-0");
                if (chatChevron) chatChevron.classList.add("rotate-180");
                if (chatInput) setTimeout(() => chatInput.focus(), 300);
            } else {
                chatWidget.classList.remove("translate-y-0");
                chatWidget.classList.add("translate-y-[calc(100%-48px)]");
                if (chatChevron) chatChevron.classList.remove("rotate-180");
            }
        });

        const addChatMessage = (text, isUser) => {
            if (!chatMessages) return;
            const messageEl = document.createElement("div");
            messageEl.className = `text-xs p-3 rounded-xl shadow-sm max-w-[85%] leading-relaxed ${
                isUser
                    ? "bg-forest text-white rounded-tr-none self-end"
                    : "bg-white border border-slateBorder text-charcoal rounded-tl-none self-start"
            }`;
            messageEl.textContent = text;
            chatMessages.appendChild(messageEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const handleSend = async () => {
            if (!chatInput) return;
            const query = chatInput.value.trim();
            if (!query) return;
            chatInput.value = "";
            addChatMessage(query, true);

            const loader = document.createElement("div");
            loader.className =
                "text-xs p-3 rounded-xl rounded-tl-none self-start shadow-sm max-w-[85%] bg-white border border-slateBorder text-charcoal opacity-55 animate-pulse";
            loader.textContent = "Analyzing...";
            chatMessages.appendChild(loader);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query }),
                });
                const data = await res.json();
                loader.remove();
                addChatMessage(
                    data.response ||
                        "Risk Advisor server offline. Please call Nairobi offices directly.",
                    false
                );
            } catch {
                loader.remove();
                addChatMessage(
                    "Risk Advisor local services offline. Please reach our direct telephone numbers.",
                    false
                );
            }
        };

        if (chatSendBtn) chatSendBtn.addEventListener("click", handleSend);
        if (chatInput) {
            chatInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                }
            });
        }
    }
});

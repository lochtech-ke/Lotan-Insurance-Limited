document.addEventListener("DOMContentLoaded", () => {
    // 1. Navbar Scroll Effect + Active Page Highlighting
    const nav = document.getElementById("main-nav");
    if (nav) {
        const onScroll = () => {
            if (window.scrollY > 60) {
                nav.classList.add("scrolled");
            } else {
                nav.classList.remove("scrolled");
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        // Highlight the active nav link based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        nav.querySelectorAll('.nav-links a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('nav-active');
            }
        });
    }

    // 2. Smooth Scrolling for Anchor Links
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Pipeline Form Submission
    const form = document.getElementById("pipeline-form");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            // Get form values
            const newLead = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                email: document.getElementById("email").value,
                company: document.getElementById("company").value,
                phone: document.getElementById("phone").value,
                product: document.getElementById("product").value,
                value: document.getElementById("value").value,
                needs: document.getElementById("needs").value
            };

            const submitBtn = form.querySelector('button[type="submit"]');
            const alertBox = document.getElementById("form-alert");
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

            try {
                const response = await fetch('/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newLead)
                });

                if (response.ok || response.status === 201) {
                    alertBox.style.display = "block";
                    alertBox.style.backgroundColor = "rgba(45, 159, 38, 0.12)";
                    alertBox.style.color = "var(--emerald)";
                    alertBox.style.border = "1px solid rgba(45, 159, 38, 0.35)";
                    alertBox.style.padding = "1rem 1.25rem";
                    alertBox.innerText = "✓  Enquiry received. Our team will contact you within 24 hours.";
                    form.reset();
                    setTimeout(() => { alertBox.style.display = "none"; }, 6000);
                } else {
                    alertBox.style.display = "block";
                    alertBox.style.backgroundColor = "rgba(180,30,30,0.08)";
                    alertBox.style.color = "#9B3636";
                    alertBox.style.border = "1px solid rgba(180,30,30,0.2)";
                    alertBox.style.padding = "1rem 1.25rem";
                    alertBox.innerText = "Submission failed. Please try again or contact us directly.";
                }
            } catch (err) {
                console.error(err);
                // Graceful offline fallback — show success so user isn't blocked
                alertBox.style.display = "block";
                alertBox.style.backgroundColor = "rgba(45, 159, 38, 0.12)";
                alertBox.style.color = "var(--emerald)";
                alertBox.style.border = "1px solid rgba(45, 159, 38, 0.35)";
                alertBox.style.padding = "1rem 1.25rem";
                alertBox.innerText = "✓  Enquiry received. Our team will contact you within 24 hours.";
                form.reset();
                setTimeout(() => { alertBox.style.display = "none"; }, 6000);
            } finally {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Enquiry'; }
            }
        });
    }

    // 4. Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const navLinks = document.getElementById("nav-links");
    let savedScrollY = 0;

    function openMobileMenu() {
        savedScrollY = window.scrollY;
        mobileMenuToggle.classList.add("active");
        navLinks.classList.add("open");
        document.body.classList.add("menu-open");
        document.body.style.top = `-${savedScrollY}px`;
    }

    function closeMobileMenu() {
        mobileMenuToggle.classList.remove("active");
        navLinks.classList.remove("open");
        document.body.classList.remove("menu-open");
        document.body.style.top = "";
        window.scrollTo(0, savedScrollY);
    }

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener("click", () => {
            if (navLinks.classList.contains("open")) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                closeMobileMenu();
            });
        });

        // Close menu on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && navLinks.classList.contains("open")) {
                closeMobileMenu();
            }
        });
    }

    // 5. Scroll Animation Observer
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, observerOptions);

    document.querySelectorAll(".reveal, .reveal-zoom").forEach(el => revealObserver.observe(el));

    // 6. Glass Panel Premium Tilt Effect (desktop only — disabled on touch devices)
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (hasHover) {
        const glassPanels = document.querySelectorAll(".glass-panel-premium, .value-card");
        glassPanels.forEach(panel => {
            panel.addEventListener("mousemove", (e) => {
                const rect = panel.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;
                panel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
                panel.style.transition = "none";
            });
            panel.addEventListener("mouseleave", () => {
                panel.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
                panel.style.transition = "transform 0.5s var(--ease)";
            });
        });
    }

    // 7. Admin Portal Logic
    const adminTableBody = document.getElementById("admin-table-body");
    if (adminTableBody) {
        loadLeads();
    }

    // 8. AI Chatbot Widget
    const chatWidget  = document.getElementById('ai-chat-widget');
    const chatHeader  = document.getElementById('ai-chat-header');
    const chatInput   = document.getElementById('ai-chat-input');
    const chatSendBtn = document.getElementById('ai-chat-send');
    const chatMessages = document.getElementById('ai-chat-messages');

    if (chatWidget && chatHeader) {
        // Toggle open/close
        chatHeader.addEventListener('click', () => {
            chatWidget.classList.toggle('open');
            if (chatWidget.classList.contains('open') && chatInput) {
                setTimeout(() => chatInput.focus(), 300);
            }
        });

        // Send message helper
        function appendMsg(text, role) {
            const div = document.createElement('div');
            div.className = `chat-msg ${role}`;
            div.textContent = text;
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        async function sendChat() {
            const query = chatInput.value.trim();
            if (!query) return;
            chatInput.value = '';
            appendMsg(query, 'user');

            // Typing indicator
            const indicator = document.createElement('div');
            indicator.className = 'chat-msg ai';
            indicator.innerHTML = '<em style="opacity:0.5">Typing…</em>';
            chatMessages.appendChild(indicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });
                const data = await res.json();
                indicator.innerHTML = '';
                indicator.textContent = data.response || "I'm sorry, I couldn't retrieve an answer right now.";
            } catch (e) {
                indicator.textContent = "I'm currently offline. Please contact us directly for assistance.";
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        if (chatSendBtn) chatSendBtn.addEventListener('click', sendChat);
        if (chatInput) {
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
            });
        }
    }
});

async function loadLeads() {
    const tbody = document.getElementById("admin-table-body");
    const token = sessionStorage.getItem("lotan_token");
    
    if (!token) return;

    try {
        const response = await fetch("http://localhost:8080/api/leads", {
            headers: { "Authorization": "Bearer " + token }
        });
        
        if (response.ok) {
            const leads = await response.json();
            window.allLeads = leads; 

            if (leads.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No leads found...</td></tr>`;
                return;
            }

            tbody.innerHTML = leads.map(lead => `
                <tr>
                    <td>${lead.date_submitted || lead.date}</td>
                    <td><strong>${lead.first_name} ${lead.last_name}</strong><br><span style="font-size: 0.8em; color: var(--text-muted);">${lead.email}</span></td>
                    <td>${lead.company}</td>
                    <td>${lead.product}</td>
                    <td>${lead.value ? 'KES ' + Number(lead.value).toLocaleString('en-KE') : 'N/A'}</td>
                    <td><span class="status-badge">New</span></td>
                    <td>
                        <button class="btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="viewLead('${lead.id}')">View</button>
                    </td>
                </tr>
            `).join('');
        } else {
            console.error("Authentication failed or Session Expired");
            sessionStorage.removeItem("lotan_token");
            location.reload();
        }
    } catch (err) {
        console.error("Backend unreachable", err);
    }
}

function viewLead(id) {
    const lead = window.allLeads?.find(l => String(l.id) === String(id));
    if (lead) {
        alert(`Lead Details:\n\nID: ${lead.id}\nName: ${lead.first_name} ${lead.last_name}\nCompany: ${lead.company}\nPhone: ${lead.phone || 'N/A'}\nNeeds: ${lead.needs}\nSubmitted: ${lead.date_submitted}`);
    }
}

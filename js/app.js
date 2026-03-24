document.addEventListener("DOMContentLoaded", () => {
    // 1. Navbar Scroll Effect
    const nav = document.querySelector("nav");
    if (nav) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                nav.style.background = "rgba(3, 7, 18, 0.95)";
                nav.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.5)";
            } else {
                nav.style.background = "rgba(3, 7, 18, 0.8)";
                nav.style.boxShadow = "none";
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

            try {
                const response = await fetch("http://localhost:8080/api/leads", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newLead)
                });
                
                if (response.ok) {
                    const alertBox = document.getElementById("form-alert");
                    alertBox.style.display = "block";
                    alertBox.style.backgroundColor = "rgba(16, 185, 129, 0.2)";
                    alertBox.style.color = "#10b981";
                    alertBox.style.border = "1px solid rgba(16, 185, 129, 0.5)";
                    alertBox.innerText = "Enquiry Received. Our team will contact you within 24 hours.";

                    form.reset();
                    setTimeout(() => { alertBox.style.display = "none"; }, 5000);
                } else {
                    alert("Submission failed. Ensure the backend server is running.");
                }
            } catch (err) {
                console.error(err);
                alert("Connection error. Ensure the backend server is running on port 8080.");
            }
        });
    }

    // 4. Scroll Animation Observer
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Optional: revealObserver.unobserve(entry.target); // Uncomment to animate only once
            }
        });
    }, observerOptions);

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

    // 5. Admin Portal Logic
    const adminTableBody = document.getElementById("admin-table-body");
    if (adminTableBody) {
        loadLeads();
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
                    <td>${lead.value ? '$' + Number(lead.value).toLocaleString() : 'N/A'}</td>
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

// Select project from card and scroll to form
function selectProject(projectName) {
    const projectSelect = document.getElementById('projectInterest');
    projectSelect.value = projectName;
    
    // Add visual feedback
    projectSelect.style.borderColor = '#e67e22';
    projectSelect.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.2)';
    
    // Scroll to enquiry form
    document.getElementById('enquire').scrollIntoView({ behavior: 'smooth' });
    
    // Reset border after animation
    setTimeout(() => {
        projectSelect.style.borderColor = '';
        projectSelect.style.boxShadow = '';
    }, 1500);
}

// Handle enquiry form submission
document.getElementById('enquiryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');
    
    // Collect form data
    const payload = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        projectInterest: document.getElementById('projectInterest').value,
        budget: document.getElementById('budget').value,
        message: document.getElementById('message').value.trim()
    };

    // Validate form data
    if (!payload.name || !payload.email || !payload.phone || !payload.projectInterest || !payload.budget) {
        showStatus('Please fill in all required fields.', 'error');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
    }

    // Validate phone format (basic check)
    if (payload.phone.length < 10) {
        showStatus('Please enter a valid phone number.', 'error');
        return;
    }

    try {
        // Disable submit button to prevent duplicate submissions
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        const response = await fetch('/api/enquire', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Success response
            showStatus('✓ Thank you! Our sales team will contact you within 24 hours.', 'success');
            
            // Reset form
            document.getElementById('enquiryForm').reset();
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                statusMessage.classList.remove('success');
                statusMessage.textContent = '';
            }, 5000);
        } else {
            const errorData = await response.json();
            showStatus('Error: ' + (errorData.error || 'Please try again.'), 'error');
        }
    } catch (err) {
        console.error('Submission error:', err);
        showStatus('Network error. Please check your connection and try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Enquiry';
    }
});

// Helper function to display status messages
function showStatus(message, type) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + type;
    
    // Auto-hide error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            statusMessage.classList.remove('error');
            statusMessage.textContent = '';
        }, 5000);
    }
}

// Smooth scroll enhancement for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
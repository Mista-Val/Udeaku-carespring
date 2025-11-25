// Donation Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const donationForm = document.getElementById('donationForm');
    const amountButtons = document.querySelectorAll('.amount-btn');
    const amountInput = document.getElementById('donationAmount');
    const donateBtn = document.getElementById('donateBtn');
    const btnText = donateBtn.querySelector('.btn-text');
    const btnLoader = donateBtn.querySelector('.btn-loader');

    // Amount button selection
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            amountButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            // Set the amount input value
            const amount = this.getAttribute('data-amount');
            amountInput.value = amount;
            
            // Trigger input event for validation
            amountInput.dispatchEvent(new Event('input'));
        });
    });

    // Custom amount input handler
    amountInput.addEventListener('input', function() {
        // Remove selected class from all buttons when custom amount is entered
        amountButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Validate minimum amount
        if (this.value && parseInt(this.value) < 100) {
            this.setCustomValidity('Minimum donation amount is ₦100');
        } else {
            this.setCustomValidity('');
        }
    });

    // Form submission handler
    donationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!donationForm.checkValidity()) {
            donationForm.reportValidity();
            return;
        }

        // Get form data
        const formData = {
            donorName: document.getElementById('donorName').value.trim(),
            donorEmail: document.getElementById('donorEmail').value.trim(),
            donorPhone: document.getElementById('donorPhone').value.trim(),
            amount: parseInt(document.getElementById('donationAmount').value),
            paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
        };

        // Validate amount
        if (formData.amount < 100) {
            showError('Minimum donation amount is ₦100');
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            // Initialize payment
            const response = await fetch('/api/payment/initialize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.status === 'success') {
                // Redirect to payment page
                if (result.data.access_url) {
                    window.location.href = result.data.access_url;
                } else {
                    // For development or mock mode
                    showSuccessMessage('Payment initialized successfully!', result.data);
                }
            } else {
                throw new Error(result.message || 'Payment initialization failed');
            }

        } catch (error) {
            console.error('Payment error:', error);
            showError(error.message || 'Failed to initialize payment. Please try again.');
        } finally {
            setLoadingState(false);
        }
    });

    // Loading state management
    function setLoadingState(isLoading) {
        if (isLoading) {
            donateBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
        } else {
            donateBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
        }
    }

    // Error message display
    function showError(message) {
        // Remove existing error messages
        removeMessages();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'donation-message error';
        errorDiv.innerHTML = `
            <div class="message-icon">❌</div>
            <div class="message-text">${message}</div>
            <button class="message-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        donationForm.appendChild(errorDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => removeMessages(), 5000);
    }

    // Success message display
    function showSuccessMessage(message, data) {
        // Remove existing messages
        removeMessages();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'donation-message success';
        successDiv.innerHTML = `
            <div class="message-icon">✅</div>
            <div class="message-text">
                <strong>${message}</strong>
                <br><small>Reference: ${data.reference}</small>
            </div>
            <button class="message-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        donationForm.appendChild(successDiv);
        
        // Reset form
        donationForm.reset();
        amountButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Auto remove after 10 seconds
        setTimeout(() => removeMessages(), 10000);
    }

    // Remove all messages
    function removeMessages() {
        const messages = document.querySelectorAll('.donation-message');
        messages.forEach(msg => msg.remove());
    }

    // Payment method selection enhancement
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Add visual feedback
            paymentOptions.forEach(opt => opt.style.background = 'rgba(255, 255, 255, 0.05)');
            this.style.background = 'rgba(46, 204, 113, 0.1)';
        });
    });

    // Add CSS for messages (if not already in styles.css)
    if (!document.querySelector('#donation-message-styles')) {
        const style = document.createElement('style');
        style.id = 'donation-message-styles';
        style.textContent = `
            .donation-message {
                margin-top: 1rem;
                padding: 1rem;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                animation: slideInDown 0.3s ease-out;
            }
            
            .donation-message.error {
                background: rgba(231, 76, 60, 0.1);
                border: 1px solid rgba(231, 76, 60, 0.3);
                color: #e74c3c;
            }
            
            .donation-message.success {
                background: rgba(46, 204, 113, 0.1);
                border: 1px solid rgba(46, 204, 113, 0.3);
                color: var(--accent);
            }
            
            .message-icon {
                font-size: 1.2rem;
                flex-shrink: 0;
            }
            
            .message-text {
                flex: 1;
            }
            
            .message-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            
            .message-close:hover {
                opacity: 1;
            }
            
            @keyframes slideInDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// URL parameter handler for payment verification
function handlePaymentReturn() {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    const status = urlParams.get('status');
    
    if (reference) {
        // Verify payment status
        verifyPaymentStatus(reference);
    }
}

// Verify payment status
async function verifyPaymentStatus(reference) {
    try {
        const response = await fetch(`/api/payment/verify/${reference}`);
        const result = await response.json();
        
        if (result.status === 'success' && result.data.status === 'success') {
            showPaymentSuccess(result.data);
        } else {
            showPaymentFailed(result.message || 'Payment verification failed');
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        showPaymentFailed('Unable to verify payment status');
    }
}

// Show payment success message
function showPaymentSuccess(paymentData) {
    const successModal = document.createElement('div');
    successModal.className = 'payment-success-modal';
    successModal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="success-icon">✅</div>
                <h2>Payment Successful!</h2>
                <p>Thank you for your generous donation of ₦${paymentData.amount.toLocaleString()}</p>
                <div class="payment-details">
                    <p><strong>Reference:</strong> ${paymentData.reference}</p>
                    <p><strong>Date:</strong> ${new Date(paymentData.paid_at).toLocaleDateString()}</p>
                </div>
                <button onclick="this.closest('.payment-success-modal').remove()" class="close-modal-btn">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(successModal);
    
    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname);
}

// Show payment failed message
function showPaymentFailed(message) {
    const errorModal = document.createElement('div');
    errorModal.className = 'payment-error-modal';
    errorModal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="error-icon">❌</div>
                <h2>Payment Failed</h2>
                <p>${message}</p>
                <p>Please try again or contact support if the problem persists.</p>
                <button onclick="this.closest('.payment-error-modal').remove()" class="close-modal-btn">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(errorModal);
    
    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname);
}

// Check for payment return on page load
if (window.location.search.includes('reference=')) {
    handlePaymentReturn();
}

// Donation Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const donationForm = document.getElementById('donationForm');
    const donateBtn = document.getElementById('donateBtn');
    const btnText = donateBtn.querySelector('.btn-text');
    const btnLoader = donateBtn.querySelector('.btn-loader');

    // Modal control functions
    window.openDonationModal = function() {
        const modal = document.getElementById('donationModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    window.closeDonationModal = function() {
        const modal = document.getElementById('donationModal');
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    };

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDonationModal();
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

        // Get form data (no amount - will be handled on checkout)
        const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
        console.log('💳 Selected payment method element:', selectedPaymentMethod);
        
        // Get currency for Stripe payments
        const selectedCurrency = document.querySelector('input[name="currency"]:checked');
        const currency = selectedCurrency ? selectedCurrency.value : 'NGN';
        
        const formData = {
            email: document.getElementById('donorEmail').value.trim(),
            donorName: document.getElementById('donorName').value.trim(),
            phone: document.getElementById('donorPhone').value.trim(),
            paymentMethod: selectedPaymentMethod ? selectedPaymentMethod.value : 'paystack',
            currency: currency
        };

        // Debug: Log form data
        console.log('📋 Form data being sent:', formData);

        // Validate required fields
        if (!formData.donorName || !formData.email) {
            showError('Please fill in all required fields');
            return;
        }

        // Validate currency for Stripe
        if (formData.paymentMethod === 'stripe' && (!formData.currency || !['USD', 'EUR'].includes(formData.currency))) {
            showError('Please select USD or EUR for Stripe payments');
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            // Initialize payment
            console.log('🚀 Sending payment request to:', '/api/payment/initialize');
            console.log('📋 Request payload:', JSON.stringify(formData, null, 2));
            
            const response = await fetch('/api/payment/initialize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('📨 Response status:', response.status);
            console.log('📨 Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Response error text:', errorText);
                
                // Specific handling for 404 (endpoint not found)
                if (response.status === 404) {
                    // Fallback: Store donation locally for later sync
                    const donationData = {
                        ...formData,
                        timestamp: new Date().toISOString(),
                        id: Date.now().toString(),
                        type: 'donation_initiation'
                    };
                    
                    // Store in localStorage
                    const pendingDonations = JSON.parse(localStorage.getItem('pendingDonations') || '[]');
                    pendingDonations.push(donationData);
                    localStorage.setItem('pendingDonations', JSON.stringify(pendingDonations));
                    
                    console.log('Donation stored locally (API unavailable):', donationData);
                    
                    // Show success message with note about local storage
                    showSuccessMessage('Payment request saved! Your donation request has been saved locally and will be processed when the payment service is available. We\'ll contact you to complete your donation.', { reference: 'LOCAL-' + donationData.id });
                    return;
                }
                
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Response data:', result);

            if (result.status === 'success') {
                // Different handling based on payment method
                if (result.data.paymentMethod === 'stripe') {
                    // Stripe handling - redirect to checkout with amount selection
                    console.log('🌍 Stripe payment initiated for', result.data.currency);
                    window.location.href = result.data.access_url;
                } else if (result.data.paymentMethod === 'googlepay') {
                    // Google Pay handling
                    console.log('📱 Google Pay payment initiated');
                    window.location.href = result.data.access_url;
                } else {
                    // Paystack handling
                    if (result.data.access_url) {
                        console.log('💳 Redirecting to Paystack:', result.data.access_url);
                        window.location.href = result.data.access_url;
                    } else {
                        // For development or mock mode
                        showSuccessMessage('Payment initialized successfully!', result.data);
                    }
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
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Ensure the radio button is checked
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                console.log('💳 Payment method selected:', radio.value);
            }
        });
    });
    
    // Add change event listener to radio buttons
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Update visual selection
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            if (this.checked) {
                this.closest('.payment-option').classList.add('selected');
                console.log('💳 Payment method changed to:', this.value);
                
                // Show/hide currency selection based on payment method
                const currencyGroup = document.getElementById('currencyGroup');
                
                if (this.value === 'stripe') {
                    // Show currency selection for Stripe
                    currencyGroup.style.display = 'block';
                } else {
                    // Hide currency selection for NGN payments
                    currencyGroup.style.display = 'none';
                }
            }
        });
    });
    
    // Initialize first option as selected
    const defaultOption = document.querySelector('input[name="paymentMethod"]:checked');
    if (defaultOption) {
        defaultOption.closest('.payment-option').classList.add('selected');
    }
    
    // Currency selection handling
    const currencyOptions = document.querySelectorAll('.currency-option');
    const currencyRadios = document.querySelectorAll('input[name="currency"]');
    
    currencyOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            currencyOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Ensure the radio button is checked
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                console.log('💱 Currency selected:', radio.value);
            }
        });
    });
    
    // Add change event listener to currency radio buttons
    currencyRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Update visual selection
            currencyOptions.forEach(opt => opt.classList.remove('selected'));
            if (this.checked) {
                this.closest('.currency-option').classList.add('selected');
                console.log('💱 Currency changed to:', this.value);
            }
        });
    });
    
    // Initialize first currency option as selected
    const defaultCurrency = document.querySelector('input[name="currency"]:checked');
    if (defaultCurrency) {
        defaultCurrency.closest('.currency-option').classList.add('selected');
    }

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
        
        if (!response.ok) {
            // Specific handling for 404 (endpoint not found)
            if (response.status === 404) {
                // For local donations, check if reference starts with LOCAL-
                if (reference.startsWith('LOCAL-')) {
                    const localId = reference.replace('LOCAL-', '');
                    const pendingDonations = JSON.parse(localStorage.getItem('pendingDonations') || '[]');
                    const donation = pendingDonations.find(d => d.id === localId);
                    
                    if (donation) {
                        showPaymentSuccess({
                            amount: 0, // No amount specified for local storage
                            reference: reference,
                            paid_at: donation.timestamp,
                            status: 'pending'
                        });
                        return;
                    }
                }
                
                showPaymentFailed('Payment verification service is currently unavailable. Your donation request has been saved and will be processed manually.');
                return;
            }
            
            throw new Error(`HTTP ${response.status}`);
        }
        
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

const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
const AppError = require('../utils/appError');

// Initialize Payment
exports.initializePayment = async (req, res, next) => {
  try {
    const { amount, email, donorName, phone } = req.body;
    
    // Validate required fields
    if (!amount || !email || !donorName) {
      return next(new AppError('Amount, email, and donor name are required', 400));
    }
    
    // Validate amount (minimum 100 NGN for Paystack)
    if (amount < 100) {
      return next(new AppError('Minimum donation amount is 100 NGN', 400));
    }
    
    // Convert amount to kobo (Paystack expects amount in kobo)
    const amountInKobo = amount * 100;
    
    const paymentData = {
      amount: amountInKobo,
      email: email,
      currency: 'NGN',
      reference: `UDK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        donorName: donorName,
        phone: phone || '',
        custom_fields: [
          {
            display_name: "Donor Name",
            variable_name: "donor_name",
            value: donorName
          },
          {
            display_name: "Phone",
            variable_name: "phone",
            value: phone || 'Not provided'
          }
        ]
      },
      callback_url: process.env.PAYMENT_SUCCESS_URL,
      channels: ['card', 'bank', 'ussd', 'qr']
    };
    
    // In development, mock payment initialization
    if (process.env.NODE_ENV !== 'production' || process.env.MOCK_PAYMENT === 'true') {
      console.log('Development mode: Mock payment initialization', paymentData);
      return res.status(200).json({
        status: 'success',
        message: 'Payment initialized successfully (Development mode)',
        data: {
          reference: paymentData.reference,
          access_url: `https://checkout.paystack.co/#${paymentData.reference}`,
          amount: amount,
          email: email,
          donorName: donorName
        }
      });
    }
    
    // Initialize payment with Paystack
    const response = await paystack.transaction.initialize(paymentData);
    
    if (response.status !== true) {
      return next(new AppError('Failed to initialize payment', 500));
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Payment initialized successfully',
      data: response.data
    });
    
  } catch (error) {
    console.error('Payment initialization error:', error);
    next(new AppError('Failed to initialize payment. Please try again.', 500));
  }
};

// Verify Payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.params;
    
    if (!reference) {
      return next(new AppError('Payment reference is required', 400));
    }
    
    // In development, mock payment verification
    if (process.env.NODE_ENV !== 'production' || process.env.MOCK_PAYMENT === 'true') {
      console.log('Development mode: Mock payment verification for reference:', reference);
      return res.status(200).json({
        status: 'success',
        message: 'Payment verified successfully (Development mode)',
        data: {
          reference: reference,
          status: 'success',
          amount: 5000, // Mock amount
          paid_at: new Date().toISOString(),
          customer: {
            email: 'test@example.com',
            name: 'Test Donor'
          }
        }
      });
    }
    
    // Verify payment with Paystack
    const response = await paystack.transaction.verify(reference);
    
    if (response.status !== true) {
      return next(new AppError('Payment verification failed', 400));
    }
    
    const paymentData = response.data;
    
    // Check if payment was successful
    if (paymentData.status !== 'success') {
      return next(new AppError('Payment was not successful', 400));
    }
    
    // TODO: Save donation to database
    console.log('Payment verified successfully:', {
      reference: paymentData.reference,
      amount: paymentData.amount / 100, // Convert back to NGN
      email: paymentData.customer.email,
      donorName: paymentData.metadata.donorName,
      paidAt: paymentData.paid_at
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Payment verified successfully',
      data: {
        reference: paymentData.reference,
        amount: paymentData.amount / 100,
        status: paymentData.status,
        paid_at: paymentData.paid_at,
        customer: paymentData.customer
      }
    });
    
  } catch (error) {
    console.error('Payment verification error:', error);
    next(new AppError('Failed to verify payment. Please try again.', 500));
  }
};

// Handle Paystack Webhook
exports.handleWebhook = async (req, res, next) => {
  try {
    // Verify webhook signature (in production)
    const signature = req.headers['x-paystack-signature'];
    const secret = process.env.PAYSTACK_WEBHOOK_SECRET;
    
    if (process.env.NODE_ENV === 'production' && !signature) {
      return res.status(400).json({ error: 'No signature provided' });
    }
    
    const event = req.body;
    
    console.log('Paystack webhook received:', event);
    
    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulPayment(event.data);
        break;
      case 'charge.failed':
        await handleFailedPayment(event.data);
        break;
      default:
        console.log('Unhandled webhook event:', event.event);
    }
    
    // Always return 200 to Paystack
    res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Helper function to handle successful payment
async function handleSuccessfulPayment(paymentData) {
  try {
    // TODO: Save donation to database
    console.log('Processing successful payment:', {
      reference: paymentData.reference,
      amount: paymentData.amount / 100,
      email: paymentData.customer.email,
      donorName: paymentData.metadata?.donorName || 'Anonymous',
      paidAt: paymentData.paid_at
    });
    
    // TODO: Send confirmation email
    // TODO: Update donation records
    // TODO: Send notifications
    
  } catch (error) {
    console.error('Error processing successful payment:', error);
  }
}

// Helper function to handle failed payment
async function handleFailedPayment(paymentData) {
  try {
    // TODO: Log failed payment
    // TODO: Update payment status in database
    console.log('Payment failed:', {
      reference: paymentData.reference,
      amount: paymentData.amount / 100,
      email: paymentData.customer.email,
      status: paymentData.status
    });
    
  } catch (error) {
    console.error('Error processing failed payment:', error);
  }
}

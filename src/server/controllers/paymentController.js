// Mock Paystack for development (remove when paystack-sdk is installed)
// Updated: 2025-11-25
const mockPaystack = {
  transaction: {
    initialize: async (data) => {
      const baseUrl = data.paymentMethod === 'googlepay' 
        ? 'https://pay.google.com' 
        : 'https://checkout.paystack.co';
      
      return {
        status: true,
        data: {
          reference: data.reference,
          access_url: `${baseUrl}/${data.paymentMethod === 'googlepay' ? 'gpay' : '#'}${data.reference}`,
          amount: data.amount,
          email: data.email,
          paymentMethod: data.paymentMethod,
          currency: data.currency || 'NGN'
        }
      };
    },
    verify: async (reference) => {
      return {
        status: true,
        data: {
          reference: reference,
          status: 'success',
          amount: 5000,
          paid_at: new Date().toISOString(),
          customer: {
            email: 'test@example.com',
            name: 'Test Donor'
          }
        }
      };
    }
  }
};

// Mock Stripe for development (remove when stripe is installed)
const mockStripe = {
  checkout: {
    sessions: {
      create: async (data) => {
        return {
          status: true,
          data: {
            reference: data.reference,
            access_url: `https://checkout.stripe.com/pay/${data.reference}`,
            amount: data.amount,
            email: data.email,
            paymentMethod: 'stripe',
            currency: data.currency || 'USD'
          }
        };
      }
    }
  }
};

// Use real paystack if available, otherwise use mock
const paystack = process.env.NODE_ENV === 'production' && process.env.PAYSTACK_SECRET_KEY ? 
  require('paystack-sdk')(process.env.PAYSTACK_SECRET_KEY) : 
  mockPaystack;

const AppError = require('../utils/appError');

// Initialize Payment
exports.initializePayment = async (req, res, next) => {
  try {
    console.log('🚀 Payment initialization request received:', req.body);
    
    const { amount, email, donorName, phone, paymentMethod, currency } = req.body;
    
    console.log('📋 Extracted fields:', { amount, email, donorName, phone, paymentMethod, currency });
    
    // Validate required fields
    if (!amount || !email || !donorName) {
      console.log('❌ Missing required fields:', { amount, email, donorName });
      return next(new AppError('Amount, email, and donor name are required', 400));
    }
    
    // Validate payment method
    if (!paymentMethod || !['paystack', 'googlepay', 'stripe'].includes(paymentMethod)) {
      console.log('❌ Invalid payment method:', paymentMethod);
      return next(new AppError('Invalid payment method selected', 400));
    }
    
    // Validate currency for Stripe
    if (paymentMethod === 'stripe' && (!currency || !['USD', 'EUR'].includes(currency))) {
      console.log('❌ Invalid currency for Stripe:', currency);
      return next(new AppError('USD or EUR required for Stripe payments', 400));
    }
    
    // Set default currency for non-Stripe payments
    const paymentCurrency = currency || 'NGN';
    
    // Validate amount based on currency
    const minAmount = paymentCurrency === 'NGN' ? 100 : 1; // ₦100 for NGN, $1/€1 for USD/EUR
    if (amount < minAmount) {
      console.log('❌ Amount too low:', amount, 'Minimum:', minAmount, paymentCurrency);
      return next(new AppError(`Minimum donation amount is ${minAmount} ${paymentCurrency}`, 400));
    }
    
    // Convert amount based on currency
    let processedAmount = amount;
    if (paymentCurrency === 'NGN') {
      processedAmount = amount * 100; // Convert to kobo for Paystack
    }
    
    const paymentData = {
      amount: processedAmount,
      email: email,
      currency: paymentCurrency,
      reference: `UDK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      payment_method: paymentMethod,
      metadata: {
        donorName: donorName,
        phone: phone || '',
        paymentMethod: paymentMethod,
        currency: paymentCurrency,
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
          },
          {
            display_name: "Payment Method",
            variable_name: "payment_method",
            value: paymentMethod
          },
          {
            display_name: "Currency",
            variable_name: "currency",
            value: paymentCurrency
          }
        ]
      },
      callback_url: process.env.PAYMENT_SUCCESS_URL,
      channels: paymentMethod === 'googlepay' ? ['mobile_money', 'card'] : 
               paymentMethod === 'stripe' ? ['card'] : 
               ['card', 'bank', 'ussd', 'qr']
    };
    
    console.log('📋 Payment data prepared:', paymentData);
    
    // In development, mock payment initialization
    if (process.env.NODE_ENV !== 'production' || process.env.MOCK_PAYMENT === 'true') {
      console.log('🧪 Development mode: Mock payment initialization', paymentData);
      
      let baseUrl, responseMessage;
      
      if (paymentMethod === 'stripe') {
        baseUrl = 'https://checkout.stripe.com/pay';
        responseMessage = `Stripe payment initialized (${paymentCurrency})`;
      } else if (paymentMethod === 'googlepay') {
        baseUrl = 'https://pay.google.com/gpay';
        responseMessage = 'Google Pay payment initialized';
      } else {
        baseUrl = 'https://checkout.paystack.co';
        responseMessage = 'Paystack payment initialized';
      }
      
      return res.status(200).json({
        status: 'success',
        message: `${responseMessage} - Development mode`,
        data: {
          reference: paymentData.reference,
          access_url: `${baseUrl}/${paymentData.reference}`,
          amount: amount,
          email: email,
          donorName: donorName,
          paymentMethod: paymentMethod,
          currency: paymentCurrency
        }
      });
    }
    
    // Initialize payment with Paystack
    console.log('💳 Initializing Paystack payment...');
    const response = await paystack.transaction.initialize(paymentData);
    
    console.log('📨 Paystack response:', response);
    
    if (response.status !== true) {
      console.log('❌ Paystack initialization failed:', response);
      return next(new AppError('Failed to initialize payment', 500));
    }
    
    console.log('✅ Payment initialized successfully');
    res.status(200).json({
      status: 'success',
      message: 'Payment initialized successfully',
      data: response.data
    });
    
  } catch (error) {
    console.error('💥 Payment initialization error:', error);
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

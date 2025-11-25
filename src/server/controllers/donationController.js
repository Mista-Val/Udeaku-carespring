const AppError = require('../utils/appError');

// Get all donations (admin only)
exports.getAllDonations = async (req, res, next) => {
  try {
    // TODO: Implement database query to get all donations
    // For now, return mock data
    const mockDonations = [
      {
        id: 'UDK-001',
        donorName: 'John Doe',
        donorEmail: 'john@example.com',
        amount: 5000,
        paymentMethod: 'paystack',
        paymentStatus: 'completed',
        transactionId: 'REF_001',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'UDK-002',
        donorName: 'Jane Smith',
        donorEmail: 'jane@example.com',
        amount: 10000,
        paymentMethod: 'paystack',
        paymentStatus: 'completed',
        transactionId: 'REF_002',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16')
      }
    ];
    
    res.status(200).json({
      status: 'success',
      results: mockDonations.length,
      data: {
        donations: mockDonations
      }
    });
    
  } catch (error) {
    console.error('Error fetching donations:', error);
    next(new AppError('Failed to fetch donations', 500));
  }
};

// Get donation by ID
exports.getDonationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // TODO: Implement database query to get donation by ID
    // For now, return mock data
    const mockDonation = {
      id: id,
      donorName: 'John Doe',
      donorEmail: 'john@example.com',
      amount: 5000,
      paymentMethod: 'paystack',
      paymentStatus: 'completed',
      transactionId: 'REF_001',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    };
    
    res.status(200).json({
      status: 'success',
      data: {
        donation: mockDonation
      }
    });
    
  } catch (error) {
    console.error('Error fetching donation:', error);
    next(new AppError('Failed to fetch donation', 500));
  }
};

// Create donation record
exports.createDonation = async (req, res, next) => {
  try {
    const { donorName, donorEmail, amount, paymentMethod, transactionId, paymentStatus } = req.body;
    
    // Validate required fields
    if (!donorName || !donorEmail || !amount || !paymentMethod || !transactionId) {
      return next(new AppError('Missing required fields', 400));
    }
    
    // TODO: Implement database insertion
    const newDonation = {
      id: `UDK-${Date.now()}`,
      donorName,
      donorEmail,
      amount,
      paymentMethod,
      paymentStatus: paymentStatus || 'pending',
      transactionId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('New donation record created:', newDonation);
    
    res.status(201).json({
      status: 'success',
      message: 'Donation record created successfully',
      data: {
        donation: newDonation
      }
    });
    
  } catch (error) {
    console.error('Error creating donation:', error);
    next(new AppError('Failed to create donation record', 500));
  }
};

// Update donation status
exports.updateDonationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    
    if (!paymentStatus) {
      return next(new AppError('Payment status is required', 400));
    }
    
    // TODO: Implement database update
    const updatedDonation = {
      id: id,
      paymentStatus: paymentStatus,
      updatedAt: new Date()
    };
    
    console.log('Donation status updated:', updatedDonation);
    
    res.status(200).json({
      status: 'success',
      message: 'Donation status updated successfully',
      data: {
        donation: updatedDonation
      }
    });
    
  } catch (error) {
    console.error('Error updating donation status:', error);
    next(new AppError('Failed to update donation status', 500));
  }
};

// Get donation statistics
exports.getDonationStats = async (req, res, next) => {
  try {
    // TODO: Implement database aggregation
    // For now, return mock statistics
    const mockStats = {
      totalDonations: 150,
      totalAmount: 1500000,
      averageDonation: 10000,
      completedDonations: 140,
      pendingDonations: 10,
      failedDonations: 0,
      thisMonthDonations: 25,
      thisMonthAmount: 250000
    };
    
    res.status(200).json({
      status: 'success',
      data: {
        stats: mockStats
      }
    });
    
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    next(new AppError('Failed to fetch donation statistics', 500));
  }
};

// Delete donation (admin only)
exports.deleteDonation = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // TODO: Implement database deletion
    console.log('Donation deleted:', id);
    
    res.status(204).json({
      status: 'success',
      message: 'Donation deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting donation:', error);
    next(new AppError('Failed to delete donation', 500));
  }
};

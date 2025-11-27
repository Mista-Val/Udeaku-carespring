const AppError = require('../utils/appError');
const { supabaseAdmin } = require('../config/supabase');

// Get all donations (admin only)
exports.getAllDonations = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch donations'
      });
    }

    res.status(200).json({
      status: 'success',
      results: data?.length || 0,
      data: {
        donations: data || []
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
    
    const { data, error } = await supabaseAdmin
      .from('donations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(404).json({
        status: 'error',
        message: 'Donation not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        donation: data
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
    const { 
      donorName, 
      donorEmail, 
      donorPhone, 
      amount, 
      paymentMethod, 
      paymentReference, 
      paymentStatus, 
      purpose, 
      isAnonymous 
    } = req.body;
    
    // Validate required fields
    if (!amount || !paymentMethod || !paymentReference) {
      return next(new AppError('Missing required fields: amount, paymentMethod, paymentReference', 400));
    }
    
    // Save to Supabase database
    try {
      const { data: donationData, error: dbError } = await supabaseAdmin
        .from('donations')
        .insert([
          {
            donor_name: donorName || null,
            donor_email: donorEmail || null,
            donor_phone: donorPhone || null,
            amount: parseFloat(amount),
            currency: 'NGN', // Default currency
            donation_type: 'one_time', // Default type
            payment_method: paymentMethod,
            payment_reference: paymentReference,
            payment_status: paymentStatus || 'pending',
            purpose: purpose || null,
            is_anonymous: isAnonymous || false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (dbError) {
        console.error('Supabase database error:', dbError);
        return next(new AppError('Failed to create donation record', 500));
      }
      
      console.log('✅ Donation saved to database:', donationData.id);
      
      res.status(201).json({
        status: 'success',
        message: 'Donation record created successfully',
        data: {
          donation: donationData
        }
      });
      
    } catch (dbErr) {
      console.error('Database save error:', dbErr);
      next(new AppError('Failed to create donation record', 500));
    }
    
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
    
    const { data, error } = await supabaseAdmin
      .from('donations')
      .update({ 
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return next(new AppError('Failed to update donation status', 500));
    }
    
    console.log('✅ Donation status updated:', id);
    
    res.status(200).json({
      status: 'success',
      message: 'Donation status updated successfully',
      data: {
        donation: data
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
    // Get total donations and amount
    const { data: totalStats, error: totalError } = await supabaseAdmin
      .from('donations')
      .select('amount, payment_status, created_at');

    if (totalError) {
      console.error('Database error:', totalError);
      return next(new AppError('Failed to fetch donation statistics', 500));
    }

    const donations = totalStats || [];
    const completedDonations = donations.filter(d => d.payment_status === 'successful');
    const pendingDonations = donations.filter(d => d.payment_status === 'pending');
    const failedDonations = donations.filter(d => d.payment_status === 'failed');
    
    // Calculate this month's donations
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const thisMonthDonations = donations.filter(d => {
      const date = new Date(d.created_at);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    const stats = {
      totalDonations: donations.length,
      totalAmount: completedDonations.reduce((sum, d) => sum + d.amount, 0),
      averageDonation: completedDonations.length > 0 
        ? completedDonations.reduce((sum, d) => sum + d.amount, 0) / completedDonations.length 
        : 0,
      completedDonations: completedDonations.length,
      pendingDonations: pendingDonations.length,
      failedDonations: failedDonations.length,
      thisMonthDonations: thisMonthDonations.length,
      thisMonthAmount: thisMonthDonations
        .filter(d => d.payment_status === 'successful')
        .reduce((sum, d) => sum + d.amount, 0)
    };
    
    res.status(200).json({
      status: 'success',
      data: {
        stats: stats
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
    
    const { error } = await supabaseAdmin
      .from('donations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return next(new AppError('Failed to delete donation', 500));
    }
    
    console.log('✅ Donation deleted:', id);
    
    res.status(204).json({
      status: 'success',
      message: 'Donation deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting donation:', error);
    next(new AppError('Failed to delete donation', 500));
  }
};

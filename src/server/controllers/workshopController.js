const fetch = require("node-fetch");
const { supabaseAdmin } = require('../config/supabase');

exports.registerForWorkshop = async (req, res, next) => {
  try {
    const payload = req.body;
    
    // Log the received data for debugging
    console.log("Registration data received:", payload);
    
    // Save to Supabase database
    try {
      const { data: registrationData, error: dbError } = await supabaseAdmin
        .from('workshop_registrations')
        .insert([
          {
            first_name: payload.firstName,
            last_name: payload.lastName,
            email: payload.email,
            phone: payload.phone,
            address: payload.address,
            emergency_contact_name: payload.emergencyContactName,
            emergency_contact_phone: payload.emergencyContactPhone,
            medical_conditions: payload.medicalConditions || '',
            experience_level: payload.experienceLevel || 'beginner',
            preferred_training_date: payload.preferredTrainingDate || null,
            hear_about_us: payload.hearAboutUs || '',
            additional_info: payload.additionalInfo || '',
            registration_status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (dbError) {
        console.error('Supabase database error:', dbError);
        // Continue with registration even if DB fails
        console.warn('Database save failed, continuing with workflow');
      } else {
        console.log('✅ Registration saved to database:', registrationData.id);
      }
    } catch (dbErr) {
      console.error('Database save error:', dbErr);
      console.warn('Database save failed, continuing with workflow');
    }
    
    // In development, skip the n8n workflow and return success
    if (process.env.NODE_ENV !== 'production') {
      console.log("Development mode: Skipping n8n workflow, returning success");
      return res.status(200).json({
        status: "success",
        message: "Registration successful! (Development mode)",
        data: payload
      });
    }
    
    // In production, try to submit to n8n workflow
    try {
      const n8nResponse = await fetch(
        "https://onedev.app.n8n.cloud/webhook/UdeakuFirstAidRegistration",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          timeout: 10000 // 10 second timeout
        }
      );

      const text = await n8nResponse.text().catch(() => "");

      if (!n8nResponse.ok) {
        console.error("n8n error:", n8nResponse.status, text);
        
        // If n8n fails, still return success but log the error
        // This ensures the user gets a good experience even if the workflow fails
        console.warn("n8n workflow failed, but returning success to user");
        return res.status(200).json({
          status: "success",
          message: "Registration successful! (Note: Workflow notification failed)",
          data: payload
        });
      }

      console.log("n8n workflow submission successful");
      res.status(200).json({
        status: "success",
        message: "Registration successful!",
        data: payload
      });
      
    } catch (n8nError) {
      console.error("n8n workflow error:", n8nError);
      
      // Even if n8n fails, return success to the user
      // The data can be processed later
      console.warn("n8n workflow failed, but returning success to user");
      return res.status(200).json({
        status: "success",
        message: "Registration successful! (Note: Workflow notification failed)",
        data: payload
      });
    }
    
  } catch (err) {
    console.error("Registration error:", err);
    next(err);
  }
};

// Get all workshop registrations (admin function)
exports.getAllRegistrations = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('workshop_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch registrations'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Registrations retrieved successfully',
      data: data || []
    });
  } catch (err) {
    console.error('Get registrations error:', err);
    next(err);
  }
};

// Update registration status (admin function)
exports.updateRegistrationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabaseAdmin
      .from('workshop_registrations')
      .update({ 
        registration_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update registration status'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Registration status updated successfully',
      data: data
    });
  } catch (err) {
    console.error('Update registration error:', err);
    next(err);
  }
};

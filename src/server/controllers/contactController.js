const AppError = require("../utils/appError");

exports.submitContact = async (req, res, next) => {
  try {
    const payload = req.body;
    
    // Log the received data for debugging
    console.log("Contact form data received:", payload);
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'message'];
    const missingFields = requiredFields.filter(field => !payload[field] || payload[field].trim() === '');
    
    if (missingFields.length > 0) {
      return next(new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400));
    }
    
    // In development, skip email sending and return success
    if (process.env.NODE_ENV !== 'production') {
      console.log("Development mode: Contact form submission successful");
      return res.status(200).json({
        status: "success",
        message: "Contact form submitted successfully! We'll get back to you soon.",
        data: {
          name: payload.name,
          email: payload.email,
          subject: payload.subject || 'No subject',
          message: payload.message,
          phone: payload.phone || 'Not provided',
          submittedAt: new Date().toISOString()
        }
      });
    }
    
    // Production: Send email using n8n workflow or email service
    // TODO: Implement email service integration
    const emailData = {
      to: process.env.CONTACT_EMAIL || 'carespringsup@gmail.com',
      subject: `New Contact Form Submission: ${payload.subject || 'Website Inquiry'}`,
      text: `
Name: ${payload.name}
Email: ${payload.email}
Phone: ${payload.phone || 'Not provided'}
Subject: ${payload.subject || 'No subject'}

Message:
${payload.message}

Submitted at: ${new Date().toISOString()}
      `
    };
    
    // TODO: Send email via n8n or email service
    // For now, log and return success
    console.log("Email to be sent:", emailData);
    
    res.status(200).json({
      status: "success",
      message: "Contact form submitted successfully! We'll get back to you soon.",
      data: emailData
    });
    
  } catch (error) {
    console.error("Contact form submission error:", error);
    next(new AppError("Failed to submit contact form. Please try again.", 500));
  }
};

exports.sendPartnershipEmail = async (req, res, next) => {
  try {
    const payload = req.body;
    
    // Log the received data for debugging
    console.log("Partnership form data received:", payload);
    
    // Validate required fields
    const requiredFields = ['orgName', 'orgType', 'contactPerson', 'contactEmail', 'partnershipInterest'];
    const missingFields = requiredFields.filter(field => !payload[field] || payload[field].trim() === '');
    
    if (missingFields.length > 0) {
      return next(new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400));
    }
    
    // In development, skip email sending and return success
    if (process.env.NODE_ENV !== 'production') {
      console.log("Development mode: Partnership form submission successful");
      return res.status(200).json({
        status: "success",
        message: "Partnership inquiry submitted successfully! We'll contact you within 3-5 business days.",
        data: payload
      });
    }
    
    // Production: Send partnership inquiry email
    const emailData = {
      to: process.env.CONTACT_EMAIL || 'carespringsup@gmail.com',
      subject: `New Partnership Request: ${payload.orgName}`,
      text: `
Organization: ${payload.orgName}
Type: ${payload.orgType}
Contact Person: ${payload.contactPerson}
Email: ${payload.contactEmail}
Phone: ${payload.contactPhone}
Partnership Interest: ${payload.partnershipInterest}
Organization Size: ${payload.orgSize}
Goals: ${payload.partnershipGoals}
Resources: ${payload.availableResources}
Timeline: ${payload.timeline}
Additional Info: ${payload.additionalInfo}
Submitted: ${payload.submittedAt}
      `
    };
    
    // TODO: Send email via n8n or email service
    // For now, log and return success
    console.log("Partnership email to be sent:", emailData);
    
    res.status(200).json({
      status: "success",
      message: "Partnership inquiry submitted successfully! We'll contact you within 3-5 business days.",
      data: emailData
    });
    
  } catch (error) {
    console.error("Partnership form submission error:", error);
    next(new AppError("Failed to submit partnership inquiry. Please try again.", 500));
  }
};
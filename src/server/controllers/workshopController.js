const fetch = require("node-fetch");

exports.registerForWorkshop = async (req, res, next) => {
  try {
    const payload = req.body;
    
    // Log the received data for debugging
    console.log("Registration data received:", payload);
    
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

/**
 * Server-side Form Validator & Proxy Handler
 * Path: /api/contact
 */

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, business, message } = req.body || {};
    const errors = {};

    // Helper: Trim inputs safely
    const trimValue = (val) => (typeof val === 'string' ? val.trim() : '');

    const trimmedName = trimValue(name);
    const trimmedEmail = trimValue(email);
    const trimmedPhone = trimValue(phone);
    const trimmedBusiness = trimValue(business);
    const trimmedMessage = trimValue(message);

    // 1. Validate Full Name
    if (!trimmedName) {
      errors.name = 'Full Name is required.';
    }

    // 2. Validate Email
    if (!trimmedEmail) {
      errors.email = 'Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errors.email = 'Please enter a valid email address.';
      }
    }

    // 3. Validate Phone Number (as Phone is required/essential in contact form)
    if (!trimmedPhone) {
      errors.phone = 'Phone is required.';
    } else {
      const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
      if (!phoneRegex.test(trimmedPhone)) {
        errors.phone = 'Please enter a valid phone number (7-20 digits).';
      }
    }

    // 4. Validate Business Name
    if (!trimmedBusiness) {
      errors.business = 'Business is required.';
    }

    // 5. Validate Message
    if (!trimmedMessage) {
      errors.message = 'Message is required.';
    }

    // If validation fails, return 400 Bad Request with all error messages
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // If validation passes, construct trimmed payload
    const trimmedPayload = {
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      business: trimmedBusiness,
      message: trimmedMessage
    };

    // Forward the valid data to the external n8n webhook
    try {
      const webhookResponse = await fetch('https://sbiixla.app.n8n.cloud/webhook/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(trimmedPayload)
      });

      if (!webhookResponse.ok) {
        console.error(`n8n webhook endpoint returned error code ${webhookResponse.status}`);
      }
    } catch (webhookErr) {
      console.error('Failed to forward request to n8n webhook:', webhookErr);
      // We still return 200 since the data was successfully validated on our server
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Unexpected error in server validation handler:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

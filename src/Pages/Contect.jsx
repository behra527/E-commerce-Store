import React, { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { Typography } from '@mui/material';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;

    const name = form.user_name.value.trim();
    const email = form.user_email.value.trim();
    const phone = form.user_phone.value.trim();
    const message = form.message.value.trim();
    
    // Check if all fields are filled
    if (!name || !email || !phone || !message) {
      Swal.fire('Missing Information', 'Please fill in all fields', 'warning');
      return;
    }
    
    // Simple email validation
    if (!email.includes('@') || !email.includes('.')) {
      Swal.fire('Invalid Email', 'Please enter a valid email address', 'warning');
      return;
    }

    setLoading(true);

    try {
      const result = await emailjs.sendForm(
        'service_40pngf2', // Replace with your EmailJS service ID
        'template_zryclbt', // Replace with your EmailJS template ID
        formRef.current,
        'v2K8u5ghtsY67Ey0_' // Replace with your EmailJS public key
      );

      if (result.status === 200) {
        Swal.fire('Success!', 'Email sent successfully', 'success');
        form.reset();
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      Swal.fire('Error!', 'Failed to send email. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 contact-form">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <Typography variant="h3" className="mb-4 fw-bold text-center">
            Contact
          </Typography>

          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <input name="user_name" className="form-control" placeholder="Your Name" required />
              </div>
              <div className="col-md-6">
                <input name="user_email" type="email" className="form-control" placeholder="Email *" required />
              </div>
              <div className="col-12">
                <input name="user_phone" className="form-control" placeholder="Phone number" required />
              </div>
              <div className="col-12">
                <textarea name="message" className="form-control" rows="5" placeholder="Message" required></textarea>
              </div>
              <div className="col-12 text-start">
                <button 
                  type="submit" 
                  className="btn btn-dark px-5 py-2 fw-semibold"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Contact;

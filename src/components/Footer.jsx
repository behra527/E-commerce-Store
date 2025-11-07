import React, { useState } from "react";
import "../styles/Footer.css";
import Swal from "sweetalert2";
import axios from "axios";

// Material UI Icons
import {
  ArrowForward,
  ReplayOutlined,
  PrivacyTipOutlined,
  GavelOutlined,
  MailOutline,
} from "@mui/icons-material";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    if (!email.trim()) {
      return Swal.fire("Email Required", "Please enter an email.", "warning");
    }

    try {
      await axios.post("https://dexter-leather-h288.onrender.com/api/newsletter/subscribe", { email });
      Swal.fire("Subscribed!", "You're now part of the Dexter fam 🎉", "success");
      setEmail("");
    } catch (err) {
      Swal.fire("Oops!", "Something went wrong. Try again later.", "error");
    }
  };

  const handleFooterLinkClick = (title, content) => {
    Swal.fire({
      title: `<strong>${title}</strong>`,
      html: `<div style="text-align: left; font-size: 0.95rem; line-height: 1.6;">${content}</div>`,
      icon: "info",
      confirmButtonText: "Close",
      width: window.innerWidth < 600 ? "90%" : 600,
    });
  };

  return (
    <footer className="footer-section">
      <div className="container text-center py-5">
        <h3 className="footer-title mb-3">Don't Miss Out!</h3>
        <p className="footer-subtitle mb-1">
          Be the first to hear about our hot drops, secret sales & more.
        </p>
        <p className="footer-subtitle mb-4">Join the DEXTER fam now!</p>

        <div className="footer-input-wrapper mx-auto">
          <input
            type="email"
            placeholder="Email"
            className="footer-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="footer-btn" onClick={handleSubscribe}>
            <ArrowForward />
          </button>
        </div>
      </div>

      <div className="footer-bottom py-3 px-3 px-md-5">
        <div className="container">
          <div className="row align-items-center text-center text-md-start">
            <div className="col-md-6 mb-3 mb-md-0">
              <p className="mb-0">© 2025, Dexter Leather — designed by skcoder</p>
            </div>
            <div className="col-md-6">
              <div className="footer-links d-flex flex-wrap justify-content-center justify-content-md-end gap-3">
                <span
                  onClick={() =>
                    handleFooterLinkClick(
                      "Refund Policy",
                      "All refunds must be requested within 7 days of purchase. Product must be unused and in original packaging."
                    )
                  }
                >
                  <ReplayOutlined fontSize="small" /> Refund policy
                </span>
                <span
                  onClick={() =>
                    handleFooterLinkClick(
                      "Privacy Policy",
                      "We collect only necessary data for improving our services. Your privacy is our top priority."
                    )
                  }
                >
                  <PrivacyTipOutlined fontSize="small" /> Privacy policy
                </span>
                <span
                  onClick={() =>
                    handleFooterLinkClick(
                      "Terms of Service",
                      "Use of this site constitutes acceptance of our terms and conditions. Violations may result in suspension."
                    )
                  }
                >
                  <GavelOutlined fontSize="small" /> Terms of service
                </span>
                <span
                  onClick={() =>
                    handleFooterLinkClick(
                      "Contact Information",
                      "Email: dexterleather10@gmail.com<br>Phone: +4407308218767"
                    )
                  }
                >
                  <MailOutline fontSize="small" /> Contact
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

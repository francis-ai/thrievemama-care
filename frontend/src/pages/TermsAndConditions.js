import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../assets/css/TermsAndConditions.css';

const TermsAndConditions = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="Terms-container">
      <div className="hero-section">
        <div className="animated-blob-1"></div>
        <div className="animated-blob-2"></div>
        <h1 className="hero-title">Terms & Conditions</h1>
      </div>

      <Container className="my-5">
        <Row className="justify-content-center" data-aos="fade-up">
          <Col md={10}>
            <h2 className="mb-4">Welcome to ThrivemamaCare</h2>
            <p>
              By using our platform, you agree to the following terms and conditions. Please read them carefully before proceeding.
            </p>

            <h4 className="mt-5">1. Eligibility</h4>
            <p>
              You must be at least 18 years old to use our services. By creating an account, you confirm that you meet the age requirement.
            </p>

            <h4 className="mt-4">2. User Responsibilities</h4>
            <p>
              You agree to provide accurate information during registration and to keep your account credentials secure. Any misuse or unauthorized activity will result in suspension or termination of your account.
            </p>

            <h4 className="mt-4">3. Caregiver Conduct</h4>
            <p>
              All caregivers must undergo background checks and uphold our community standards. Any form of misconduct, neglect, or unprofessional behavior will not be tolerated.
            </p>

            <h4 className="mt-4">4. Payment & Refund Policy</h4>
            <p>
              All payments must be made through our secure platform. Refunds are issued on a case-by-case basis, depending on service satisfaction and review.
            </p>

            <h4 className="mt-4">5. Termination</h4>
            <p>
              We reserve the right to terminate any user account that violates these terms or poses a risk to the safety of our community.
            </p>

            <h4 className="mt-4">6. Changes to Terms</h4>
            <p>
              We may update these terms occasionally. Continued use of the platform constitutes acceptance of any revised terms.
            </p>

            <p className="mt-5 text-muted">
              Last updated: May 29, 2025
            </p>
          </Col>
        </Row>
        <Row className="mt-5 text-center"data-aos="fade-up">
          <Col>
          <h3>Join Our Community</h3>
          <p>Whether you're a parent, a family caregiver, or a professional looking to support others, you're welcome here.<br></br> We're growing a supportive community where care is not just a service, but a way of life.</p>
          <p>
              <Link to="/waiting-list" className="waiting-list-btn">Join the Waitlist</Link>
          </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TermsAndConditions;

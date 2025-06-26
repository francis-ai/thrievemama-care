import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, Container, Row, Col } from 'react-bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../assets/css/Faqs.css';

const Faqs = () => {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    return (
        <div className="Faqs-container">
            <div className="hero-section">
                <div className="animated-blob-1"></div>
                <div className="animated-blob-2"></div>
                <h1 className="hero-title">FAQs</h1>
            </div>

            <Container className="my-5">
                <Row className="justify-content-center mb-4" data-aos="fade-down">
                    <Col md={8} className="text-center">
                        <h2>Frequently Asked Questions</h2>
                        <p className="text-muted">Got questions? We’ve got answers.</p>
                    </Col>
                </Row>

                <Row>
                    <Col md={10} className="mx-auto" data-aos="fade-up">
                        <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>How do I find a caregiver through ThrivemamaCare?</Accordion.Header>
                                <Accordion.Body>
                                    Simply sign up, complete your care preferences, and we’ll match you with trusted, vetted caregivers who meet your needs.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Are caregivers background-checked?</Accordion.Header>
                                <Accordion.Body>
                                    Yes. All caregivers go through a rigorous background check and verification process before being approved.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>Can I request care on short notice?</Accordion.Header>
                                <Accordion.Body>
                                    Absolutely! We offer flexible care options, including urgent and short-term caregiving services.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3">
                                <Accordion.Header>Is ThrivemamaCare available in my city?</Accordion.Header>
                                <Accordion.Body>
                                    We’re rapidly expanding. Join the waitlist to get notified when we launch in your area.
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
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

export default Faqs;

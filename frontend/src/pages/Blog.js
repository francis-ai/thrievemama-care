import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import alt from '../assets/images/alt.gif'; 
import '../assets/css/Blog.css';

const Blog = () => {
    const posts = [
    {
        title: "How to Choose the Right Caregiver",
        excerpt: "Selecting the right support for your family starts with trust and compatibility...",
        author: "Oluwadamilola Johnson",
        date: "May 20, 2025",
        slug: "read-more",
        image: alt,
    },
    {
        title: "Balancing Work and Family With In-Home Care",
        excerpt: "Discover how families can maintain their routines while ensuring loved ones get the care they need...",
        author: "Chinaza Okeke",
        date: "April 15, 2025",
        slug: "read-more",
        image: alt,
    },
    {
        title: "Understanding Postpartum Emotional Needs",
        excerpt: "Emotional support is as important as physical recovery. Learn how caregivers can bridge that gap...",
        author: "Temi Adebayo",
        date: "March 28, 2025",
        slug: "read-more",
        image: alt,
    },
    {
        title: "Top 5 Signs Your Loved One Needs Extra Help",
        excerpt: "Subtle signs like forgetfulness or difficulty with chores may mean it’s time to consider caregiving...",
        author: "Ngozi Umeh",
        date: "March 2, 2025",
        slug: "read-more",
        image: alt,
    },
    {
        title: "Creating a Safe Home Environment for the Elderly",
        excerpt: "From handrails to smart monitors, here’s how to ensure your home is safe and accessible...",
        author: "Bola Adedayo",
        date: "February 10, 2025",
        slug: "read-more",
        image: alt,
    },
    {
        title: "Daily Routines That Make a Big Difference",
        excerpt: "Simple structure can bring stability. Explore morning and evening routines for caregivers and families...",
        author: "Grace Eze",
        date: "January 18, 2025",
        slug: "read-more",
        image: alt,
    },
    ];



    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);


    return (
        <div className="Blog-container">
            <div className="hero-section">
                <div className="animated-blob-1"></div>
                <div className="animated-blob-2"></div>
                <h1 className="hero-title">Blog</h1>
            </div>
            
            <Container className="my-5 blog-page">
            {/* Hero Section */}
            <div className="blog-hero text-center py-5" data-aos="fade-down">
                <h1>ThrivemamaCare Blog</h1>
                <p className="lead">Guidance, stories, and tips for caregivers and thriving families</p>
            </div>

            {/* Blog Grid */}
            <Row>
                {posts.map((post, index) => (
                <Col md={4} sm={6} className="mb-4" key={index} data-aos="fade-up">
                    <Card className="blog-card h-100">
                    <Card.Img variant="top" src={post.image} alt={post.title} />
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.excerpt}</Card.Text>
                        <small className="text-muted">By {post.author} • {post.date}</small>
                        <div className="mt-3">
                        <Link to={`/blog/${post.slug}`} className="btn btn-outline btn-sm">
                            Read More
                        </Link>
                        </div>
                    </Card.Body>
                    </Card>
                </Col>
                ))}
            </Row>

            {/* Pagination */}
            <div className="text-center mt-4">
                <Button variant="outline-secondary">Load More</Button>
            </div>

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
    )
}
export default Blog;
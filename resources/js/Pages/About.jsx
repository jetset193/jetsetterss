import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import Navbar from './Common/Navbar';
import Footer from './Common/Footer';
import withPageElements from './Common/PageWrapper';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Jetsetters Corporation</title>
        <meta name="description" content="Learn about Jetsetters Corporation, your trusted travel partner for flights, cruises, hotels, and more across the USA and Canada." />
      </Helmet>
      
      <Navbar forceScrolled={true} />
      
      <Container className="py-5">
        <Row className="justify-content-center mb-4">
          <Col md={10}>
            <Card className="shadow-sm">
              <Card.Body className="p-5">
                <h1 className="text-center mb-4">About Us</h1>
                <div className="about-content">
                  <section className="mb-4">
                    <p className="lead">
                      Jetsetters Corporation is your trusted travel partner specializing in flight tickets, 
                      cruise packages, hotel bookings, car rentals, and train travel across the USA and Canada. 
                      Whether you're planning a weekend getaway, a cross-country adventure, or a business trip, 
                      we simplify your journey from start to finish.
                    </p>
                  </section>

                  <section className="mb-4">
                    <p>
                      With a strong commitment to convenience, affordability, and customer satisfaction, 
                      Jetsetters offers both online and phone-based booking options — ensuring that 
                      personalized support is always just a call or click away. We work closely with 
                      top airlines, cruise lines, hotel chains, and car rental providers to bring you 
                      the best travel options at competitive prices.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h2 className="h3 mb-4">What sets us apart?</h2>
                    <div className="features">
                      <div className="feature mb-3">
                        <h3 className="h5">Comprehensive Travel Solutions</h3>
                        <p>From air to sea to land, we cover it all.</p>
                      </div>
                      
                      <div className="feature mb-3">
                        <h3 className="h5">Customer-Centric Service</h3>
                        <p>Our travel advisors are available to guide you every step of the way.</p>
                      </div>
                      
                      <div className="feature mb-3">
                        <h3 className="h5">Fast & Secure Bookings</h3>
                        <p>Easy payment options and instant confirmations.</p>
                      </div>
                      
                      <div className="feature mb-3">
                        <h3 className="h5">Tailored for North American Travelers</h3>
                        <p>We understand the unique needs of customers in the U.S. and Canada.</p>
                      </div>
                    </div>
                  </section>

                  <section className="mb-4">
                    <p className="lead text-center">
                      At Jetsetters, we believe travel should be smooth, exciting, and stress-free — 
                      and we're here to make that possible.
                    </p>
                  </section>

                  <section className="contact-info text-center mt-5 pt-4 border-top">
                    <h2 className="h4 mb-3">Get in Touch</h2>
                    <p>
                      <strong>Phone:</strong> +1(888) 581-3028<br />
                      <strong>Email:</strong> info@jetsetterss.com<br />
                      <strong>Website:</strong> https://www.jetsetterss.com/
                    </p>
                  </section>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      <Footer />
    </>
  );
};

export default withPageElements(About); 
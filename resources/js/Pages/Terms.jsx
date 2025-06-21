import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import Navbar from './Common/Navbar';
import Footer from './Common/Footer';
import withPageElements from './Common/PageWrapper';

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions - Jetsetters Corporation</title>
        <meta name="description" content="Jetsetters Corporation terms and conditions for travel-related booking services." />
      </Helmet>
      
      <Navbar forceScrolled={true} />
      
      <Container className="py-5">
        <Row className="justify-content-center mb-4">
          <Col md={10}>
            <Card className="shadow-sm">
              <Card.Body className="p-5">
                <h1 className="text-center mb-4">Terms and Conditions</h1>
                <div className="terms-content">
                  <section className="mb-4">
                    <h2>Introduction</h2>
                    <p>Last Updated: {new Date().toLocaleDateString()}</p>
                    <p>
                      Jetsetters Corporation ("Jetsetters," "we," "our," "us") provides travel-related booking services via our website and phone. 
                      By confirming a booking through any of our platforms, you agree to the following:
                    </p>
                  </section>

                  <section className="mb-4">
                    <h2>1. Services Provided</h2>
                    <p>We offer booking services for but not limited to:</p>
                    <ul>
                      <li>Flights</li>
                      <li>Cruise tickets</li>
                      <li>Hotel accommodations</li>
                      <li>Car rentals</li>
                      <li>Train tickets</li>
                    </ul>
                    <p>Only for customers traveling within or from the USA and Canada.</p>
                  </section>

                  <section className="mb-4">
                    <h2>2. Booking Methods</h2>
                    <p>Bookings can be made via:</p>
                    <ul>
                      <li>Website: https://www.jetsetterss.com/</li>
                      <li>Phone: +1(888) 581-3028</li>
                    </ul>
                    <p>Phone bookings are confirmed with a follow-up email or text.</p>
                  </section>

                  <section className="mb-4">
                    <h2>3. Payment & Confirmation</h2>
                    <ul>
                      <li>Full payment is required before any booking is finalized.</li>
                      <li>Customers are responsible for verifying all details in the confirmation.</li>
                      <li>Errors must be reported within 2 hours.</li>
                    </ul>
                  </section>

                  <section className="mb-4">
                    <h2>4. Fees</h2>
                    <ul>
                      <li>All bookings include a non-refundable service/processing fee.</li>
                      <li>This is in addition to fees charged by third-party suppliers.</li>
                    </ul>
                  </section>

                  <section className="mb-4">
                    <h2>5. Changes, Cancellations & Refunds</h2>
                    <ul>
                      <li>All changes or cancellations must be requested in writing or by phone.</li>
                      <li>Jetsetters charges a service fee on all changes or refunds.</li>
                      <li>Third-party refund timelines can be up to 6–8 weeks or longer.</li>
                      <li>Jetsetters service fees are non-refundable under any condition.</li>
                    </ul>
                  </section>

                  <section className="mb-4">
                    <h2>6. Travel Documents</h2>
                    <p>
                      Customers must ensure they meet all documentation and visa requirements. 
                      Jetsetters is not responsible for denied travel due to incomplete documents.
                    </p>
                  </section>

                  <section className="mb-4">
                    <h2>7. Liability Limitation</h2>
                    <p>
                      Jetsetters is a booking intermediary and not responsible for actions, errors, 
                      or delays of third-party providers (airlines, cruise lines, hotels, etc.).
                    </p>
                  </section>

                  <section className="mb-4">
                    <h2>8. Force Majeure</h2>
                    <p>
                      We are not liable for failure or delay due to causes beyond our control 
                      (e.g., natural disasters, strikes, government action, pandemics).
                    </p>
                  </section>

                  <section className="mb-4">
                    <h2>9. Payment Authorization</h2>
                    <p>
                      By providing payment online or by phone, you authorize Jetsetters to charge 
                      the total cost, including service fees.
                    </p>
                  </section>

                  <section className="mb-4">
                    <h2>10. Disputes</h2>
                    <p>
                      All disputes are governed by the laws of California.
                      Venue for legal matters is exclusively in Tracy, California.
                    </p>
                  </section>

                  <section className="mb-4">
                    <h2>11. Terms Updates</h2>
                    <p>
                      We may update these Terms without notice. The version applicable to your booking 
                      is the one in effect at the time of confirmation.
                    </p>
                  </section>

                  <section className="mb-4">
                    <h2>12. Contact</h2>
                    <p>Jetsetters Corporation</p>
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

export default withPageElements(Terms); 
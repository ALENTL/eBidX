import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import StripePayment from "../components/StripeCheckout";

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/auctions/${id}/`,
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
        setItem(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Could not load checkout details. Please try again.");
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2">Loading secure checkout...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      <h2 className="mb-4 fw-bold">Secure Checkout 🔒</h2>

      <Row>
        <Col md={5} className="mb-4">
          <Card className="shadow-sm border-0 bg-light">
            <Card.Body>
              <h5 className="fw-bold mb-3">Order Summary</h5>

              <div className="d-flex align-items-center mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                  className="me-3"
                />
                <div>
                  <h6 className="mb-0 fw-bold">{item.title}</h6>
                  <small className="text-muted">Item #{item.id}</small>
                </div>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Winning Bid</span>
                <span className="fw-bold">₹{item.current_price}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Processing Fee (0%)</span>
                <span className="text-muted">₹0.00</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between fs-4 fw-bold">
                <span>Total</span>
                <span className="text-success">₹{item.current_price}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={7}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-4">
              <h4 className="mb-3 fw-bold">Pay with Card</h4>

              <Alert variant="info" className="small mb-4">
                <i className="bi bi-info-circle-fill me-2"></i>
                <strong>Test Mode Active:</strong> You will not be charged.{" "}
                <br />
                Use card number:{" "}
                <code className="fw-bold">4242 4242 4242 4242</code>
              </Alert>

              <StripePayment auctionId={item.id} price={item.current_price} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;

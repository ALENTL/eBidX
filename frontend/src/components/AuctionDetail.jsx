import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/auctions/${id}/`)
      .then((res) => {
        setItem(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Item not found");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </Container>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="mt-5" style={{ maxWidth: "800px" }}>
      <Card className="shadow-lg border-0">
        {item.image && (
          <Card.Img
            variant="top"
            src={item.image}
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        )}
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-start">
            <Card.Title as="h2" className="fw-bold">
              {item.title}
            </Card.Title>
            <span
              className={`badge ${item.condition === "new" ? "bg-success" : "bg-secondary"}`}
            >
              {item.condition === "new" ? "New" : "Used"}
            </span>
          </div>

          <Card.Text className="text-muted mt-3" style={{ fontSize: "1.1rem" }}>
            {item.description}
          </Card.Text>

          <hr className="my-4" />

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <small className="text-uppercase text-muted fw-bold">
                Current Price
              </small>
              <h3 className="text-primary display-6 fw-bold">
                ₹{item.base_price}
              </h3>
            </div>
            <div className="text-end">
              <small className="text-uppercase text-muted fw-bold">
                Seller
              </small>
              <p className="mb-0 fs-5">{item.seller}</p>
            </div>
          </div>

          {isAuthenticated ? (
            <Button variant="success" size="lg" className="w-100 py-3 fw-bold">
              Place Bid (Coming Soon)
            </Button>
          ) : (
            <Button
              variant="warning"
              size="lg"
              className="w-100 py-3 fw-bold"
              onClick={() => navigate("/login")}
            >
              Login to Bid
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AuctionDetail;

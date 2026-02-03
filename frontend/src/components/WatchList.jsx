import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Watchlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/watchlist/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <Container className="mt-5">
      <h2 className="mb-4">My Watchlist ❤️</h2>

      {items.length === 0 ? (
        <Alert variant="info">
          Your watchlist is empty. Go find some cool items!
        </Alert>
      ) : (
        <Row>
          {items.map((item) => (
            <Col md={4} key={item.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <div
                  style={{
                    height: "200px",
                    overflow: "hidden",
                    background: "#f8f9fa",
                  }}
                >
                  {item.images && item.images.length > 0 ? (
                    <Card.Img
                      variant="top"
                      src={item.images[0].image}
                      style={{ objectFit: "cover", height: "100%" }}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                      No Image
                    </div>
                  )}
                </div>
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text className="text-primary fw-bold">
                    ₹{item.current_price}
                  </Card.Text>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => navigate(`/auction/${item.id}`)}
                  >
                    View Auction
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Watchlist;

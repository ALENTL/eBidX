import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  Row,
  Col,
  Badge,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState({ bids: [], listings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get("http://127.0.0.1:8000/api/dashboard/", {
        headers: { Authorization: `Token ${token}` },
      });
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load profile data.");
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Container className="text-center mt-5">
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
    <Container className="mt-5">
      <div className="mb-4">
        <h2 className="fw-bold">My Dashboard</h2>
        <p className="text-muted">Manage your bids and listings</p>
      </div>

      <h4 className="mb-3 border-bottom pb-2">My Recent Bids</h4>
      {data.bids.length === 0 ? (
        <Alert variant="info">You haven't placed any bids yet.</Alert>
      ) : (
        <Row>
          {data.bids.map((bid) => {
            const item = bid.auction_item;
            const imageUrl =
              item.images && item.images.length > 0
                ? item.images[0].image
                : null;

            return (
              <Col md={6} lg={4} key={bid.id} className="mb-4">
                <Card className="shadow-sm h-100">
                  <div
                    style={{
                      height: "150px",
                      overflow: "hidden",
                      background: "#f8f9fa",
                    }}
                  >
                    {imageUrl ? (
                      <Card.Img
                        variant="top"
                        src={imageUrl}
                        style={{
                          objectFit: "cover",
                          height: "100%",
                          width: "100%",
                        }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                        No Image
                      </div>
                    )}
                  </div>
                  <Card.Body>
                    <Card.Title className="h6">{item.title}</Card.Title>

                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">My Bid:</span>
                      <span className="fw-bold text-primary">
                        ₹{bid.amount}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Current Price:</span>
                      <span className="fw-bold">₹{item.current_price}</span>
                    </div>

                    <div className="mt-3 text-center">
                      {parseFloat(bid.amount) >=
                      parseFloat(item.current_price) ? (
                        <Badge bg="success" className="w-100 py-2">
                          Winning
                        </Badge>
                      ) : (
                        <Badge bg="danger" className="w-100 py-2">
                          Outbid
                        </Badge>
                      )}
                    </div>

                    <Button
                      variant="outline-dark"
                      size="sm"
                      className="w-100 mt-2"
                      onClick={() => navigate(`/auction/${item.id}`)}
                    >
                      View Auction
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <h4 className="mt-5 mb-3 border-bottom pb-2">My Listings</h4>
      {data.listings.length === 0 ? (
        <Alert variant="light" className="border">
          You haven't listed any items for sale.
        </Alert>
      ) : (
        <Row>
          {data.listings.map((item) => {
            const imageUrl =
              item.images && item.images.length > 0
                ? item.images[0].image
                : null;

            return (
              <Col md={4} key={item.id} className="mb-4">
                <Card className="h-100 border-0 shadow-sm bg-light">
                  <div
                    style={{
                      height: "100px",
                      overflow: "hidden",
                      background: "#e9ecef",
                    }}
                  >
                    {imageUrl ? (
                      <Card.Img
                        variant="top"
                        src={imageUrl}
                        style={{
                          objectFit: "cover",
                          height: "100%",
                          width: "100%",
                        }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100 small text-muted">
                        No Image
                      </div>
                    )}
                  </div>
                  <Card.Body>
                    <Card.Title className="h6">{item.title}</Card.Title>
                    <Card.Text className="small text-muted">
                      Current Price: ₹{item.current_price}
                    </Card.Text>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-100"
                      onClick={() => navigate(`/auction/${item.id}`)}
                    >
                      View My Item
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;

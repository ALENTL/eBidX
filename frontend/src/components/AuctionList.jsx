import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Form,
  InputGroup,
  Alert,
} from "react-bootstrap";
import CountdownTimer from "./CountdownTimer";

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = () => {
    setLoading(true);
    setError(null);

    let url = "http://127.0.0.1:8000/api/auctions/?";
    if (searchTerm) url += `search=${searchTerm}&`;
    if (category !== "all") url += `category=${category}`;

    axios
      .get(url)
      .then((res) => {
        setAuctions(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load auctions.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") fetchAuctions();
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="mb-4">
        <h2 className="fw-bold mb-3 text-center">Live Auctions</h2>

        {/* Search & Filter Bar */}
        <InputGroup className="mb-3 mx-auto" style={{ maxWidth: "700px" }}>
          <Form.Select
            style={{ maxWidth: "150px" }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home</option>
            <option value="vehicles">Vehicles</option>
            <option value="toys">Toys</option>
            <option value="other">Other</option>
          </Form.Select>

          <Form.Control
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button variant="primary" onClick={fetchAuctions}>
            Search
          </Button>
        </InputGroup>
      </div>

      <Row>
        {auctions.length === 0 ? (
          <div className="text-center mt-5">
            <h4 className="text-muted">No items found.</h4>
          </div>
        ) : (
          auctions.map((item) => (
            <Col key={item.id} md={4} className="mb-4">
              <Card className="shadow-sm h-100 border-0">
                <div
                  style={{
                    height: "200px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {item.image && (
                    <Card.Img
                      variant="top"
                      src={item.image}
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  )}
                  <div className="position-absolute top-0 end-0 bg-dark text-white px-2 py-1 m-2 rounded small opacity-75">
                    {item.condition}
                  </div>
                  <div className="position-absolute bottom-0 start-0 bg-primary text-white px-2 py-1 m-2 rounded small opacity-90">
                    {item.category}
                  </div>
                </div>

                <Card.Body>
                  <Card.Title className="text-truncate">
                    {item.title}
                  </Card.Title>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">Current Price</span>
                    <span className="fw-bold text-success fs-5">
                      ₹{item.current_price}
                    </span>
                  </div>
                  <div className="mb-3 text-center bg-light rounded p-1">
                    <small className="text-muted">Time Remaining:</small>
                    <div className="fw-bold text-danger">
                      <CountdownTimer targetDate={item.end_date} />
                    </div>
                  </div>
                  <Link to={`/auction/${item.id}`}>
                    <Button variant="primary" className="w-100">
                      View Auction
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default AuctionList;

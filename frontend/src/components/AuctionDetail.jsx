import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
  Form,
  InputGroup,
} from "react-bootstrap";
import CountdownTimer from "./CountdownTimer";

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState("");

  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    fetchAuctionData();
  }, [id]);

  const fetchAuctionData = () => {
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
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidError("");
    setBidSuccess("");

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/auctions/${id}/bid/`,
        { amount: bidAmount },
        { headers: { Authorization: `Token ${token}` } },
      );

      setBidSuccess(`Bid placed successfully! New Price: ₹${res.data.amount}`);
      setBidAmount("");

      setItem((prev) => ({ ...prev, current_price: res.data.amount }));
    } catch (err) {
      if (err.response && err.response.data.error) {
        setBidError(err.response.data.error);
      } else {
        setBidError("Something went wrong. Try again.");
      }
    }
  };

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

  console.log("Data from backend: ", item);

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
          <Card.Title as="h2" className="fw-bold">
            {item.title}
          </Card.Title>
          <Card.Text className="text-muted">{item.description}</Card.Text>
          <hr className="my-4" />

          <CountdownTimer targetDate={item.end_date} />

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <small className="text-uppercase text-muted fw-bold">
                Current Price
              </small>
              <h3 className="text-primary display-6 fw-bold">
                ₹{item.current_price}
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
            <div className="bg-light p-4 rounded">
              <h5 className="mb-3">Place Your Bid</h5>

              {bidError && <Alert variant="danger">{bidError}</Alert>}
              {bidSuccess && <Alert variant="success">{bidSuccess}</Alert>}

              <Form onSubmit={handleBidSubmit}>
                <InputGroup className="mb-3">
                  <InputGroup.Text>₹</InputGroup.Text>
                  <Form.Control
                    type="number"
                    placeholder={`Enter amount > ${item.current_price}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                  />
                  <Button variant="success" type="submit">
                    Submit Bid
                  </Button>
                </InputGroup>
              </Form>
            </div>
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

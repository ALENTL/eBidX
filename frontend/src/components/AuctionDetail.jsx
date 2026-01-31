import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Spinner } from "react-bootstrap";

const AuctionDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/auctions/${id}/`)
      .then((res) => setItem(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!item)
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </Container>
    );

  return (
    <Container className="mt-5" style={{ maxWidth: "800px" }}>
      <Card className="shadow-sm">
        {item.image && (
          <Card.Img
            variant="top"
            src={item.image}
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        )}
        <Card.Body>
          <Card.Title as="h2">{item.title}</Card.Title>
          <Card.Text className="text-muted">{item.description}</Card.Text>
          <hr />
          <h3 className="text-primary">Current Price: ₹{item.base_price}</h3>
          <p>
            <strong>Seller:</strong> {item.seller}
          </p>
          <Button variant="success" size="lg" className="w-100">
            Place Bid (Coming Soon)
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AuctionDetail;

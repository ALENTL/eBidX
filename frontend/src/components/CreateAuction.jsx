import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";

const CreateAuction = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    base_price: "",
    condition: "used",
    category: "electronics",
    end_date: "",
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("base_price", formData.base_price);
    data.append("condition", formData.condition);
    data.append("category", formData.category);
    data.append("end_date", formData.end_date);

    for (let i = 0; i < images.length; i++) {
      data.append("uploaded_images", images[i]);
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/auctions/", data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Failed to create auction. Please check your inputs.");
      }
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <Card className="shadow p-4">
        <h2 className="mb-4 text-center">Sell an Item</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Item Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              required
              onChange={handleChange}
              placeholder="e.g. Sony WH-1000XM4"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              required
              onChange={handleChange}
              placeholder="Describe the condition and features..."
            />
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Starting Price (₹)</Form.Label>
                <Form.Control
                  type="number"
                  name="base_price"
                  required
                  onChange={handleChange}
                  placeholder="1000"
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Condition</Form.Label>
                <Form.Select name="condition" onChange={handleChange}>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select name="category" onChange={handleChange}>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home</option>
                  <option value="vehicles">Vehicles</option>
                  <option value="toys">Toys</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-4">
            <Form.Label>Auction End Date</Form.Label>
            <Form.Control
              type="datetime-local"
              name="end_date"
              required
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              When does the bidding stop?
            </Form.Text>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2"
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "List Item for Sale"
            )}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default CreateAuction;

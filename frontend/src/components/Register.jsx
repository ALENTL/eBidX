import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useGoogleLogin } from "@react-oauth/google";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.password_confirm) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", formData);
      setSuccess("Registration successful! Redirecting to Login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data.password) {
        setError(err.response.data.password[0]);
      } else if (err.response && err.response.data.username) {
        setError("Username is already taken.");
      } else {
        setError("Registration failed.");
      }
    }
  };

  const googleRegister = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        const res = await axios.post("http://127.0.0.1:8000/api/auth/google/", {
          code: codeResponse.code,
          process: "register",
        });

        localStorage.setItem("token", res.data.key);
        localStorage.setItem("user_id", res.data.user);

        if (res.data.username) {
          localStorage.setItem("username", res.data.username);
        }

        navigate("/");
      } catch (err) {
        console.error("Google Register Error:", err);
        setError(
          "Registration Failed. " +
            (err.response?.data?.non_field_errors?.[0] || ""),
        );
      }
    },
    onError: () => setError("Google Registration Failed"),
  });

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <Card className="shadow p-4">
        <h2 className="text-center mb-4">Create Account</h2>

        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {!success && (
          <>
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password_confirm"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button variant="success" type="submit" className="w-100">
                Register
              </Button>
            </Form>

            <div className="d-flex align-items-center my-4">
              <hr className="flex-grow-1" />
              <span className="mx-2 text-muted small">OR</span>
              <hr className="flex-grow-1" />
            </div>

            <div className="d-flex justify-content-center mb-3">
              <Button
                variant="light"
                className="w-100 border d-flex align-items-center justify-content-center gap-2"
                onClick={() => googleRegister()}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  alt="Google"
                  style={{ width: "20px" }}
                />
                Register with Google
              </Button>
            </div>
          </>
        )}

        <div className="mt-3 text-center">
          <small>
            Already have an account? <Link to="/login">Login here</Link>
          </small>
        </div>
      </Card>
    </Container>
  );
};

export default Register;

import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        username: username,
        password: password,
      });

      const token = res.data.key || res.data.token;
      const userId = res.data.user_id || res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user_id", userId);

      if (res.data.username || username) {
        localStorage.setItem("username", res.data.username || username);
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        const res = await axios.post("http://127.0.0.1:8000/api/auth/google/", {
          code: codeResponse.code,
        });

        const token = res.data.key;
        const userId = res.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("user_id", userId);

        if (res.data.username) {
          localStorage.setItem("username", res.data.username);
        }

        navigate("/");
      } catch (err) {
        console.error("Google Login Backend Error", err);
        if (err.response && err.response.status === 400) {
          setError("Account not found. Please Register first.");
        } else {
          setError("Google Login failed. Please try again.");
        }
      }
    },
    onError: () => setError("Google Login Failed"),
  });

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "400px" }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Sign In</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleManualLogin}>
            <Form.Group id="username" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group id="password" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button className="w-100" type="submit">
              Login
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
              onClick={() => googleLogin()}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google"
                style={{ width: "20px" }}
              />
              Sign in with Google
            </Button>
          </div>

          <div className="w-100 text-center mt-3">
            <small>
              Don't have an account? <Link to="/register">Register here</Link>
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;

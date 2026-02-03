import { useEffect, useState } from "react";
import { Navbar, Container, Nav, Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const NavBar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/notifications/", {
        headers: { Authorization: `Token ${token}` },
      });
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.is_read).length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();

      const token = localStorage.getItem("token");
      const socket = new WebSocket(
        `ws://127.0.0.1:8000/ws/notifications/?token=${token}`,
      );

      socket.onopen = () => {
        console.log("Notification Socket Connected");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        const newNotif = {
          id: Date.now(),
          message: data.message,
          link: data.link,
          is_read: false,
          created_at: new Date().toISOString(),
        };

        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      };

      return () => {
        socket.close();
      };
    }
  }, [isAuthenticated]);

  const handleDeleteNotification = async (e, id) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    const notifToDelete = notifications.find((n) => n.id === id);
    if (notifToDelete && !notifToDelete.is_read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    if (id && id > 1000000000000 === false) {
      try {
        await axios.delete(
          `http://127.0.0.1:8000/api/notifications/${id}/delete/`,
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleClearAll = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    setNotifications([]);
    setUnreadCount(0);

    try {
      await axios.delete(`http://127.0.0.1:8000/api/notifications/clear-all/`, {
        headers: { Authorization: `Token ${token}` },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notif) => {
    const token = localStorage.getItem("token");

    if (!notif.is_read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n)),
      );
    }

    if (notif.id && notif.id > 1000000000000 === false) {
      try {
        await axios.post(
          `http://127.0.0.1:8000/api/notifications/${notif.id}/read/`,
          {},
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
      } catch (err) {
        console.error(err);
      }
    }

    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          eBidX
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/">
              Auctions
            </Nav.Link>

            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/create">
                  Sell Item
                </Nav.Link>
                <Nav.Link as={Link} to="/watchlist">
                  Watchlisted
                </Nav.Link>

                <Dropdown align="end" className="mx-2">
                  <Dropdown.Toggle
                    variant="link"
                    id="dropdown-basic"
                    className="position-relative text-light text-decoration-none border-0 p-2"
                  >
                    <span style={{ fontSize: "1.2rem" }}>🔔</span>
                    {unreadCount > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: "0.6rem" }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    style={{
                      minWidth: "320px",
                      maxHeight: "400px",
                      overflowY: "auto",
                    }}
                  >
                    <Dropdown.Header className="d-flex justify-content-between align-items-center">
                      <span>Notifications</span>
                      {notifications.length > 0 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="text-decoration-none p-0"
                          style={{ fontSize: "0.8rem" }}
                          onClick={handleClearAll}
                        >
                          Clear All
                        </Button>
                      )}
                    </Dropdown.Header>

                    {notifications.length === 0 ? (
                      <Dropdown.Item className="text-muted text-center">
                        No new notifications
                      </Dropdown.Item>
                    ) : (
                      notifications.map((notif, idx) => (
                        <Dropdown.Item
                          key={idx}
                          onClick={() => handleNotificationClick(notif)}
                          className="d-flex justify-content-between align-items-center"
                          style={{
                            backgroundColor: notif.is_read
                              ? "white"
                              : "#f0f8ff",
                            borderBottom: "1px solid #eee",
                            whiteSpace: "normal",
                          }}
                        >
                          <div style={{ marginRight: "10px" }}>
                            <small>{notif.message}</small>
                          </div>
                          <Button
                            variant="link"
                            className="text-danger p-0 text-decoration-none"
                            style={{ fontSize: "1.2rem", lineHeight: "1" }}
                            onClick={(e) =>
                              handleDeleteNotification(e, notif.id)
                            }
                          >
                            &times;
                          </Button>
                        </Dropdown.Item>
                      ))
                    )}
                  </Dropdown.Menu>
                </Dropdown>

                <Button
                  variant="outline-light"
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

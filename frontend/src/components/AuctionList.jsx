import { useEffect, useState } from "react";
import axios from "axios";

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    // This connects to your Django API
    axios
      .get("http://127.0.0.1:8000/api/auctions/")
      .then((response) => {
        setAuctions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Live Auctions</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {auctions.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            )}
            <h3>{item.title}</h3>
            <p style={{ color: "#555" }}>{item.description}</p>
            <p>
              <strong>Price:</strong> ₹{item.base_price}
            </p>
            <p>
              <strong>Seller:</strong> {item.seller}
            </p>
            <button
              style={{
                background: "blue",
                color: "white",
                border: "none",
                padding: "10px",
                width: "100%",
                cursor: "pointer",
              }}
            >
              Bid Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuctionList;

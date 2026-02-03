import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { Button, Alert, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ auctionId, price }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchSecret = async () => {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/create-payment-intent/",
        {
          auction_id: auctionId,
        },
      );
      setClientSecret(res.data.clientSecret);
    };
    fetchSecret();
  }, [auctionId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        navigate("/payment-success");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-3 border rounded mb-3 bg-white">
        <CardElement options={{ style: { base: { fontSize: "18px" } } }} />
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button
        variant="primary"
        size="lg"
        type="submit"
        className="w-100"
        disabled={!stripe || processing || !clientSecret}
      >
        {processing ? <Spinner size="sm" /> : `Pay ₹${price}`}
      </Button>
    </form>
  );
};

const StripePayment = ({ auctionId, price }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm auctionId={auctionId} price={price} />
  </Elements>
);

export default StripePayment;

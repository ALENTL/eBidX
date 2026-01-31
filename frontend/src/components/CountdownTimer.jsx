import { useState, useEffect } from "react";

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    if (!targetDate) return {};

    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && interval !== "seconds") return;

    timerComponents.push(
      <span key={interval} className="mx-1">
        <span className="fw-bold fs-4">{timeLeft[interval]}</span>
        <span className="small text-uppercase">{interval}</span>
      </span>,
    );
  });

  return (
    <div className="text-center p-3 mb-4 bg-dark text-white rounded">
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span className="text-danger fw-bold">Auction Ended</span>
      )}
    </div>
  );
};

export default CountdownTimer;

import React, { useState, useEffect } from "react";
import { firestore } from "../../configs/firebase.config";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const CountdownTimer = () => {
  const [countdown, setCountdown] = useState(500); // Initial countdown value

  useEffect(() => {
    const countdownRef = doc(firestore, "countdown", "timer");

    const fetchData = onSnapshot(countdownRef, async (doc) => {
      if (doc.exists()) {
        const f = async () => {
          const data = await doc.data();

          // Calculate the remaining time based on the server time and countdown duration
          const currentTime = parseInt(Math.floor(Date.now()) / 1000); // Current time in seconds
          const timeElapsed = parseInt(currentTime - data?.startAt?.seconds); // Time elapsed since the start
          const remainingTime = parseInt(data?.seconds - timeElapsed); // Remaining time

          console.log({
            currentTime,
            timeElapsed,
            remainingTime,
            // timeDatabase: data.startAt.seconds,
            now: Date.now(),
          });

          setCountdown(remainingTime >= 0 ? remainingTime : 0); // Update the countdown
        };

        await f();
      }
    });

    return () => fetchData(); // Cleanup the listener
  }, []);

  const click = async () => {
    try {
      const countdownRef = doc(firestore, "countdown", "timer");

      await setDoc(countdownRef, {
        startAt: serverTimestamp(),
        seconds: 500,
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>Countdown: {countdown} seconds</h1>
      {/* Additional UI or game components */}
      <button onClick={click}>Click</button>
    </div>
  );
};

export default CountdownTimer;

"use client"
import { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface Booking {
  id: number;
  user_name: string;
  email: string;
  phone: string;
  space: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  created_at: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized. Please login first.");

        const res = await fetch("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Unauthorized. Please login first.");

        const data = await res.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <h1>Bookings</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            {b.user_name} | {b.email} | {b.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { AddBooking } from "../api/booking/bookingApi";
import { useForm } from "react-hook-form";

const BookingBox = ({ place }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState();
  const { user } = useUser();

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);
  let numberOFnights = 0;
  if (checkIn && checkOut) {
    numberOFnights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  function bookThisPlace() {
    const data = {
      checkIn,
      checkOut,
      maxGuests: guests,
      name,
      phone,
      place: place._id,
      price: numberOFnights * place.price,
    };

    AddBooking(data)
      .then((res) => {
        console.log(res.data);
        toast.success("Booking successful");
        navigate("/account/bookings");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="bg-white shadow p-4 px-6 rounded-2xl">
      <p className="text-2xl font-semibold mb-2">
        Price: ${place.price} / per night
      </p>
      <div className="border rounded-2xl mt-4">
        <div className="flex flex-wrap">
          <div className="py-3 px-4">
            <label htmlFor="check-in">Check-in</label>
            <input
              type="date"
              id="check-in"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div className="py-3 px-4 border-l border-t grow">
            <label htmlFor="check-out">Check-out</label>
            <input
              type="date"
              id="check-out"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label htmlFor="guests">Number of guests</label>
          <input
            type="number"
            id="guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </div>
        {numberOFnights > 0 && (
          <div className="py-3 px-4 border-t">
            <label htmlFor="name">Your full name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="name">Phone Number:</label>
            <input
              type="tel"
              id="name"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        )}
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Book Now
        {numberOFnights > 0 && <span> ${numberOFnights * place.price}</span>}
      </button>
    </div>
  );
};

export default BookingBox;

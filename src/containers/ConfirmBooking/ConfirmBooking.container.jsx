import React, { useState, useEffect } from "react";
import ConfirmBookingComponent from "../../components/ConfirmBooking/ConfirmBooking.component";
import {
  getBookingById,
  confirmBooking,
} from "../../services/teeth-apis/BookingController";
import { useParams } from "react-router-dom";
import { notification } from "antd";

const ConfirmBookingContainer = () => {
  const { bookingId } = useParams();
  const [bookingData, setBookingData] = useState();

  const fetchBookingData = async () => {
    try {
      const { data } = await getBookingById(bookingId);
      setBookingData(data);
    } catch (e) {
      notification["error"]({
        message: `Something went wrong! Try again latter!`,
        description: `There is problem while fetching booking data, try again later`,
        duration: 2,
      });
    }
  };

  const rejectUpdate = async () => {
    try {
      await confirmBooking({
        bookingId,
        version: 0,
      });
    } catch (e) {
      notification["error"]({
        message: `Something went wrong! Try again latter!`,
        description: `There is problem while reject, try again later`,
        duration: 2,
      });
    }
  };

  const confirmUpdate = async () => {
    try {
      await confirmBooking({
        bookingId,
        version: bookingData.version,
      });
    } catch (e) {
      notification["error"]({
        message: `Something went wrong! Try again latter!`,
        description: `There is problem while confirm, try again later`,
        duration: 2,
      });
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, [bookingId]);

  return (
    <div>
      <ConfirmBookingComponent
        bookingData={bookingData}
        rejectUpdate={rejectUpdate}
        confirmUpdate={confirmUpdate}
      />
    </div>
  );
};

export default ConfirmBookingContainer;

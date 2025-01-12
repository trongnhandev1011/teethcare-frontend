import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, generatePath } from "react-router-dom";
import { notification, Typography } from "antd";
import BookingCardComponent from "../../components/BookingCard/BookingCard.component";
import { getAllBooking } from "../../services/teeth-apis/BookingController";
import BookingStatusConstants from "../../constants/BookingStatusConstants";
import BookingDetailModalContainer from "../BookingDetailModal/BookingDetailModal.container";
import RoutePath from "../../routers/Path";

const DentistDashBoardContainer = () => {
  const history = useHistory();

  const [bookingData, setBookingData] = useState();
  const [neededBooking, setNeededBooking] = useState(null);

  const dentistId = useSelector((state) => state?.authentication?.user?.id);

  const fullName = useSelector(
    (state) =>
      state?.authentication?.user?.firstName +
      " " +
      state?.authentication?.user?.lastName
  );

  const startTreatmentHandler = (bookingId) => {
    history.push(
      generatePath(RoutePath.EXAMINATION_PAGE, {
        bookingId: bookingId,
      })
    );
  };

  const fetchData = async (options) => {
    try {
      let data;
      if (!options) {
        data = (
          await getAllBooking({
            dentistId: dentistId,
            status: BookingStatusConstants.TREATMENT,
            isConfirmed: false,
          })
        ).data;
      } else {
        data = (
          await getAllBooking({
            ...options,
            dentistId: dentistId,
            status: BookingStatusConstants.TREATMENT,
            isConfirmed: false,
          })
        ).data;
      }

      const mapperData = data?.content?.map((booking) => ({
        ...booking,
        onClick: () => {
          setNeededBooking(booking?.id);
        },
        startTreatment: () => startTreatmentHandler(booking?.id),
      }));
      setBookingData(mapperData);
    } catch (e) {
      notification["error"]({
        message: `Something went wrong! Try again latter!`,
        description: `There is problem while fetching booking data, try again later`,
        duration: 2,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Typography.Title level={1}>Welcome back, {fullName}</Typography.Title>
      <Typography level={5}>
        Here is some important information for you
      </Typography>
      <div style={{ marginTop: "30px" }}>
        <Typography.Title level={4}>In-coming examination:</Typography.Title>
        <div>
          <BookingDetailModalContainer
            bookingId={neededBooking}
            setNeededBooking={setNeededBooking}
          />
          <BookingCardComponent booking={bookingData} />
        </div>
      </div>
    </div>
  );
};

export default DentistDashBoardContainer;

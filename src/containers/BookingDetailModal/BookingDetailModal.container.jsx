import {
  Button,
  Form,
  Modal,
  notification,
  Rate,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BookingDetailModalComponent from "../../components/BookingDetailModal/BookingDetailModal.component";
import UpdateBookingDetailModalContentContainer from "../UpdateBookingDetailModalContent/UpdateBookingDetailModalContent.container";
import BookingDetailModalContentComponent from "../../components/BookingDetailModalContent/BookingDetailModalContent.component";
import BookingStatusConstants from "../../constants/BookingStatusConstants";
import { RoleConstant } from "../../constants/RoleConstants";
import QRCode from "react-qr-code";
import {
  evaluateBooking,
  getBookingById,
  checkIn,
  checkOut,
} from "../../services/teeth-apis/BookingController";
import { generatePath } from "react-router-dom";
import RoutePath from "../../routers/Path";
import { giveFeedBack } from "../../services/teeth-apis/FeedbackController";
import TextArea from "antd/lib/input/TextArea";

const BookingDetailModalContainer = ({ bookingId, setNeededBooking }) => {
  const [bookingData, setBookingData] = useState();
  const [isUpdated, setIsUpdated] = useState(false);

  const [isRendered, setIsRendered] = useState(false);

  const role = useSelector((state) => state?.authentication?.user?.roleName);

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

  const handleOk = () => {
    setNeededBooking(null);
  };

  const handleCancel = () => {
    setNeededBooking(null);
    setIsUpdated(false);
  };

  const updateClickHandler = (e) => {
    setIsUpdated((isUpdated) => !isUpdated);
  };

  useEffect(() => {
    bookingId && fetchBookingData();
  }, [bookingId, isRendered]);

  const handleAssign = async (isAccepted) => {
    try {
      await evaluateBooking(bookingId, isAccepted);
      await fetchBookingData();
    } catch (e) {
      notification["error"]({
        message: `Something went wrong! Try again latter!`,
        description: `There is problem while fetching assigning, try again later`,
        duration: 2,
      });
    }
  };

  const checkInHandler = async () => {
    try {
      await checkIn(bookingId);
    } catch (e) {
      notification["error"]({
        message: `Something went wrong! Try again latter!`,
        description: `There is problem while check in, try again later`,
        duration: 2,
      });
    }
  };

  const checkOutHandler = async () => {
    try {
      await checkOut(bookingId);
    } catch (e) {
      notification["error"]({
        message: `Something went wrong! Try again latter!`,
        description: `There is problem while check out, try again later`,
      });
    }
  };
  const handleGiveFeedback = (bookingId) => {
    try {
      Modal.info({
        closable: true,
        okButtonProps: { style: { display: "none" } },
        title: "Give your feedback",
        content: (
          <>
            <Form
              onFinish={async (values) => {
                try {
                  await giveFeedBack(
                    bookingId,
                    values.detail,
                    values.ratingScore
                  );
                  Modal.destroyAll();
                  await fetchBookingData();
                } catch (e) {
                  notification["error"]({
                    message: `Something went wrong! Try again latter!`,
                    description: `There is problem while giving feedback, try again later`,
                    duration: 2,
                  });
                }
              }}
            >
              <Form.Item name="ratingScore" label="Rate">
                <Rate />
              </Form.Item>
              <Form.Item name="detail" label="Description">
                <TextArea />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Send!
                </Button>
              </Form.Item>
            </Form>
          </>
        ),
      });
    } catch (e) {
      notification["error"]({
        message: `Something went wrong! Try again latter!`,
        description: `There is problem while giving feedback, try again later`,
        duration: 2,
      });
    }
  };

  return (
    <Modal
      destroyOnClose
      visible={bookingId !== null}
      onOk={handleOk}
      onCancel={handleCancel}
      width="80vw"
      footer={false}
    >
      <BookingDetailModalComponent
        bookingData={bookingData}
        role={role}
        checkInHandler={checkInHandler}
        isUpdated={isUpdated}
        updateClickHandler={updateClickHandler}
        setIsUpdated={setIsUpdated}
      />
      {role === RoleConstant.CUSTOMER_SERVICE &&
      bookingData?.status === BookingStatusConstants.REQUEST &&
      isUpdated ? (
        <UpdateBookingDetailModalContentContainer
          bookingData={bookingData}
          setIsUpdated={setIsUpdated}
          setIsRendered={setIsRendered}
          isRendered={isRendered}
        />
      ) : (
        <BookingDetailModalContentComponent
          bookingData={bookingData}
          checkInHandler={checkInHandler}
          role={role}
          setIsRendered={setIsRendered}
          isRendered={isRendered}
        />
      )}
      {bookingId && role === RoleConstant.PATIENT ? (
        <>
          <div style={{ background: "white", padding: "16px" }}>
            <QRCode
              value={`${window.location.origin}${generatePath(
                RoutePath.TRIGGER_QR_CODE_NOTIFICATION_PAGE,
                { bookingId: bookingId }
              )}`}
            />
          </div>
          <Space>
            <Typography>Give your feedback for this clinic!!</Typography>
            <Button
              type="primary"
              onClick={() => {
                handleGiveFeedback(bookingId);
              }}
            >
              Give feedback
            </Button>
          </Space>
        </>
      ) : null}
      {bookingData?.status === BookingStatusConstants.PENDING &&
      role === RoleConstant.CUSTOMER_SERVICE ? (
        <Space>
          <Button onClick={() => handleAssign(true)}>
            Process this booking
          </Button>
          <Button onClick={() => handleAssign(false)}>Reject</Button>
        </Space>
      ) : null}
      {bookingData?.confirmed ? (
        <Button onClick={() => checkOutHandler()}>Checkout</Button>
      ) : null}
    </Modal>
  );
};

export default BookingDetailModalContainer;

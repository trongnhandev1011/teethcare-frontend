import React from "react";
import { Avatar, Descriptions, List, Typography } from "antd";
import { ContainerOutlined } from "@ant-design/icons";

import DescriptionsItem from "antd/lib/descriptions/Item";
import { convertMillisecondsToDate } from "../../utils/convert.utils";

const BookingDetailModalContentComponent = ({ bookingData }) => {
  let examinationTime = bookingData?.examinationTime
    ? convertMillisecondsToDate(bookingData?.examinationTime)
    : convertMillisecondsToDate(bookingData?.createBookingDate);
  return (
    <>
      <Descriptions title="Staff Incharge">
        <DescriptionsItem label="Customer service">
          {bookingData?.customerService
            ? bookingData?.customerService?.firstName +
              " " +
              bookingData?.customerService?.lastName
            : "Not available"}
        </DescriptionsItem>
      </Descriptions>
      <div>
        Current Dentist: {`${" "}`}
        <span>
          {bookingData?.dentist ? (
            <span>
              {bookingData?.dentist?.firstName +
                " " +
                bookingData?.dentist?.lastName +
                " - " +
                bookingData?.dentist?.specialization}
            </span>
          ) : (
            <span>Not assigned</span>
          )}
        </span>
      </div>
      <Descriptions title="Booking Info">
        <DescriptionsItem label="Description">
          {bookingData?.description}
        </DescriptionsItem>
      </Descriptions>
      <div>
        Current Examination Time: {`${" "}`}
        <span>{examinationTime}</span>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={bookingData?.services ? bookingData?.services : []}
        renderItem={(service) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<ContainerOutlined />} size={32} />}
              title={
                <Typography.Title
                  level={5}
                >{`Service name: ${service.name}`}</Typography.Title>
              }
              description={`Description: ${service.description}`}
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default BookingDetailModalContentComponent;

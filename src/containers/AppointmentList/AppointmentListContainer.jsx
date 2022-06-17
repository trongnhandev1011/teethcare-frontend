import React, { useEffect, useState } from "react";
import { Input, Form, Row, Col, notification, Button, Pagination } from "antd";
import { useForm } from "antd/lib/form/Form";
import { getAllAppointments } from "../../services/teeth-apis/AppointmentController";
import AppointmentStatusConstants from "../../constants/AppointmentStatusConstants";
import AppointmentListComponent from "../../components/AppointmentList/AppointmentList.component";
import AppointmentDetailModalContainer from "../AppointmentDetailModal/AppointmentDetailModal.container";

const AppointmentListContainer = () => {
  const [searchValue, setSearchValue] = useState({
    appointmentId: "",
    clinicName: "",
  });
  const [appointmentListData, setAppointmentListData] = useState([]);
  const [form] = useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [neededAppointment, setNeededAppointment] = useState(null);
  const pageSize = 6;

  const fetchData = async (options) => {
    try {
      let data;
      if (!options) {
        data = (await getAllAppointments({})).data;
      } else {
        data = (await getAllAppointments({ ...options })).data;
      }

      const mapperData = data?.content?.map((appointment) => ({
        ...appointment,
        onClick: () => {
          setNeededAppointment(appointment?.id);
        },
      }));

      setAppointmentListData(mapperData);
      setTotalElements(data.totalElements);
    } catch (e) {
      notification["error"]({
        message: `Something went wrong! Try again latter!`,
        description: `There is problem while fetching booking data, try again later`,
        duration: 2,
      });
    }
  };

  const onFinish = (values) => {
    setSearchValue({
      appointmentId: values.appointmentId,
      clinicName: values.clinicName,
    });
  };

  const resetAction = () => {
    form.setFieldsValue({
      appointmentId: "",
      clinicName: "",
    });
    setSearchValue({
      appointmentId: "",
      clinicName: "",
    });
  };

  useEffect(() => {
    fetchData({ size: pageSize, ...searchValue });
    setCurrentPage(1);
  }, [searchValue]);

  useEffect(() => {
    if (!neededAppointment) {
      fetchData({ size: pageSize, page: currentPage - 1, ...searchValue });
    }
  }, [neededAppointment]);

  useEffect(() => {
    fetchData({ size: pageSize, page: currentPage - 1, ...searchValue });
  }, [currentPage]);

  return (
    <>
      <SearchForm form={form} onFinish={onFinish} resetAction={resetAction} />
      <AppointmentDetailModalContainer
        appointmentId={neededAppointment}
        setNeededAppointment={setNeededAppointment}
      />
      <AppointmentListComponent appointmentListData={appointmentListData} />
      <div style={{ marginTop: "1rem" }}>
        <Pagination
          total={totalElements}
          current={currentPage}
          pageSize={pageSize}
          onChange={(page) => {
            setCurrentPage(page);
          }}
        />
      </div>
    </>
  );
};

const SearchForm = ({ resetAction, ...antdProps }) => {
  return (
    <Form layout="vertical" {...antdProps}>
      <Row gutter={[16, 16]} align="bottom">
        <Col span={7}>
          <Form.Item name="appointmentId" label="Search appointment Id">
            <Input placeholder="Search by appointment Id" />
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item name="clinicName" label="Search clinic name">
            <Input placeholder="Search by Clinic name" />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Col>
        <Col span={3}>
          <Form.Item>
            <Button onClick={resetAction}>Reset</Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default AppointmentListContainer;
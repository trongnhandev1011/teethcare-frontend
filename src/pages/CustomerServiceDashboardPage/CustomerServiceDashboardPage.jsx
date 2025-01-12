import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout.component";
import {
  elementList,
  navigationList,
} from "./CustomerServiceDashboardPage.tabs";
import { useParams } from "react-router-dom";

const CustomerServiceDashboardPage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const { tab } = useParams();

  useEffect(() => {
    tab && setCurrentTab(Number(tab));
  }, []);

  return (
    <>
      <div style={{ padding: "1rem 0" }}>
        <h1>Customer service Dashboard</h1>
      </div>
      <DashboardLayout
        navigationList={navigationList.map((item, index) => ({
          ...item,
          onClick: () => setCurrentTab(index),
        }))}
        elementList={elementList}
        currentTab={currentTab}
      />
    </>
  );
};

export default CustomerServiceDashboardPage;

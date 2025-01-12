import {
  Avatar,
  Badge,
  Button,
  Divider,
  Dropdown,
  List,
  Menu,
  Skeleton,
  Space,
  Typography,
} from "antd";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BellOutlined } from "@ant-design/icons";

const NotificationComponent = ({
  notificationList,
  loadMoreData,
  totalElements,
  totalMarkAsUnread,
  markAllAsReadAction,
}) => {
  return (
    <div>
      <Dropdown
        overlayStyle={{ height: "100px" }}
        overlay={
          <>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="link" onClick={markAllAsReadAction}>
                Mark all as read
              </Button>
            </div>
            <InfiniteScroll
              style={{
                zIndex: 10000,
                background: "#FFFFFF",
                width: "500px",
                height: "300px",
              }}
              dataLength={notificationList?.length}
              next={loadMoreData}
              hasMore={
                (totalElements ? totalElements : 0) > notificationList?.length
              }
              loader={
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button type="link" onClick={loadMoreData}>
                    Load more
                  </Button>
                </div>
              }
              endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
              scrollableTarget="scrollableDiv"
            >
              <List
                dataSource={notificationList}
                renderItem={(item) => (
                  <List.Item key={item.id}>
                    <List.Item.Meta
                      title={<Typography>{item.tile}</Typography>}
                      description={item.body}
                    />
                    <Button
                      type="link"
                      disabled={item.isMarkedAsRead}
                      onClick={item.markAsReadAction}
                    >
                      Mark as read
                    </Button>
                  </List.Item>
                )}
              />
            </InfiniteScroll>
          </>
        }
      >
        <Badge
          count={totalMarkAsUnread}
          showZero
          onClick={(e) => e.preventDefault()}
        >
          <BellOutlined />
        </Badge>
      </Dropdown>
    </div>
  );
};

export default NotificationComponent;

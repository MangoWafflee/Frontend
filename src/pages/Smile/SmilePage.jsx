import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./SmilePage.scss";

import { Calendar, Modal } from "antd";

export default function SmilePage() {
  const { nickname } = useParams();

  const getListData = (value) => {
    let listData = []; // Specify the type of listData
    switch (value.date()) {
      case 8:
        listData = [
          {
            content: "😊",
          },
        ];
        break;
      case 10:
        listData = [
          {
            content: "😊",
          },
          {
            content: "😆",
          },
          {
            content: "😂",
          },
        ];
        break;
      case 15:
        listData = [
          {
            content: "😊",
          },
          {
            content: "😆",
          },
          {
            content: "😂",
          },
          {
            content: "🤣",
          },
          {
            content: "😅",
          },
          {
            content: "😄",
          },
        ];
        break;
      default:
    }
    return listData || [];
  };

  const getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
  };

  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <p>{item.content}</p>
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 여부
  const [selectedDate, setSelectedDate] = useState(null);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const cellClickHandler = (value) => {
    setSelectedDate(value);
    setIsModalOpen(true);
  };

  return (
    <div className="smile-page">
      <div className="smile-page-text">
        <h2>이번 달 30번 웃으셨네요!</h2>
        <h3>오늘은 2번 웃었어요!</h3>
        <p>연구결과에 따르면 성인은 하루평균 15~30회 웃는다고 해요.</p>
      </div>
      <div className="smile-page-calendar">
        <Calendar
          //   fullscreen={false}
          cellRender={cellRender}
          onSelect={cellClickHandler}
        />
      </div>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        width={300}
        footer={null}
        style={{ body: { padding: 0, margin: 0 } }}
      >
        <p>
          {selectedDate
            ? `${selectedDate.format("YYYY-MM-DD")}의 웃음 상세 내용`
            : "웃음 상세 내용"}
        </p>
      </Modal>
    </div>
  );
}

import { Calendar, Modal } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SmilePage.scss";

export default function SmilePage() {
  const { nickname } = useParams();
  const [smileData, setSmileData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); //YYYY-MM-DD
  const [selectedDayData, setSelectedDayData] = useState([]);

  const currentDateTime = dayjs();
  const year = currentDateTime.year();
  const month = currentDateTime.month() + 1; // 월은 0부터 시작하므로 1을 더합니다.
  const today = currentDateTime.format("YYYY-MM-DD");
  const [monthSmileCount, setMonthSmileCount] = useState(0);
  const [todaySmileCount, setTodaySmileCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const encodedNickname = encodeURIComponent(nickname);
      const url = `https://mango.angrak.cloud/smile/user/${encodedNickname}`; // URL 확인

      console.log("Encoded URL:", url); // URL 확인

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setSmileData(data);
          smileCount(data);
        } else if (response.status === 404) {
          console.log("검색 결과가 없습니다.");
        } else {
          console.log("서버 오류");
        }
      } catch (error) {
        console.error("데이터 요청 오류:", error);
      }
    };

    fetchData();
  }, [nickname]);

  const smileCount = (data) => {
    const monthDataCount = data.filter((item) => {
      const itemDate = dayjs(item.date);
      return itemDate.year() === year && itemDate.month() + 1 === month;
    }).length;

    const todayDataCount = data.filter((item) => item.date === today).length;

    setMonthSmileCount(monthDataCount);
    setTodaySmileCount(todayDataCount);
  };

  const getListData = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
    const listData = smileData.filter((item) => item.date === dateStr);
    return listData.map((item, index) => ({
      content: `😊`,
      key: index,
    }));
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.key}>
            <p>{item.content}</p>
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const cellClickHandler = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
    const dayData = smileData.filter((item) => item.date === dateStr);
    setSelectedDayData(dayData);
    setSelectedDate(value);
    setIsModalOpen(true);
  };

  return (
    <div className="smile-page">
      <div className="smile-page-text">
        <h2>이번 달 {monthSmileCount}번 웃으셨네요!</h2>
        <h3>오늘은 {todaySmileCount}번 웃었어요!</h3>
        <p>연구결과에 따르면 성인은 하루평균 15~30회 웃는다고 해요.</p>
      </div>
      <div className="smile-page-calendar">
        <Calendar cellRender={cellRender} onSelect={cellClickHandler} />
      </div>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        width={300}
        footer={null}
      >
        <h3>
          {selectedDate
            ? `${selectedDate.format("YYYY-MM-DD")}의 웃음 상세 내용`
            : "웃음 상세 내용"}
        </h3>
        <br />
        {selectedDayData.length > 0 ? (
          <ul>
            {selectedDayData.map((item, index) => (
              <li key={index}>
                {/* {`웃음 비율: ${item.smilePercentage}% - 시간: ${item.time}`} */}
                {`${item.time} : 😊${item.smilePercentage}%`}
              </li>
            ))}
          </ul>
        ) : (
          <p>해당 날짜에는 기록이 없습니다.</p>
        )}
      </Modal>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import SearchSmall from "@/components/SearchSmall";
import CardInfo from "@/components/CardInfo";
import AuctionInfo from "@/components/AuctionInfo";

function Page(props) {
  const [info, setInfo] = useState([]);
  const [searchBienso, setSearchBienso] = useState("");
  const [searchTinhThanhPho, setSearchTinhThanhPho] = useState("");
  const [searchLoaiXe, setSearchLoaiXe] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [searchStatusText, setSearchStatusText] = useState("");

  // Trạng thái của các nút lọc
  const [filterButtons, setFilterButtons] = useState({
    all: true,
    0: false,
    1: false,
    2: false,
  });

  const handleGetInfo = async () => {
    try {
      const response = await fetch("http://localhost:5000/Auction/all");
      const data = await response.json();
      setInfo(data);
      console.log(data);
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetInfo();
  }, []);

  const filterData = (item) => {
    return (
      item.bienSo.toLowerCase().includes(searchBienso.toLowerCase()) &&
      item.city.toLowerCase().includes(searchTinhThanhPho.toLowerCase()) &&
      item.type.toLowerCase().includes(searchLoaiXe.toLowerCase()) &&
      (filterState === "all" || item.listingStatus === parseInt(filterState)) &&
      (searchStatusText === "" || item.statusText === searchStatusText)
    );
  };

  // Xử lý khi người dùng nhấp vào một nút lọc
  const handleFilterButtonClick = (state: string) => {
    const updatedButtons = { ...filterButtons };
  
    Object.keys(updatedButtons).forEach((key) => {
      updatedButtons[key] = false;
    });
  
    updatedButtons[state] = true;
  
    setFilterButtons(updatedButtons);
  
    if (state === "0") {
      setSearchStatusText("Chờ đấu giá");
    } else {
      setSearchStatusText("");
    }
  };
  

  return (
    <main className="bg-[#475657] min-h-screen">
    <div>
      {/* Phần thông tin và bộ lọc ở đây */}
      <div className="text-white px-20 border-b-2 border-white  items-center flex justify-between align-middle  py-5">
        <CardInfo value={"357.250.000.000 VND"} name={"Tổng số tiền thu về"} />
        <CardInfo value={260} name={"Biển số đang đấu giá"} />
        <CardInfo value={120} name={"Biển số chờ đấu giá"} />
        <CardInfo value={20} name={"Biển số đã bán"} />
      </div>
      <div className="pb-10 mb-10 border-b-2">
        <SearchSmall
          searchBienso={searchBienso}
          setSearchBienso={setSearchBienso}
          searchTinhThanhPho={searchTinhThanhPho}
          setSearchTinhThanhPho={setSearchTinhThanhPho}
          searchLoaiXe={searchLoaiXe}
          setSearchLoaiXe={setSearchLoaiXe}
          setFilterState={setFilterState}
          handleFilterButtonClick={handleFilterButtonClick}
        />
      </div>
      <div className="grid grid-cols-5 gap-5 p-5">
        {info.filter(filterData).map((i, index) => (
          <AuctionInfo key={index} data={i} />
        ))}
      </div>
    </div>
    </main>
  );
}

export default Page;

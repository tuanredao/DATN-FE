"use client";
import React, { useState, useEffect } from "react";
import SearchSmall from "@/components/SearchSmall";
import CardInfo from "@/components/CardInfo";
import NftInfo from "@/components/NftInfo";

function Page(props) {
  const [info, setInfo] = useState([]);
  const [searchBienso, setSearchBienso] = useState("");
  const [searchTinhThanhPho, setSearchTinhThanhPho] = useState("");
  const [searchLoaiXe, setSearchLoaiXe] = useState("");
  const [filterState, setFilterState] = useState("all");

  // Trạng thái của các nút lọc
  const [filterButtons, setFilterButtons] = useState({
    all: true,
    0: false,
    1: false,
    2: false,
  });

  const handleGetInfo = async () => {
    try {
      const response = await fetch("http://localhost:5000/BienSo/all");
      const data = await response.json();
      setInfo(data);      
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
      item.tinhThanhPho
        .toLowerCase()
        .includes(searchTinhThanhPho.toLowerCase()) &&
      item.loaiXe.toLowerCase().includes(searchLoaiXe.toLowerCase()) &&
      (filterState === "all" || item.trangThai === parseInt(filterState))
    );
  };

  

  // Xử lý khi người dùng nhấp vào một nút lọc
  const handleFilterButtonClick = (state: string) => {
    const updatedButtons = { ...filterButtons };
  
    // Đặt trạng thái cho tất cả các nút lọc là false
    Object.keys(updatedButtons).forEach((key) => {
      updatedButtons[key] = false;
    });
  
    updatedButtons[state] = true;
  
    setFilterButtons(updatedButtons);
    
    setFilterState(state === 'all' ? 'all' : state);
  };
  

  return (
    <main className="bg-[#475657] min-h-screen">
    <div>
      <div className="flex justify-center items-center pt-10 pb-0">
        <p className="text-white text-5xl ">BIỂN SỐ XE ĐƯỢC ĐẤU GIÁ</p>
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
      <div className="grid grid-cols-5 gap-5 p-5 place-items-center">
        {info.filter(filterData).map((i, index) => (
          <NftInfo key={index} data={i} />
        ))}
      </div>
    </div>
    </main>
  );
}

export default Page;

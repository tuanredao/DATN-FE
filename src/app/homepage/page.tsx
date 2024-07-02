"use client";
import React, { useState, useEffect } from "react";
import SearchSmall from "@/components/SearchSmall";
import NftInfo from "@/components/NftInfo";
import Search from "@/components/Search";

function Page(props) {
  const [info, setInfo] = useState([]);
  const [searchBienso, setSearchBienso] = useState("");
  const [searchTinhThanhPho, setSearchTinhThanhPho] = useState("");
  const [searchLoaiXe, setSearchLoaiXe] = useState("");
  const [filterState, setFilterState] = useState("all");

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
      item.bienSo.toLowerCase().includes(searchBienso.trim().toLowerCase()) &&
      item.tinhThanhPho
        .toLowerCase()
        .includes(searchTinhThanhPho.trim().toLowerCase()) &&
      item.loaiXe.toLowerCase().includes(searchLoaiXe.trim().toLowerCase()) &&
      (filterState === "all" || item.trangThai === parseInt(filterState))
    );
  };

  return (
    <main className="bg-[#475657] min-h-screen">
      <div>
        <div
          style={{
            backgroundImage: `url(/images/bghome.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center", 
            backgroundSize: "cover",
            width: "100%", 
            height: "400px",
          }}
          className="border-white border-b-2 flex flex-col items-center justify-center gap-10"
        >
          <div className="flex justify-center items-center pt-10 pb-0">
            <p className="text-white text-7xl font-semibold">BIỂN SỐ XE ĐƯỢC ĐẤU GIÁ</p>
          </div>
          <div className="pb-10 mb-10 ">
            <Search
              searchBienso={searchBienso}
              setSearchBienso={setSearchBienso}
              searchTinhThanhPho={searchTinhThanhPho}
              setSearchTinhThanhPho={setSearchTinhThanhPho}
              searchLoaiXe={searchLoaiXe}
              setSearchLoaiXe={setSearchLoaiXe}
            />
          </div>
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

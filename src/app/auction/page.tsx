"use client";
import React, { useState, useEffect } from "react";
import SearchSmall from "@/components/SearchSmall";
import CardInfo from "@/components/CardInfo";
import AuctionInfo from "@/components/AuctionInfo";
import { Button } from "@/components/ui/button";

function Page(props) {
  const [info, setInfo] = useState([]);
  const [stats, setStats] = useState<any>({});
  const [searchBienso, setSearchBienso] = useState("");
  const [searchTinhThanhPho, setSearchTinhThanhPho] = useState("");
  const [searchLoaiXe, setSearchLoaiXe] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, inProgress, ended

  const handleGetInfo = async () => {
    try {
      const response = await fetch("http://localhost:5000/Auction/all");
      const data = await response.json();
      setInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetInfo();
  }, []);

  const handleGetStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/auction/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetStats();
  }, []);

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
  };

  const filterData = (item) => {
    const bienSoMatch = item.bienSo
      .toLowerCase()
      .includes(searchBienso.toLowerCase());
    const tinhThanhPhoMatch = item.city
      .toLowerCase()
      .includes(searchTinhThanhPho.toLowerCase());
    const loaiXeMatch = item.type
      .toLowerCase()
      .includes(searchLoaiXe.toLowerCase());

    let statusMatch = true;
    if (filterStatus === "pending") {
      statusMatch =
        item.listingStatus === 0 && Date.now() < item.startTime * 1000;
    } else if (filterStatus === "inProgress") {
      statusMatch =
        item.listingStatus === 0 ||
        item.listingStatus === 1 ||
        (item.listingStatus === 0 && Date.now() > item.endTime * 1000);
    } else if (filterStatus === "ended") {
      statusMatch =
        item.listingStatus === 2 ||
        item.listingStatus === 3 ||
        item.listingStatus === 4;
    }

    return bienSoMatch && tinhThanhPhoMatch && loaiXeMatch && statusMatch;
  };

  return (
    <main className="bg-[#475657] min-h-screen">
      <div>
        <div className="text-white px-20 border-b-2 border-white items-center flex justify-between align-middle py-5">
          <CardInfo
            value={stats?.totalSold / 1e18}
            name={"Tổng số tiền thu về"}
          />
          <CardInfo value={stats?.pendingNFT} name={"Biển số đang đấu giá"} />
          <CardInfo value={stats?.notSoldNFT} name={"Biển số chờ đấu giá"} />
          <CardInfo value={stats?.soldNFT} name={"Biển số đã bán"} />
        </div>
        <div className="flex flex-row justify-center items-center p-8 border-b-2">
          <SearchSmall
            searchBienso={searchBienso}
            setSearchBienso={setSearchBienso}
            searchTinhThanhPho={searchTinhThanhPho}
            setSearchTinhThanhPho={setSearchTinhThanhPho}
            searchLoaiXe={searchLoaiXe}
            setSearchLoaiXe={setSearchLoaiXe}
          />
          <div className="flex justify-center gap-4 p-4">
            <Button
              className={`rounded-2xl ${
                filterStatus === "all"
                  ? "bg-white text-[#475657]"
                  : "!bg-[#475657] border-white border"
              }`}
              onClick={() => handleFilterStatus("all")}
            >
              Tất cả
            </Button>
            <Button
              className={`rounded-2xl ${
                filterStatus === "pending"
                  ? "bg-white text-[#475657]"
                  : "!bg-[#475657] border-white border"
              }`}
              onClick={() => handleFilterStatus("pending")}
            >
              Chờ đấu giá
            </Button>
            <Button
              className={`rounded-2xl ${
                filterStatus === "inProgress"
                  ? "bg-white text-[#475657]"
                  : "!bg-[#475657] border-white border"
              }`}
              onClick={() => handleFilterStatus("inProgress")}
            >
              Đang đấu giá
            </Button>
            <Button
              className={`rounded-2xl ${
                filterStatus === "ended"
                  ? "bg-white text-[#475657]"
                  : "!bg-[#475657] border-white border"
              }`}
              onClick={() => handleFilterStatus("ended")}
            >
              Đã kết thúc
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-5 p-5">
          {info.filter(filterData).map((item, index) => (
            <AuctionInfo key={index} data={item} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Page;

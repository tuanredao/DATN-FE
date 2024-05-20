"use client";
import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import SearchSmall from "@/components/SearchSmall";
import CardInfo from "@/components/CardInfo";
import Image from "next/image";
import NftInfo from "@/components/NftInfo";

function Page(props) {
  const { address, isConnected } = useAccount();
  const [info, setInfo] = useState([]);
  const [searchBienso, setSearchBienso] = useState("");
  const [searchTinhThanhPho, setSearchTinhThanhPho] = useState("");
  const [searchLoaiXe, setSearchLoaiXe] = useState("");
  const [filterState, setFilterState] = useState("all");

  const account = useAccount();

  const [formData, setFormData] = useState({
    fullName: "",
  });

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/users/getUser?wallet=${account.address}`
      );
      if (response.ok) {
        const userData = await response.json();
        console.log("found", userData.userData);
        const info = userData.userData;
        console.log("info", info);
        console.log("api", response);

        if (userData) {
          setFormData(info);
        }
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [account.address]);

  // Trạng thái của các nút lọc
  const [filterButtons, setFilterButtons] = useState({
    all: true,
    0: false,
    1: false,
    2: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleGetInfo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/mynft/all?address=${address}`
      );
      const data = await response.json();
      console.log("data", data);

      setInfo(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      handleGetInfo();
    }
  }, [address]);

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
  console.log("123", isLoading);

  const handleFilterButtonClick = (state: string) => {
    const updatedButtons = { ...filterButtons };

    Object.keys(updatedButtons).forEach((key) => {
      updatedButtons[key] = false;
    });

    updatedButtons[state] = true;

    setFilterButtons(updatedButtons);

    setFilterState(state === "all" ? "all" : state);
  };

  return (
    <div>
      <div className="text-white px-5 border-b-2 border-white  items-center flex justify-between align-middle  py-5">
        <div className="flex justify-start items-start flex-col gap-5">
          <div className="items-center text-5xl font-bold">
            {formData?.fullName}
          </div>
          <div className="text-base">{address}</div>
        </div>
        <div className="flex gap-5">
          <CardInfo value={"357.250.000.000 VND"} name={"Tổng giá trị"} />
          <CardInfo value={260} name={"Biển số xe sở hũu"} />
        </div>
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
      {isLoading ? (
        <div className="w-full flex justify-center">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-5 p-8 max-w-[1500px] mx-auto">
          {info.filter(filterData).map((i, index) => (
            <NftInfo key={index} data={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Page;

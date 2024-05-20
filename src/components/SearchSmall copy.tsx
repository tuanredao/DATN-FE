import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchProps {
  searchBienso: string;
  searchLoaiXe: string;
  searchTinhThanhPho: string;
  setSearchBienso: React.Dispatch<React.SetStateAction<string>>;
  setSearchTinhThanhPho: React.Dispatch<React.SetStateAction<string>>;
  setSearchLoaiXe: React.Dispatch<React.SetStateAction<string>>;
  setFilterState: React.Dispatch<React.SetStateAction<string>>;
  handleFilterButtonClick: (state: string) => void;
}

function SearchSmall({
  searchBienso,
  searchLoaiXe,
  searchTinhThanhPho,
  setSearchBienso,
  setSearchTinhThanhPho,
  setSearchLoaiXe,
  setFilterState,
  handleFilterButtonClick,
}: SearchProps) {
  const [activeButton, setActiveButton] = useState(""); // state để lưu trữ trạng thái của nút được nhấn

  const handleButtonClick = (buttonState) => {
    setActiveButton(buttonState); // cập nhật state khi nút được nhấn
    handleFilterButtonClick(buttonState); // gọi hàm xử lý khi nút được nhấn
  };

  return (
    <div>
      <div className="flex gap-4 flex-row justify-center pt-10 px-5 text-white placeholder-color">
        <Input
          type="search"
          placeholder="Biển số cần tìm"
          className="w-[280px] rounded-2xl !bg-[#475657]"
          value={searchBienso}
          onChange={(e) => setSearchBienso(e.target.value)}
        />

<Button
          className={`!bg-[#475657] border border-white rounded-2xl ${
            activeButton === "all" ? "active-button" : ""
          }`}
          onClick={() => handleButtonClick("all")}
        >
          Tất cả
        </Button>

        <Button
          className={`!bg-[#475657] border border-white rounded-2xl ${
            activeButton === "0" ? "active-button" : ""
          }`}
          onClick={() => handleButtonClick("0")}
        >
          Chờ đấu giá
        </Button>

        <Button
          className={`!bg-[#475657] border border-white rounded-2xl ${
            activeButton === "1" ? "active-button" : ""
          }`}
          onClick={() => handleButtonClick("1")}
        >
          Đang diễn ra
        </Button>

        <Button
          className={`!bg-[#475657] border border-white rounded-2xl ${
            activeButton === "2" ? "active-button" : ""
          }`}
          onClick={() => handleButtonClick("2")}
        >
          Đã kết thúc
        </Button>

        <Input
          type="search"
          placeholder="Loại xe"
          className="w-[170px] justify-items-start rounded-2xl !bg-[#475657]"
          value={searchLoaiXe}
          onChange={(e) => setSearchLoaiXe(e.target.value)}
        />

        <Input
          type="search"
          placeholder="Tỉnh/Thành phố"
          className="w-[170px] justify-items-start rounded-2xl !bg-[#475657]"
          value={searchTinhThanhPho}
          onChange={(e) => setSearchTinhThanhPho(e.target.value)}
        />
      </div>
    </div>
  );
}

export default SearchSmall;

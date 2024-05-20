import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Định nghĩa các props cho component Search
interface SearchProps {
  searchBienso: string,
  searchLoaiXe: string,
  searchTinhThanhPho:string,
  setSearchBienso: React.Dispatch<React.SetStateAction<string>>,
  setSearchTinhThanhPho: React.Dispatch<React.SetStateAction<string>>,
  setSearchLoaiXe: React.Dispatch<React.SetStateAction<string>>,
}

function Search({
  searchBienso,
  searchLoaiXe,
  searchTinhThanhPho,
  setSearchBienso,
  setSearchTinhThanhPho,
  setSearchLoaiXe
}: SearchProps) {


  return (
    <div className="flex gap-20 justify-center pt-10">
      <Input
        type="search"
        placeholder="Biển số cần tìm"
        className="w-[280px]"
        value={searchBienso}
        onChange={(e) => {
          setSearchBienso(e.target.value);
        }}
      />
      <Input
        type="search"
        placeholder="Tỉnh/Thành phố"
        className="w-[280px]"
        value={searchTinhThanhPho}
        onChange={(e) => {
          setSearchTinhThanhPho(e.target.value);
        }}
      />
      <Input
        type="search"
        placeholder="Loại xe"
        className="w-[280px]"
        value={searchLoaiXe}
        onChange={(e) => {
          setSearchLoaiXe(e.target.value);
        }}
      />
      
    </div>
  );
}

export default Search;

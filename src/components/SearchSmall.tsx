import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SearchProps {
  searchBienso: string;
  searchLoaiXe: string;
  searchTinhThanhPho: string;
  setSearchBienso: React.Dispatch<React.SetStateAction<string>>;
  setSearchTinhThanhPho: React.Dispatch<React.SetStateAction<string>>;
  setSearchLoaiXe: React.Dispatch<React.SetStateAction<string>>;
}

function SearchSmall({
  searchBienso,
  searchLoaiXe,
  searchTinhThanhPho,
  setSearchBienso,
  setSearchTinhThanhPho,
  setSearchLoaiXe,
}: SearchProps) {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <div className="flex flex-col items-center justify-center px-5 text-white placeholder-color">
      <div className="flex gap-4 flex-row justify-between items-center">
        <Input
          type="search"
          placeholder="Biển số cần tìm"
          className="w-[280px] rounded-2xl !bg-[#475657]"
          value={searchBienso}
          onChange={(e) => setSearchBienso(e.target.value)}
        />

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

        {pathname.includes("myNFT") && (
          <Link href="/myauctionhistory">
            <Button className={`!bg-[#475657] border border-white rounded-2xl`}>
              Lịch sử đấu giá
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default SearchSmall;

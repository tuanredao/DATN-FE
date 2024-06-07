import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

function SearchUser({
  searchTrangThai,
  setSearchTrangThai,
  searchName,
  setSearchName,
}) {
  return (
    <div className="flex space-x-36 p-4">
      <Input
        type="search"
        placeholder="Tên"
        className="w-[170px] justify-items-start rounded-2xl !bg-[#475657] text-white"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      <Select onValueChange={(e) => setSearchTrangThai(e)} defaultValue={searchTrangThai}>
        <SelectTrigger className="w-[170px] justify-items-start rounded-2xl !bg-[#475657] text-white">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Đã KYC</SelectItem>
          <SelectItem value="false">Chưa KYC</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SearchUser;

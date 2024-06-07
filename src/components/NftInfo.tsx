import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function NftInfo({ data }) {
  console.log("data1", data);

  let statusColor = "";
  let statusText = "";

  if (data?.trangThai === "0" || data?.trangThai === 0) {
    statusColor = "bg-gray-400";
    statusText = "Chờ đấu giá";
  } else if (data?.trangThai === "1" || data?.trangThai === 1) {
    statusColor = "bg-[#4A6D7C]";
    statusText = "Đấu giá";
  } else if (data?.trangThai === "2" || data?.trangThai === 2) {
    statusColor = "bg-gray-400";
    statusText = "Không khả dụng";
  }

  return (
    <div className="p-3 flex flex-col gap-5 border border-white w-full max-w-[270px] rounded-xl justify-center items-center">
      <div className="w-full h-[150px] rounded-xl border border-white text-white bg-[#4A6D7C] flex flex-col justify-center items-center text-5xl font-bold gap-2">
        {data?.bienSo && (
          <>
            <div>{data.bienSo.replace(/-/g, "").slice(0, 3)}</div>
            <div>
              {data.bienSo.replace(/-/g, "").slice(3, 6) +
                "." +
                data.bienSo.replace(/-/g, "").slice(6)}
            </div>
          </>
        )}
      </div>

      <div className="text-white flex justify-between px-3 w-full">
        <p>{data?.loaiXe}</p>
        <p>{data?.tinhThanhPho}</p>
      </div>
      <div className="flex justify-center w-full">
        <Button
          className={`rounded-2xl w-[150px] ${
            statusColor === "bg-gray-400"
              ? "text-gray-600 cursor-not-allowed"
              : ""
          }`}
        >
          {statusText}
        </Button>
      </div>
    </div>
  );
}

export default NftInfo;

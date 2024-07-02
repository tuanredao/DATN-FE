import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function AuctionInfo({ data }) {
  let statusColor = "";
  let statusText = "";

  if (data.listingStatus === 0 && Date.now() < data.startTime * 1000) {
    statusColor = "bg-gray-400";
    statusText = "Chờ đấu giá";
  } else if (data.listingStatus === 0) {
    statusColor = "bg-[#4A6D7C]";
    statusText = "Đấu giá";
  } else if (
    data.listingStatus === 1 ||
    (data.listingStatus === 0 && Date.now() > data.endTime * 1000)
  ) {
    statusColor = "bg-[#4A6D7C]";
    statusText = "Chờ trả tiền";
  }else if (
    data.listingStatus === 2
  ) {
    statusColor = "bg-gray-400";
    statusText = "Đã huỷ";
  } else if (
    data.listingStatus === 3
  ) {
    statusColor = "bg-gray-400";
    statusText = "Đấu giá thành công";
  } else {
    statusColor = "bg-gray-400";
    statusText = "Không khả dụng";
  }

  const [remainingTime, setRemainingTime] = useState<number>(
    data.startTime * 1000 - Date.now()
  );
  const [auctionTime, setAuctionTime] = useState<number>(
    data.endTime * 1000 - data.startTime * 1000
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const remaining = data.startTime * 1000 - currentTime;
      const duration = data.endTime * 1000 - currentTime;

      if (remaining > 0) {
        setRemainingTime(remaining);
      } else {
        if (duration > 0) {
          clearInterval(interval);
          setRemainingTime(0);
          setAuctionTime(duration);
        } else {
          setAuctionTime(0);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data.startTime, data.endTime]);

  const formatTime = (time: number): string => {
    const phút = Math.floor((time / (1000 * 60)) % 60);
    const giờ = Math.floor((time / (1000 * 60 * 60)) % 24);
    const ngày = Math.floor(time / (1000 * 60 * 60 * 24));

    return `${ngày} ngày, ${giờ} giờ, ${phút} phút`;
  };

  return (
    <div className="p-3 flex flex-col gap-5 border border-white w-full max-w-[250px] rounded-xl">
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
      <div className="text-white flex justify-between px-3">
        <p>{data?.city}</p>
        <p>{data?.type}</p>
      </div>
      <div className="px-3 flex text-white text-center">
        <div className="w-12 h-10 relative">
          <Image
            className="object-cover"
            fill
            alt="icon"
            src="https://lcdn-hk.icons8.com/c/3_MmXfQppEqXttrb4tCwKw/e501000b7f4a8da508cd7d90e5e45630e251b7ce.png"
          />
        </div>
        <div>
          {remainingTime > 0
            ? formatTime(remainingTime)
            : formatTime(auctionTime)}
        </div>
      </div>
      <div className="flex justify-center w-full">
        <Link href={`/auction/auctionDetail/${data.id}`}>
          <Button
            className={`rounded-2xl w-[150px] ${
              statusColor === "bg-gray-400"
                ? "text-gray-600 cursor-not-allowed"
                : ""
            }`}
          >
            {statusText}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default AuctionInfo;

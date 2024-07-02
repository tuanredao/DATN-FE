import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function NftInfo({ data }) {
  console.log("data1", data);

  const [status, setStatus] = useState<any>(null);
  const [statusColor, setStatusColor] = useState("");
  const [statusText, setStatusText] = useState("");

  const handleGetStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/auction/status`);
      const statusData = await response.json();
      console.log("status", statusData);

      setStatus(statusData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetStatus();
  }, []);

  useEffect(() => {
    if (status) {
      if (status.paid.includes(data.bienSo)) {
        setStatusColor("bg-gray-400");
        setStatusText("Đã bán");
      } else if (status.unsuccess.includes(data.bienSo)) {
        setStatusColor("bg-[#4A6D7C]");
        setStatusText("Đang đấu giá");
      } else {
        setStatusColor("bg-blue-900");
        setStatusText("Chờ đấu giá");
      }
    }
  }, [status, data.bienSo]);

  return (
    <div className="p-3 flex flex-col gap-5 border border-white w-full max-w-[270px] rounded-xl justify-center items-center">
      <div className={`w-full h-[150px] rounded-xl border border-white text-white bg-[#4A6D7C] flex flex-col justify-center items-center text-5xl font-bold gap-2`}>
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
      {statusText === "Đang đấu giá" ? (
          <Link href="/auctions">
            <Button className={`rounded-2xl w-[150px] text-white ${statusColor}  hover:bg-blue-900`}>
              {statusText}
            </Button>
          </Link>
        ) : (
          <Button
            className={`rounded-2xl w-[150px] ${statusColor} ${statusColor === "bg-gray-400" ? "text-gray-600 cursor-not-allowed" : "text-white"}`}
            disabled={statusColor === "bg-gray-400"}
          >
            {statusText}
          </Button>
        )}
      </div>
    </div>
  );
}

export default NftInfo;

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function auctionDetail() {
  const auctionHistoryData = [
    {
      STT: 1,
      thoiGian: "29/05 19:63:45",
      bienSoXe: "30K-222.22",
      trangThai: "Đang đấu giá",
      soTien: "57.500.000",
      txHash: "0x5ab...e1b3",
    },
    {
      STT: 2,
      thoiGian: "30/05 12:30:15",
      bienSoXe: "29A-987.65",
      trangThai: "Kết thúc đấu giá",
      soTien: "72.800.000",
      txHash: "0x7cd...f8a2",
    },
    {
      STT: 3,
      thoiGian: "31/05 08:15:22",
      bienSoXe: "45C-123.45",
      trangThai: "Đang đấu giá",
      soTien: "50.200.000",
      txHash: "0x8ef...d1b7",
    },
    {
      STT: 4,
      thoiGian: "01/06 14:45:37",
      bienSoXe: "51B-789.01",
      trangThai: "Kết thúc đấu giá",
      soTien: "65.300.000",
      txHash: "0x2fg...e9c6",
    },
    {
      STT: 5,
      thoiGian: "02/06 10:10:10",
      bienSoXe: "36F-246.80",
      trangThai: "Đang đấu giá",
      soTien: "60.000.000",
      txHash: "0x4hi...k3d1",
    },
    {
      STT: 6,
      thoiGian: "03/06 16:20:55",
      bienSoXe: "84D-753.09",
      trangThai: "Kết thúc đấu giá",
      soTien: "70.100.000",
      txHash: "0x9lm...u2z8",
    },
    {
      STT: 7,
      thoiGian: "04/06 09:30:18",
      bienSoXe: "79G-369.52",
      trangThai: "Đang đấu giá",
      soTien: "55.800.000",
      txHash: "0x0pq...r7w5",
    },
    {
      STT: 8,
      thoiGian: "05/06 11:55:42",
      bienSoXe: "28E-987.32",
      trangThai: "Kết thúc đấu giá",
      soTien: "68.900.000",
      txHash: "0x3st...h6v9",
    },
    {
      STT: 9,
      thoiGian: "06/06 13:40:29",
      bienSoXe: "49H-135.78",
      trangThai: "Đang đấu giá",
      soTien: "62.700.000",
      txHash: "0x6uv...p5q4",
    },
    {
      STT: 10,
      thoiGian: "07/06 15:15:11",
      bienSoXe: "52K-642.30",
      trangThai: "Kết thúc đấu giá",
      soTien: "75.200.000",
      txHash: "0x1wx...z0e3",
    },
  ];
  const param = useParams();

  const [info, setInfo] = useState<any>(null);
  const [countdown, setCountdown] = useState(null);
  const [duration, setDuration] = useState(null);

  const handleGetInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/auction/find/${param.listingId}`
      );

      const data = await response.json();

      setInfo(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetInfo();
  }, []);

  useEffect(() => {
    if (info && info.listingStatus === 0) {
      const currentTime = Date.now();

      if (currentTime < info.startTime * 1000) {
        // Countdown to start time
        const countdownTimer = setInterval(() => {
          const remaining = info.startTime * 1000 - Date.now();
          if (remaining <= 0) {
            clearInterval(countdownTimer);
          }
          setCountdown(remaining);
        }, 1000);
        return () => clearInterval(countdownTimer);
      } else if (
        currentTime >= info.startTime * 1000 &&
        currentTime < info.endTime * 1000
      ) {
        // Countdown to end time (auction in progress)
        const durationTimer = setInterval(() => {
          const duration = info.endTime * 1000 - Date.now();
          if (duration <= 0) {
            clearInterval(durationTimer);
          }
          setDuration(duration);
        }, 1000);
        return () => clearInterval(durationTimer);
      }
    }
  }, [info]);

  const renderStatus = () => {
    if (!info) return null;

    const currentTime = Date.now();

    if (info.listingStatus === 0) {
      if (currentTime < info.startTime * 1000) {
        return (
          <div className="flex flex-col  items-center justify-between">
            <div className="flex flex-col items-center justify-between">
              <div className="text-3xl mb-4">Đấu giá sẽ mở trong</div>
              <div className="text-5xl font-semibold">
                {" "}
                {formatTime(countdown)}
              </div>
            </div>
            <div className="pt-3">({formatDate(time)})</div>
            <Button className="mt-5 w-[200px] text-xl rounded-xl">
              Đặt cọc
            </Button>
            <div className="mt-1">*Muộn nhất trước 3 ngày</div>
          </div>
        );
      } else if (
        currentTime >= info.startTime * 1000 &&
        currentTime < info.endTime * 1000
      ) {
        return (
          <div>
            <div className="border-[2px] rounded-lg flex flex-col justify-around items-center p-3 m-3 h-[200px] w-[280px] bg-[#4A6D7C]">
              <div className="text-3xl text-center">Thời gian còn lại</div>
              <div className="text-4xl font-semibold text-center">
                {formatTime(duration)}
              </div>
            </div>
            <div className="flex flex-col justify-between items-center gap-5 ">
              <div className="text-3xl font-bold">
                Giá hiện tại: 250.000.000đ
              </div>
              <Input
                type="number"
                placeholder={""}
                className={`w-[400px] !placeholder-opacity-80 !placeholder-white bg-[#475657] `}
                name="price"
              />
              <div className="">*Bước giá 10%</div>
              <Button className="w-[200px] text-xl rounded-xl">Trả giá</Button>
            </div>
          </div>
        );
      } else {
        return <div className="text-3xl">Không khả dụng</div>;
      }
    } else if (info.listingStatus === 1) {
      return <div className="text-3xl">Đã hoàn thành</div>;
    } else {
      return <div className="text-3xl">Không khả dụng</div>;
    }
  };

  const time = 1716054714;

  const formatTime = (time) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));

    return `${days} ngày ${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (time) => {
    const date = new Date(time * 1000); // chuyển time thành milliseconds
    const gmtOffset = 7; // Độ lệch múi giờ của bạn (VD: GMT +7)

    const utc = date.getTime() + date.getTimezoneOffset() * 60000; // Chuyển đổi sang múi giờ UTC
    const localTime = new Date(utc + 3600000 * gmtOffset); // Thêm độ lệch múi giờ

    const year = localTime.getFullYear();
    const month = ("0" + (localTime.getMonth() + 1)).slice(-2);
    const day = ("0" + localTime.getDate()).slice(-2);
    const hours = ("0" + localTime.getHours()).slice(-2);
    const minutes = ("0" + localTime.getMinutes()).slice(-2);

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  function setDeadline(value: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="text-white min-h-screen">
      <div className="flex gap-10 h-[500px]">
        <div className="p-5">
          <Image src={info?.image} alt="Biển số" width={540} height={400} />
          <div className="flex flex-row justify-between mt-5">
            <p className="text-2xl font-semibold ">{info?.type}</p>
            <p className="text-2xl font-semibold ">Thành phố {info?.city}</p>
          </div>
          <div className="pt-16">
            <div className="flex justify-between">
              <p>Auction ID</p>
              <p>{info?.id}</p>
            </div>
            <div className="flex justify-between">
              <p>NFT token ID</p>
              <p>{info?.tokenId}</p>
            </div>
            <div className="flex justify-between">
              <p>NFT contract address</p>
              <p>{shortenAddress(info?.nftContract)}</p>
            </div>
            <div className="flex justify-between">
              <p>Chủ sở hữu</p>
              <p>{shortenAddress(info?.owner)}</p>
            </div>
          </div>
        </div>
        <div className="p-5 flex flex-col gap-8 w-full">
          <div className=" border-[2px] rounded-lg w-full justify-around items-center flex h-full pl-5">
            {renderStatus()}
          </div>
        </div>
      </div>
      <div className="mx-5 mt-5 border-[2px] rounded-lg h-full w-full">
        <div className="w-full h-20 font-semibold px-5 border border-b-[1px] ">
          <p className="text-2xl leading-[80px]">Lịch sử đấu giá</p>
        </div>
        <div className=" h-full  ">
          <Table className="text-white">
            <TableHeader className="!text-center">
              <TableRow className="!text-white">
                <TableHead className=" text-center">STT</TableHead>
                <TableHead className="text-center">Thời gian đấu giá</TableHead>
                <TableHead className="text-center">Biển số xe</TableHead>
                <TableHead className="text-center">TX Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auctionHistoryData.map((item, index) => (
                <TableRow key={index} className="text-white align-middle m-3">
                  <TableCell className="text-center">{item.STT}</TableCell>
                  <TableCell className="text-center">{item.thoiGian}</TableCell>
                  <TableCell className="text-center">{item.soTien}</TableCell>
                  <TableCell className="text-center">{item.txHash}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default auctionDetail;
function shortenAddress(address = "", length = 6) {
  return (
    address &&
    `${address.substring(0, 8)}...${address.substring(address.length - length)}`
  );
}

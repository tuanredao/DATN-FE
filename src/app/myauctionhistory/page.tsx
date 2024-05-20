"use client";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function MyAuctionHistoryPage(props) {
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

  return (
    <main className="bg-[#475657] min-h-screen">
      <div>
        <p className="px-5 pl-7 pt-3 text-white text-3xl">
          Lịch sử đấu giá của bạn
        </p>
      </div>
      <div className="bg-[#4A6D7C] mt-8 !border !border-white !rounded-lg m-5 !text-white">
            </div>
      <div className="bg-[#4A6D7C] mt-8 !border !border-white !rounded-lg m-5 !text-white ">
        <Table className="text-white">
          <TableHeader className="!text-center">
            <TableRow className="!text-white">
              <TableHead className="w-[100px] text-center">STT</TableHead>
              <TableHead className="text-center">Thời gian đấu giá</TableHead>
              <TableHead className="text-center">Biển số xe</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-center">Số tiền</TableHead>
              <TableHead className="text-center">TX Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auctionHistoryData.map((item, index) => (
              <TableRow key={index} className="text-white align-middle m-3">
                <TableCell className="text-center">{item.STT}</TableCell>
                <TableCell className="text-center">{item.thoiGian}</TableCell>
                <TableCell className="text-center">{item.bienSoXe}</TableCell>
                <TableCell className="text-center">{item.trangThai}</TableCell>
                <TableCell className="text-center">{item.soTien}</TableCell>
                <TableCell className="text-center">{item.txHash}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
    </main>
  );
}

export default MyAuctionHistoryPage;

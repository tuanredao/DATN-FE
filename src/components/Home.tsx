// "use client";
// import React, { useState, useEffect } from "react";
// import Navbar from "./Navbar";
// import Search from "./Search";
// import { Input } from "./ui/input";
// import { Button } from "@/components/ui/button";
// import Link from 'next/link';

// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useQuery } from "@tanstack/react-query";
// import useDebounce from "@/hooks/useDebounce";

// function Homepage() {
//   const [info, setInfo] = useState([]);
//   const [searchBienso, setSearchBienso] = useState("");
//   const [searchTinhThanhPho, setSearchTinhThanhPho] = useState("");
//   const [searchLoaiXe, setSearchLoaiXe] = useState("");


  
//   const handleGetInfo = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/nft/bienso");
//       const data = await response.json();
//       setInfo(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     handleGetInfo();
//   }, []);

//   const filterData = (item) => {
//     return (
//       item.bienSo.toLowerCase().includes(searchBienso.toLowerCase()) &&
//       item.tinhThanhPho
//         .toLowerCase()
//         .includes(searchTinhThanhPho.toLowerCase()) &&
//       item.loaiXe.toLowerCase().includes(searchLoaiXe.toLowerCase())
//     );
//   };

//   return (
//     <main className="bg-[#475657] min-h-screen">
     
//       <div className="flex justify-center items-center pt-10 pb-0">
//         <p className="text-white text-5xl ">BIỂN SỐ XE ĐƯỢC ĐẤU GIÁ</p>
//       </div>

//       <Search
//         searchBienso={searchBienso}
//         searchLoaiXe={searchLoaiXe}
//         searchTinhThanhPho={searchTinhThanhPho}
//         setSearchBienso={setSearchBienso}
//         setSearchTinhThanhPho={setSearchTinhThanhPho}
//         setSearchLoaiXe={setSearchLoaiXe}
//       />

//       <div className="px-6 text-center">
//         <div className="bg-[#4A6D7C] mt-8 !border !border-white !rounded-lg ">
//           <Table className="!text-center ">
//             <TableHeader className="">
//               <TableRow className="">
//                 <TableHead className="w-[100px]  text-white">STT</TableHead>
//                 <TableHead className="text-white text-center">
//                   Biển số
//                 </TableHead>
//                 <TableHead className="text-white text-center">
//                   Thành phố
//                 </TableHead>
//                 <TableHead className="text-white text-center">
//                   Loại xe
//                 </TableHead>
//                 <TableHead className="text-white text-center">
//                   Trạng thái
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {info.filter(filterData).map((item, index) => (
//                 <TableRow
//                   key={index}
//                   className="text-white items-center align-middle"
//                 >
//                   <TableCell className="font-medium">{index + 1}</TableCell>
//                   <TableCell className="text-lg font-semibold">
//                     {item.bienSo}
//                   </TableCell>
//                   <TableCell>{item.tinhThanhPho}</TableCell>
//                   <TableCell>{item.loaiXe}</TableCell>
//                   <TableCell className="w-[17%]">
//                     {item.trangThai === 0
//                         ? <Button className="bg-[#696856] " >Chờ đấu giá</Button>
//                         : item.trangThai === 1
//                         ? <Button className="bg-[#2E6041]">Đang đấu giá</Button>
//                         : item.trangThai === 2
//                         ? <Button className="bg-[#696856]">Không khả dụng</Button>
//                         : "Unknown"}
//                   </TableCell>
//                 </TableRow>
                
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//     </main>
//   );
// }

// export default Homepage;

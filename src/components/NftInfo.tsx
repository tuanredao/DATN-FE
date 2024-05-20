import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

function NftInfo({data}) {
  console.log('data1', data);

  let statusColor = '';
  let statusText = '';

  if (data?.trangThai === '0' || data?.trangThai === 0) {
    statusColor = 'bg-gray-400'; 
    statusText = 'Chờ đấu giá';
  } else if (data?.trangThai === '1' || data?.trangThai === 1) {
    statusColor = 'bg-[#4A6D7C]';
    statusText = 'Đấu giá';
  } else if (data?.trangThai === '2' || data?.trangThai === 2){
    statusColor = 'bg-gray-400'; 
    statusText = 'Không khả dụng';
  }

  return (
    <div className="p-3 flex flex-col gap-5 border border-white w-full max-w-[270px] rounded-xl justify-center items-center">
      <Image
      className='justify-center'
        src={data?.image}
        alt="Anh-Nft"
        width={232}
        height={136}
      />
      <div className="text-white flex justify-between px-3 w-full">
        <p>{data?.loaiXe}</p>
        <p>{data?.tinhThanhPho}</p>
      </div>
      {/* <div className="px-3 flex text-white text-center">
        <div className="w-16 h-10 relative">
          <Image
            className="object-cover"
            fill
            alt="icon"
            src="https://lcdn-hk.icons8.com/c/3_MmXfQppEqXttrb4tCwKw/e501000b7f4a8da508cd7d90e5e45630e251b7ce.png"
          />
        </div>
        <div>1 ngay 12 gio 15 phut 14:00 14/05/2024</div>
      </div> */}
      <div className="flex justify-center w-full">
        <Button className={`rounded-2xl w-[150px] ${statusColor === 'bg-gray-400' ? 'text-gray-600 cursor-not-allowed' : ''}`}>
          {statusText}
        </Button>
      </div>
    </div>
  );
}

export default NftInfo;

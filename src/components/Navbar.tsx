import React from "react";
import Image from "next/image";
import logo from "./ui/icon/logo.png";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import AccountPopUp from "./AccountPopUp";

function Navbar() {
  return (
    <div className="flex px-5 border-b-2 border-white py-5 justify-start items-center gap-10">
      <Image src={logo} alt="Logo" width={50} height={50} />
      <Link href="/homepage">
        <p className="text-white text-2xl hover:bg-transparent">Trang chủ</p>
      </Link>
      <Link href="/auction">
        <p className="text-white text-2xl">Đấu giá</p>
      </Link>
      <Link href="/auctionhistory">
        <p className="text-white text-2xl">Lịch sử đấu giá</p>
      </Link>
      <div className="ml-auto">
       <AccountPopUp />
      </div>
      <ConnectButton />
      <div></div>
    </div>
  );
}

export default Navbar;

"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "./ui/icon/logoo1.png";
import auction from "./ui/icon/auction.png";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import AccountPopUp from "./AccountPopUp";
import AdminPopUp from "./AdminPopUp";
import { useAccount } from "wagmi";

function Navbar() {
  const { address } = useAccount();
  const isConnected = useAccount().isConnected;
  console.log(isConnected, address);
  const { connector, isConnecting } = useAccount();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (address === "0x718a337bbd8ED6a2d50834e84BEe8874E9dD5e17") {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    };

    checkAuthorization();
  }, [address]);
  
  return (
    <div className="flex px-5 border-b-2 border-white py-5 justify-between items-center">
      <div className="flex items-center gap-10">
        <Image src={logo} alt="Logo" width={200} height={200} />
        <Link href="/homepage">
          <p className="text-white text-2xl hover:bg-transparent">Trang chủ</p>
        </Link>
        <Link href="/auction">
          <p className="text-white text-2xl">Đấu giá</p>
        </Link>
        <Link href="/auctionhistory">
          <p className="text-white text-2xl">Lịch sử đấu giá</p>
        </Link>
      </div>
      <div className="flex items-center gap-5">
        {authorized ? <AdminPopUp /> : <AccountPopUp />}
        <ConnectButton />
      </div>
    </div>
  );
}

export default Navbar;

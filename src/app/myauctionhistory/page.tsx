"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAccount } from "wagmi";

function MyAuctionHistoryPage(props) {
  const { address } = useAccount();
  console.log(address);

  const [offer, setOffer] = useState<any>(null);
  const [listing, setListings] = useState({});

  const handleGetOffer = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/offer/findbidder?bidder=${address}`
      );

      const data = await response.json();
      console.log("offer", data);

      setOffer(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (address) {
      handleGetOffer();
    }
  }, [address]);

  const fetchListingData = async (offerId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/auction/find/${offerId}`
      );
      const data = await response.json();
      console.log("listing", data);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  useEffect(() => {
    if (offer) {
      const fetchListings = async () => {
        const listingData = {};
        for (const offerItem of offer) {
          const listing = await fetchListingData(offerItem.id);
          if (listing) {
            listingData[offerItem.id] = listing;
          }
        }
        setListings(listingData);
      };
      fetchListings();
    }
  }, [offer]);

  const formatDate = (time) => {
    const date = new Date(time * 1000);
    const gmtOffset = 7;

    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const localTime = new Date(utc + 3600000 * gmtOffset);

    const year = localTime.getFullYear();
    const month = ("0" + (localTime.getMonth() + 1)).slice(-2);
    const day = ("0" + localTime.getDate()).slice(-2);
    const hours = ("0" + localTime.getHours()).slice(-2);
    const minutes = ("0" + localTime.getMinutes()).slice(-2);

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getStatusString = (status) => {
    if (status === 0) return "Đang diễn ra";
    if (status === 1) return "Đợi trả tiền";
    if (status === 2) return "Đã huỷ";
    if (status === 3) return "Timeout";
    if (status === 4) return "Thành công";
    return "Unknown";
};

  return (
    <main className="bg-[#475657] min-h-screen">
      <div>
        <p className="px-5 pl-7 pt-3 text-white text-3xl">
          Lịch sử đấu giá của tôi
        </p>
      </div>
      <div className="bg-[#4A6D7C] mt-8 !border !border-white !rounded-lg m-5 !text-white"></div>
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
            {Array.isArray(offer) && offer.length > 0 ? (
              offer.map((offer, index) => (
                <TableRow key={index} className="text-white align-middle m-3">
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">
                    {formatDate(offer.timestamp)}
                  </TableCell>
                  <TableCell className="text-center">
                    {listing[offer.id] ? listing[offer.id].bienSo : ""}
                  </TableCell>
                  <TableCell className="text-center flex flex-row justify-center gap-5">
                    {listing[offer.id]
                      ? getStatusString(listing[offer.id].listingStatus)
                      : ""}
                      <a
                      href={`http://localhost:3000/auction/auctionDetail/${offer.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://img.icons8.com/?size=100&id=82787&format=png&color=FFFFFF"
                        alt="External Link"
                        style={{ width: "16px", height: "16px" }}
                      />
                    </a>
                  </TableCell>
                  <TableCell className="text-center">
                    {offer.price} VND
                  </TableCell>
                  <TableCell className="text-center flex flex-row justify-center gap-5">
                    {shortenAddress(offer.tx)}{" "}
                    <a
                      href={`https://amoy.polygonscan.com/tx/${offer.tx}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://img.icons8.com/?size=100&id=82787&format=png&color=FFFFFF"
                        alt="External Link"
                        style={{ width: "16px", height: "16px" }}
                      />
                    </a>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Chưa tham gia phiên đấu giá nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}

export default MyAuctionHistoryPage;
function shortenAddress(address = "", length = 6) {
  return (
    address &&
    `${address.substring(0, 8)}...${address.substring(address.length - length)}`
  );
}

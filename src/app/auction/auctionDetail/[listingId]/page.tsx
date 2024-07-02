"use client";
import { auctiontAbi } from "@/abi/auctionAbi";
import { USDCabi } from "@/abi/USDCabi";
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
import { config } from "@/provider/RainbowProvider";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useReadContract } from "wagmi";

function auctionDetail() {
  const param = useParams();
  const address = useAccount().isConnected;
  const account = useAccount();

  const [info, setInfo] = useState<any>(null);
  const [offer, setOffer] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [countdown, setCountdown] = useState(null);
  const [duration, setDuration] = useState(null);
  const [offerPrice, setOfferPrice] = useState<any>("");
  const [authorized, setAuthorized] = useState<any>(false);
  const [checkKYC, setCheckKYC] = useState<any>(false);
  const [amount, setAmount] = useState<any>(null);
  const [deadline, setDeadline] = useState<any>(null);
  const [checkApprove, setCheckApprove] = useState<any>(null);
  const [highestBidder, setHighestBidder] = useState<any>(null);
  const [paidAmount, setPaidAmount] = useState<any>(null);
  const [auctionData, setAuctionData] = useState({
    deadline: "",
    depositAmount: "",
    depositTime: "",
  });

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const checkApproval = async () => {
      if (!address) {
        console.log("Address is undefined or not provided.");
        return;
      }

      try {
        const approved = await readContract(config, {
          abi: USDCabi,
          address: "0xF4bFc32C9B60c9Dfc43060Ac168690e536646cc2",
          functionName: "allowance",
          args: [account.address, "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f"],
        });
        console.log("approved", approved);
        setCheckApprove(approved);
      } catch (error) {
        console.log("Error checking approval:", error);
      }
    };

    checkApproval();
  }, [account.address]);

  const handleApprove = async () => {
    try {
      const hash = await writeContract(config, {
        abi: USDCabi,
        address: "0xF4bFc32C9B60c9Dfc43060Ac168690e536646cc2",
        functionName: "approve",
        args: ["0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f", 99999 * 1e18],
      });

      toast.promise(waitForTransactionReceipt(config, { hash }), {
        pending: "Process ...",
        success: "Approve successful!",
        error: {
          render({ data }: { data: any }) {
            return `Approve failed: ${data.message}`;
          },
        },
      });
    } catch (error) {
      console.log("Error Approve: ", error);
      toast.error(error?.message || error?.reason);
    }
  };

  const getDeadline = async () => {
    try {
      const res = await fetch(`http://localhost:5000/auction/deadline`);
      const deadline = await res.json();
      console.log("deadline", deadline);
      setDeadline(deadline);
      return deadline;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDeadline();
  }, []);

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

  const handleGetData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/auction/data?id=${param.listingId}`
      );

      const data = await response.json();
      console.log(data);

      setData(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetData();

    const intervalId = setInterval(() => {
      handleGetData();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const handleGetOffer = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/offer/findid?id=${param.listingId}`
      );

      const data = await response.json();
      console.log("offer", data);

      setOffer(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetOffer();
    const intervalId = setInterval(() => {
      handleGetOffer();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const handleCheckKYC = async () => {
    try {
      console.log("address", account.address);

      const response = await fetch(
        `http://localhost:5000/users/checkKyc?wallet=${account.address}`
      );

      const kycStatus = await response.json();
      console.log("kycStatus", kycStatus);

      if (kycStatus === true) {
        setCheckKYC(true);
      } else {
        setCheckKYC(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (address) {
      handleCheckKYC();
    }
  }, [address]);
  console.log(info?.id, account.address);

  const getHighestBidder = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/offer/highest?id=${param.listingId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const bidder = await response.text();
      if (bidder) {
        setHighestBidder(bidder);
      } else {
        console.error("No bidder data found");
      }
      return bidder;
    } catch (error) {
      console.error("Error fetching highest bidder:", error);
    }
  };
  useEffect(() => {
    getHighestBidder();
  }, []);

  useEffect(() => {
    const checkDeposited = async () => {
      try {
        if (!info || !account.address) return;

        const result = await readContract(config, {
          abi: auctiontAbi,
          address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
          functionName: "userHasDeposited",
          args: [info.id, account.address],
        });
        setAuthorized(result);
        console.log("setAuthorized", result);
      } catch (error) {
        console.error("Error checking deposit:", error);
      }
    };

    checkDeposited();
  }, [info, account.address]);

  const handleDeposit = async () => {
    try {
      const hash = await writeContract(config, {
        abi: auctiontAbi,
        address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
        functionName: "deposit",
        args: [info?.id],
      });

      toast.promise(waitForTransactionReceipt(config, { hash }), {
        pending: "Process ...",
        success: "Deposit successful!",
        error: {
          render({ data }: { data: any }) {
            return `Deposit failed: ${data.message}`;
          },
        },
      });
    } catch (error) {
      console.log("Error Deposit: ", error);
      toast.error(error?.message || error?.reason);
    }
  };

  const handleMakeOffer = async () => {
    const minOfferPrice = data?.highestPrice + info?.stepPrice;
    if (parseFloat(offerPrice) <= minOfferPrice) {
      alert("Giá nhập vào phải lớn hơn giá cao nhất hiện tại.");
      return;
    }
    try {
      const hash = await writeContract(config, {
        abi: auctiontAbi,
        address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
        functionName: "makeOffer",
        args: [info?.id, offerPrice * 1e18],
      });

      toast.promise(waitForTransactionReceipt(config, { hash }), {
        pending: "Process ...",
        success: "Make Offer successful!",
        error: {
          render({ data }: { data: any }) {
            return `Make Offer failed: ${data.message}`;
          },
        },
      });
    } catch (error) {
      console.log("Error Make Offer: ", error);
      toast.error(error?.message || error?.reason);
    }
  };

  const handleFund = async () => {
    const minOfferPrice = data?.highestPrice + info?.stepPrice;
    if (parseFloat(offerPrice) <= minOfferPrice) {
      alert("Giá nhập vào phải lớn hơn giá cao nhất hiện tại.");
      return;
    }
    try {
      const hash = await writeContract(config, {
        abi: auctiontAbi,
        address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
        functionName: "fund",
        args: [info?.id, amount * 1e18],
      });

      toast.promise(waitForTransactionReceipt(config, { hash }), {
        pending: "Process ...",
        success: "Fund successful!",
        error: {
          render({ data }: { data: any }) {
            return `Fund failed: ${data.message}`;
          },
        },
      });
    } catch (error) {
      console.log("Error Fund: ", error);
      toast.error(error?.message || error?.reason);
    }
  };

  const handleClaimFundTimeOut = async () => {
    try {
      const hash = await writeContract(config, {
        abi: auctiontAbi,
        address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
        functionName: "claimFundTimeOut",
        args: [info?.id],
      });

      toast.promise(waitForTransactionReceipt(config, { hash }), {
        pending: "Process ...",
        success: "Claim Fund successful!",
        error: {
          render({ data }: { data: any }) {
            return `Claim Fund failed: ${data.message}`;
          },
        },
      });
    } catch (error) {
      console.log("Error claimFundTimeOut: ", error);
      toast.error(error?.message || error?.reason);
    }
  };

  const handleWithdrawDeposit = async () => {
    try {
      const hash = await writeContract(config, {
        abi: auctiontAbi,
        address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
        functionName: "withdrawDeposit",
        args: [info?.id],
      });

      toast.promise(waitForTransactionReceipt(config, { hash }), {
        pending: "Process ...",
        success: "Withdraw deposit successful!",
        error: {
          render({ data }: { data: any }) {
            return `Withdraw deposit failed: ${data.message}`;
          },
        },
      });
    } catch (error) {
      console.log("Error withdrawDeposit: ", error);
      toast.error(error?.message || error?.reason);
    }
  };

  const saveOffer = async () => {
    try {
      const response = await fetch("http://localhost:5000/offer/save");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("Save offer successful!");
      toast.success("Save offer successful!");
    } catch (apiError) {
      console.log("Save offer failed: ", apiError);
      toast.error("Save offer failed, please try again!");
    }
  };

  const currentTime = Date.now();
  const eopTime = info?.endTime + deadline;
  console.log("time", info?.endTime, deadline, eopTime);

  useEffect(() => {
    if (info) {
      console.log("Info End Time:", info.endTime * 1000);

      if (currentTime < info?.startTime * 1000) {
        console.log("case1");
        const countdownTimer = setInterval(() => {
          const remaining = info?.startTime * 1000 - Date.now();
          if (remaining <= 0) {
            clearInterval(countdownTimer);
          }
          setCountdown(remaining);
        }, 1000);
        return () => clearInterval(countdownTimer);
      } else if (
        currentTime >= info?.startTime * 1000 &&
        currentTime < info?.endTime * 1000
      ) {
        console.log("case2");
        const durationTimer = setInterval(() => {
          const duration = info?.endTime * 1000 - Date.now();
          if (duration <= 0) {
            clearInterval(durationTimer);
          }
          setDuration(duration);
        }, 1000);
        return () => clearInterval(durationTimer);
      } else if (info?.listingStatus == 1) {
        console.log("case3");
        console.log("eop", eopTime);
        console.log("Current deadline:", deadline);

        const durationTimer = setInterval(() => {
          const dynamicCurrentTime = Date.now();
          const duration = eopTime * 1000 - dynamicCurrentTime;
          if (duration <= 0) {
            clearInterval(durationTimer);
          }
          setDuration(duration);
        }, 1000);
        return () => clearInterval(durationTimer);
      }
    }
  }, [info, deadline, currentTime]);

  console.log("duration", duration);
  const remainingAmount =
    data?.highestPrice -
    Number(auctionData?.depositAmount) / 1e18 -
    Number(paidAmount) / 1e18;

  const paidEnough = remainingAmount <= 0;

  const renderStatus = () => {
    if (!info) return null;

    if (info.listingStatus === 0) {
      if (currentTime < info.startTime * 1000) {
        return (
          <div className="flex flex-col items-center justify-between">
            {checkKYC ? (
              <>
                <div className="flex flex-col items-center justify-between">
                  <div className="text-3xl mb-4">Đấu giá sẽ mở trong</div>
                  <div className="text-5xl font-semibold">
                    {formatTime(countdown)}
                  </div>
                </div>
                <div className="pt-3">({formatDate(info.startTime)})</div>
                {authorized ? (
                  <Button
                    className="mt-5 w-[200px] text-xl rounded-xl"
                    disabled
                  >
                    Đợi đấu giá bắt đầu
                  </Button>
                ) : checkApprove <= 0 ? (
                  <Button
                    className="mt-5 w-[200px] text-xl rounded-xl"
                    onClick={handleApprove}
                  >
                    Approve
                  </Button>
                ) : (
                  <Button
                    className="mt-5 w-[200px] text-xl rounded-xl"
                    onClick={handleDeposit}
                  >
                    Đặt cọc
                  </Button>
                )}

                <div className="mt-1">
                  *Đặt cọc muộn nhất {Number(auctionData?.depositTime) / 60}{" "}
                  phút trước khid dấu giá bắt đầu{" "}
                </div>
                <div className="mt-1">
                  *Số tiền đặt cọc: {Number(auctionData?.depositAmount) / 1e18}{" "}
                </div>
              </>
            ) : (
              <div className="text-xl">Tài khoản chưa được xác thực KYC.</div>
            )}
          </div>
        );
      } else if (
        currentTime >= info.startTime * 1000 &&
        currentTime < info.endTime * 1000
      ) {
        return (
          <div className="flex justify-center items-center gap-20">
            <div className="border-[2px] rounded-lg flex flex-col justify-center items-center p-3 m-3 h-[200px] w-[350px] bg-[#4A6D7C]">
              <div className="text-3xl text-center">Thời gian còn lại</div>
              <div className="text-4xl font-semibold text-center">
                {formatTime(duration)}
              </div>
            </div>
            <div className="flex flex-col justify-between items-center gap-5 ">
              <div className="text-3xl font-bold">
                Giá khởi điểm: {info?.price}đ
              </div>
              <div className="text-3xl font-bold">
                Giá cao nhất hiện tại: {data?.highestPrice}đ
              </div>
              <Input
                type="number"
                placeholder={"Nhập giá muốn trả"}
                className={`w-[400px] !placeholder-opacity-80 !placeholder-white bg-[#475657] `}
                name="price"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
              />
              <div className="">*Bước giá {info?.stepPrice} VND</div>
              {checkApprove <= 0 ? (
                authorized ? (
                  <Button
                    className="mt-5 w-[200px] text-xl rounded-xl"
                    onClick={handleApprove}
                  >
                    Approve
                  </Button>
                ) : (
                  <Button
                    className="mt-5 w-[200px] text-xl rounded-xl"
                    disabled
                  >
                    Chưa đặt cọc
                  </Button>
                )
              ) : authorized ? (
                <Button
                  className="w-[200px] text-xl rounded-xl"
                  onClick={async () => {
                    try {
                      await handleMakeOffer();
                      await delay(20000);
                      await saveOffer();
                    } catch (error) {
                      console.error("handleMakeOffer failed:", error);
                    }
                  }}
                >
                  Trả giá
                </Button>
              ) : (
                <Button className="w-[200px] text-xl rounded-xl" disabled>
                  Chưa đặt cọc
                </Button>
              )}
            </div>
          </div>
        );
      } else {
        return <div className="text-3xl">Không khả dụng</div>;
      }
    } else if (info.listingStatus === 1) {
      console.log(currentTime, eopTime * 1000);

      return (
        <div className="flex justify-center items-center gap-20">
          <div className="border-[2px] rounded-lg flex flex-col justify-center items-center p-3 m-3 h-[200px] w-[350px] bg-[#4A6D7C]">
            {currentTime < eopTime * 1000 ? (
              <div>
                <div className="text-3xl text-center">
                  Hạn cuối trả đủ tiền còn
                </div>
                <div className="text-4xl font-semibold text-center">
                  {formatTime(duration)}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-3xl font-bold text-red-800">
                  Hết giờ trả góp
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between items-center gap-5 ">
            <div className="text-3xl font-bold">
              Giá trúng đấu giá: {data?.highestPrice}đ
            </div>
            <div className="text-3xl font-bold">
              Người trúng đấu giá : {shortenAddress(highestBidder)}
            </div>
            <div className="flex flex-col justify-between items-center gap-5">
              {highestBidder === account.address ? (
                <>
                  {currentTime < eopTime * 1000 ? (
                    <>
                      {remainingAmount > 0 && (
                        <>
                          <div className="text-lg font-bold">
                            Số tiền còn lại phải trả: {remainingAmount} đ
                          </div>
                          <Input
                            type="number"
                            placeholder=""
                            className="w-[400px] !placeholder-opacity-80 !placeholder-white bg-[#475657]"
                            name="price"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                          {checkApprove <= 0 ? (
                            <Button
                              className="mt-5 w-[200px] text-xl rounded-xl"
                              onClick={handleApprove}
                            >
                              Approve
                            </Button>
                          ) : (
                            <Button
                              className="w-[200px] text-xl rounded-xl"
                              onClick={handleFund}
                            >
                              Trả góp
                            </Button>
                          )}
                        </>
                      )}

                      <div className="text-xs italic flex flex-col justify-start items-start max-w-[400px]">
                        <div className="mb-5">
                          *Sau 3 ngày, nếu không nộp đủ số tiền trên thì phiên
                          đấu giá coi như bị huỷ bỏ và không được hoàn trả số
                          tiền cọc
                        </div>
                        <div>*Có thể trả góp theo từng phần đến khi đủ</div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-row justify-between gap-5">
                      <Button
                        className="w-[250px] text-xl rounded-xl"
                        onClick={handleClaimFundTimeOut}
                      >
                        Nhận lại số tiền đã góp
                      </Button>
                    </div>
                  )}

                  {paidEnough && (
                    <div className="text-3xl font-bold text-white mt-3">
                      Đã trả đủ tiền, kiểm tra biển số trong tài khoản
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col justify-between items-center gap-5">
                  <h3>Chúc bạn may mắn lần sau</h3>
                  {authorized && (
                    <Button
                      className="w-[120px] border border-white rounded-xl"
                      onClick={handleWithdrawDeposit}
                    >
                      Nhận lại tiền cọc
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else if (info.listingStatus === 3) {
      return (
        <div className="flex flex-col justify-between items-center gap-7">
          <div className="text-5xl font-bold">Đấu giá thành công</div>
          <div className="text-3xl font-semibold">
            Số tiền thắng đấu giá: {data?.highestPrice}đ{" "}
          </div>
          <div className="text-xl">
            Người chiến thắng:
            <a
              href={`https://amoy.polygonscan.com/address/${info?.owner}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-500 ml-2"
            >
              {shortenAddress(info?.owner)}
            </a>
          </div>
        </div>
      );
    } else {
      return <div className="text-3xl">Không khả dụng</div>;
    }
  };

  console.log("higgest bidder", highestBidder);

  useEffect(() => {
    const getAuctionData = async () => {
      try {
        const deadline = await readContract(config, {
          abi: auctiontAbi,
          address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
          functionName: "deadline",
        });

        const depositAmount = await readContract(config, {
          abi: auctiontAbi,
          address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
          functionName: "depositAmount",
        });

        const depositTime = await readContract(config, {
          abi: auctiontAbi,
          address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
          functionName: "depositTime",
        });
        setAuctionData({
          deadline: deadline.toString(),
          depositAmount: depositAmount.toString(),
          depositTime: depositTime.toString(),
        });
      } catch (error) {
        console.log("Error Approve: ", error);
        toast.error(error?.message || error?.reason);
      }
    };
    getAuctionData();
  }, []);

  console.log("highID", info?.highestOfferId);

  useEffect(() => {
    const getPaidAmount = async () => {
      const highestOfferId = info?.highestOfferId;
      if (highestOfferId === undefined || highestOfferId === null) {
        console.log("highestOfferId is not available:", highestOfferId);
        return;
      }

      try {
        console.log("Fetching paid amount for highestOfferId:", highestOfferId);
        const paidAmount = await readContract(config, {
          abi: auctiontAbi,
          address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
          functionName: "offers",
          args: [param.listingId, highestOfferId],
        });

        console.log("getPaidAmount:", paidAmount[4]);
        setPaidAmount(paidAmount[4]);
      } catch (error) {
        console.error("Error getting paid amount:", error);
        toast.error(
          error?.message || error?.reason || "Unknown error occurred"
        );
      }
    };

    getPaidAmount();
  }, [info?.highestOfferId, config, param.listingId, auctiontAbi]);

  const formatTime = (time) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));

    return `${days} ngày ${hours}:${minutes}:${seconds}`;
  };

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

  return (
    <div className="text-white min-h-screen">
      <div className="flex gap-10 h-[500px]">
        <div className="p-5">
          <div className="w-[540px] h-[240px] rounded-xl border border-white text-white bg-[#4A6D7C] flex flex-col justify-center items-center text-7xl font-bold ">
            {info?.bienSo && (
              <>
                <div className="mb-[-6px]">
                  {info.bienSo.replace(/-/g, "").slice(0, 3)}
                </div>
                <div className="">-</div>
                <div className="mt-[-6px]">
                  {info.bienSo.replace(/-/g, "").slice(3, 6) +
                    "." +
                    info.bienSo.replace(/-/g, "").slice(6)}
                </div>
              </>
            )}
          </div>

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
        <div className="p-5 flex flex-col gap-5 w-full">
          <div
            className={`rounded-lg border border-white p-2 text-[16px] w-30 ${
              authorized ? "bg-green-950" : "bg-red-950"
            } flex items-center justify-center`}
          >
            {authorized ? (
              <div className="flex flex-row justify-between items-center gap-10">
                <div className="text-xl font-bold">
                  {shortenAddress(account.address)} Đã đặt cọc
                </div>{" "}
                <Button
                      className="w-[120px] border border-white rounded-xl"
                      onClick={handleWithdrawDeposit}
                    >
                      Nhận lại tiền cọc
                    </Button>
              </div>
            ) : (
              <div className="text-xl font-bold">
                {shortenAddress(account.address)} Chưa đặt cọc
              </div>
            )}
          </div>
          <div className=" border-[2px] rounded-lg w-full justify-around items-center flex h-full pl-5">
            {renderStatus()}
          </div>
        </div>
      </div>
      <div className="mx-5 mt-5 border-[2px] rounded-lg ">
        <div className="w-full h-20 font-semibold px-5 border-b-2">
          <p className="text-2xl leading-[80px] ">Lịch sử đấu giá</p>
        </div>
        <div className=" ">
          <Table className="text-white">
            <TableHeader className="!text-center">
              <TableRow className="!text-white">
                <TableHead className=" text-center">STT</TableHead>
                <TableHead className=" text-center">Người trả giá</TableHead>
                <TableHead className="text-center">Thời gian trả giá</TableHead>
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
                      {shortenAddress(offer.bidder)}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatDate(offer.timestamp)}
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
                  <TableCell colSpan={5} className="text-center">
                    Chưa có trả giá.
                  </TableCell>
                </TableRow>
              )}
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

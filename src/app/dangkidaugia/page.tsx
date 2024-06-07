"use client";
import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { auctiontAbi } from "@/abi/auctionAbi";
import InputImageBtn from "@/components/AddImage";
import { toast } from "react-toastify";
import { config } from "@/provider/RainbowProvider"; 

function dangKyDauGiaPage(props) {
  const { address } = useAccount();
  const isConnected = useAccount().isConnected;
  console.log(isConnected);

  const [nftContract, setnftContract] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [id, setId] = useState("");
  const [offerId, setOfferId] = useState("");
  const [price, setPrice] = useState<any>("");
  const [stepPrice, setstepPrice] = useState<any>("");
  const [startTime, setstartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [deadline, setDeadline] = useState("");
  const [depositAmount, setDepositAmount] = useState<any>("");
  const [depositTime, setDepositTime] = useState("");
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

  const handleSignAuction = async () => {
    if (!authorized) {
      toast.error("Bạn không có quyền thực hiện hành động này.");
      return;
    }
    try {
      const hash = await writeContract(config, {
        abi: auctiontAbi,
        address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
        functionName: "createListing",
        args: [nftContract, tokenId, price*1e18, stepPrice*1e18, startTime, duration],
      });

      const finish = async () => {
        await waitForTransactionReceipt(config, {
          hash,
        });

        try {
          const response = await fetch("http://localhost:5000/Auction/save", {
            method: "POST",
          });

          if (response.ok) {
            toast.success("Auction listing created and data saved!");
          } else {
            toast.error("Auction listing created but failed to save data!");
          }
        } catch (apiError) {
          console.log("API request error: ", apiError);
          toast.error("Auction listing created but failed to save data!");
        }
      };

      toast.promise(finish(), {
        pending: "Processing auction...",
        success: "Auction listing created!",
        error: "Auction listing failed, please try again!",
      });
    } catch (error) {
      console.log("Error creating auction listing: ", error);
      toast.error(error?.message || error?.reason);
    }
  };

  const saveAuction = async () => {

    try {
      const response = await fetch("http://localhost:5000/Auction/save", {
        method: "GET"
      });

      if (response.ok) {
        toast.success("Data saved successfully!");
      } else {
        const errorData = await response.json();
        toast.error(`Error saving data: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error calling API: ", error);
      toast.error("Error saving data, please try again!");
    }
  };


  const handlePause = async () => {
    if (!authorized) {
      toast.error("Bạn không có quyền thực hiện hành động này.");
      return;
    }
    try {
      const hash = await writeContract(config, {
        abi: auctiontAbi,
        address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
        functionName: "pause",
      });
      const finish = async () => {
        waitForTransactionReceipt(config, {
          hash,
        });

        toast.promise(finish(), {
          pending: "Process pausing...",
          success: "Pause contract successful!",
          error: "Pause contract failed, please try again!",
        });
      };
    } catch (error) {
      console.log("Error pause contract: ", error);
      toast.error(error?.message || error?.reason);
    }
  };

  const handleUnpause = async () => {
    if (!authorized) {
      toast.error("Bạn không có quyền thực hiện hành động này.");
      return;
    }
    try {
      const hash = await writeContract(config, {
        abi: auctiontAbi,
        address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
        functionName: "unpause",
      });
      const finish = async () => {
        waitForTransactionReceipt(config, {
          hash,
        });

        toast.promise(finish(), {
          pending: "Process unpausing...",
          success: "Unpause successful!",
          error: "Unpause failed, please try again!",
        });
      };
    } catch (error) {
      console.log("Error unpause: ", error);
      toast.error(error?.message || error?.reason);
    }
  };

  const handleSetDeadline = async () => {
    if (!authorized) {
      toast.error("Bạn không có quyền thực hiện hành động này.");
      return;
    }
    try {
      const hash = await writeContract(config, {
        abi: auctiontAbi,
        address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
        functionName: "setDeadline",
        args: [deadline],
      });
      const finish = async () => {
        waitForTransactionReceipt(config, {
          hash,
        });

        toast.promise(finish(), {
          pending: "Process ...",
          success: "Set deadline successful!",
          error: "Set deadline failed, please try again!",
        });
      };
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error?.message || error?.reason);
    }
  };

  const handleSetDepositAmount = async () => {
    if (!authorized) {
      toast.error("Bạn không có quyền thực hiện hành động này.");
      return;
    }
    try {
      const hash = await writeContract(config, {
        abi: auctiontAbi,
        address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
        functionName: "setDepositAmount",
        args: [depositAmount],
      });
      const finish = async () => {
        waitForTransactionReceipt(config, {
          hash,
        });

        toast.promise(finish(), {
          pending: "Process ...",
          success: "Set Deposit Amount successful!",
          error: "Set Deposit Amount failed, please try again!",
        });
      };
    } catch (error) {
      console.log("Error : ", error);
      toast.error(error?.message || error?.reason);
    }
  };

  const handleSetDepositTime = async () => {
    if (!authorized) {
      toast.error("Bạn không có quyền thực hiện hành động này.");
      return;
    }
    try {
      const hash = await writeContract(config, {
        abi: auctiontAbi,
        address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
        functionName: "setDepositTime",
        args: [depositTime],
      });
      const finish = async () => {
        waitForTransactionReceipt(config, {
          hash,
        });

        toast.promise(finish(), {
          pending: "Process ...",
          success: "Set Deposit Time successful!",
          error: "Set Deposit Time failed, please try again!",
        });
      };
    } catch (error) {
      console.log("Error : ", error);
      toast.error(error?.message || error?.reason);
    }
  };

  const handleEndAuction = async () => {
    if (!authorized) {
      toast.error("Bạn không có quyền thực hiện hành động này.");
      return;
    }
    try {
      const hash = await writeContract(config, {
        abi: auctiontAbi,
        address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
        functionName: "endAuction",
        args: [id],
      });
      const finish = async () => {
        waitForTransactionReceipt(config, {
          hash,
        });

        toast.promise(finish(), {
          pending: "Process ...",
          success: "Set Deposit Time successful!",
          error: "Set Deposit Time failed, please try again!",
        });
      };
    } catch (error) {
      console.log("Error : ", error);
      toast.error(error?.message || error?.reason);
    }
  };

  const handleCanceAuction = async () => {
    if (!authorized) {
      toast.error("Bạn không có quyền thực hiện hành động này.");
      return;
    }
    try {
      const hash = await writeContract(config, {
        abi: auctiontAbi,
        address: "0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f",
        functionName: "cancelListing",
        args: [id],
      });
      const finish = async () => {
        waitForTransactionReceipt(config, {
          hash,
        });

        toast.promise(finish(), {
          pending: "Process ...",
          success: "Set Deposit Time successful!",
          error: "Set Deposit Time failed, please try again!",
        });
      };
    } catch (error) {
      console.log("Error : ", error);
      toast.error(error?.message || error?.reason);
    }
  };

  const disableInputs = !authorized;

  return (
    <main className="bg-[#475657] min-h-screen">
      <div className="mt-5">
        <div className="!text-white items-center flex flex-row gap-5">
          <div className="text-xl font-medium mx-10">Ví liên kết</div>
          <Input
            disabled
            placeholder=""
            value={address}
            className="w-[520px] bg-[#475657] content-center text-xl font-bold"
          />
          <div
            className={`rounded-full border border-white p-2 text-[10px] ${
              authorized ? "bg-green-950" : "bg-red-950"
            }`}
          >
            {authorized ? "Cơ quan có thẩm quyền" : "Không có quyền"}
          </div>
        </div>
      </div>
      <div className="text-white border-2 rounded-lg border-white p-10 m-5">
        <div className="border-2 rounded-lg border-white mb-16">
          <p className="m-5 text-4xl font-semibold">Đăng kí biển số đấu giá</p>
          <div className="flex items-center w-full">
            <div className="gap-8 flex flex-col w-full">
              <div className="p-5 flex flex-row justify-between">
                <p className="text-2xl font-medium">NFT Contract</p>
                <div>
                  <Input
                    type="text"
                    placeholder={""}
                    className={`w-[900px] !placeholder-opacity-80 !placeholder-white bg-[#475657] ${
                      disableInputs && "opacity-50"
                    }`}
                    name="nftContract"
                    value={nftContract}
                    onChange={(e) => setnftContract(e.target.value)}
                    disabled={disableInputs}
                  />
                </div>
              </div>
              <div className="p-5 flex flex-row justify-between">
                <p className="text-2xl font-medium">Token ID</p>
                <div>
                  <Input
                    type="text"
                    placeholder={""}
                    className={`w-[900px] !placeholder-opacity-80 !placeholder-white bg-[#475657] ${
                      disableInputs && "opacity-50"
                    }`}
                    name="tokenId"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    disabled={disableInputs}
                  />
                </div>
              </div>
              <div className="p-5 flex flex-row justify-between">
                <p className="text-2xl font-medium">Giá khởi điểm</p>
                <div className="">
                  <Input
                    type="text"
                    placeholder={""}
                    className={`w-[900px] !placeholder-opacity-80 !placeholder-white bg-[#475657] ${
                      disableInputs && "opacity-50"
                    }`}
                    name="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={disableInputs}
                  />
                </div>
              </div>
              <div className="p-5 flex flex-row justify-between">
                <p className="text-2xl font-medium">Bước giá</p>
                <div>
                  <Input
                    type="text"
                    placeholder={""}
                    className={`w-[900px] !placeholder-opacity-80 !placeholder-white bg-[#475657] ${
                      disableInputs && "opacity-50"
                    }`}
                    name="stepPrice"
                    value={stepPrice}
                    onChange={(e) => setstepPrice(e.target.value)}
                    disabled={disableInputs}
                  />
                </div>
              </div>
              <div className="p-5 flex flex-row justify-between">
                <p className="text-2xl font-medium">Thời gian bắt đầu</p>
                <div>
                  <Input
                    type="text"
                    placeholder={""}
                    className={`w-[900px] !placeholder-opacity-80 !placeholder-white bg-[#475657] ${
                      disableInputs && "opacity-50"
                    }`}
                    name="startTime"
                    value={startTime}
                    onChange={(e) => setstartTime(e.target.value)}
                    disabled={disableInputs}
                  />
                </div>
              </div>
              <div className="p-5 flex flex-row justify-between">
                <p className="text-2xl font-medium">Số ngày đấu giá</p>
                <div>
                  <Input
                    type="text"
                    placeholder={""}
                    className={`w-[900px] !placeholder-opacity-80 !placeholder-white bg-[#475657] ${
                      disableInputs && "opacity-50"
                    }`}
                    name="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    disabled={disableInputs}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="justify-center flex my-5 gap-7">
            <Button
              className="w-[250px] text-xl rounded-xl"
              onClick={handleSignAuction}
            >
              Đăng kí đấu giá
            </Button>

            <Button
              className="w-[250px] text-xl rounded-xl"
              onClick={saveAuction}
            >
              Xác nhận phiên đấu giá
            </Button>
          </div>
        </div>

        <div className="border-2 rounded-lg border-white ">
          <p className="m-5 text-4xl font-semibold mb-20">
            Quản lý phiên đấu giá
          </p>
          <div className="flex items-center w-full  ">
            <div className="gap-8 flex flex-col w-full ">
              <div className="p-5 flex flex-row justify-center border-2 rounded-2xl border-white mx-72 ">
                <Input
                  type="number"
                  placeholder={"Nhập ID"}
                  className={`w-[100px] !placeholder-opacity-80 !placeholder-white bg-[#475657] ${
                    disableInputs && "opacity-50"
                  }`}
                  name="id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  disabled={disableInputs}
                />
                <Button
                  className="w-[300px] text-xl rounded-xl mx-20"
                  onClick={handleEndAuction}
                >
                  Kết thúc phiên đấu giá
                </Button>
                <Button
                  className="w-[300px] text-xl rounded-xl mx-20"
                  onClick={handleCanceAuction}
                >
                  Huỷ phiên đấu giá
                </Button>
              </div>
              <div className="p-5 flex flex-row justify-between">
                <p className="text-2xl font-medium">Emergency pause</p>
                <div>
                  <Button
                    className="w-[200px] text-xl rounded-xl mx-40"
                    onClick={handlePause}
                  >
                    Pause
                  </Button>
                  <Button
                    className="w-[200px] text-xl rounded-xl"
                    onClick={handleUnpause}
                  >
                    Unpause
                  </Button>
                </div>
              </div>
              <div className="p-5 flex flex-row items-center justify-between">
                <p className="text-2xl font-medium">
                  Khoảng thời gian tối đa để trả tiền
                </p>
                <div className="flex justify-end gap-40">
                  <Input
                    type="text"
                    placeholder={""}
                    className={`w-[400px] !placeholder-opacity-80 !placeholder-white bg-[#475657] ${
                      disableInputs && "opacity-50"
                    }`}
                    name="deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    disabled={disableInputs}
                  />
                  <Button
                    className="w-[200px] text-xl rounded-xl "
                    onClick={handleSetDeadline}
                  >
                    Xác nhận
                  </Button>
                </div>
              </div>
              <div className="p-5 flex flex-row justify-between">
                <p className="text-2xl font-medium">Số tiền cọc</p>
                <div className="flex justify-end gap-40">
                  <Input
                    type="text"
                    placeholder={""}
                    className={`w-[400px] !placeholder-opacity-80 !placeholder-white bg-[#475657] ${
                      disableInputs && "opacity-50"
                    }`}
                    name="depositAmount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    disabled={disableInputs}
                  />
                  <Button
                    className="w-[200px] text-xl rounded-xl "
                    onClick={handleSetDepositAmount}
                  >
                    Xác nhận
                  </Button>
                </div>
              </div>
              <div className="p-5 flex flex-row justify-between">
                <p className="text-2xl font-medium">Thời gian cọc trước</p>
                <div className="flex justify-end gap-40">
                  <Input
                    type="text"
                    placeholder={""}
                    className={`w-[400px] !placeholder-opacity-80 !placeholder-white bg-[#475657] ${
                      disableInputs && "opacity-50"
                    }`}
                    name="depositTime"
                    value={depositTime}
                    onChange={(e) => setDepositTime(e.target.value)}
                    disabled={disableInputs}
                  />
                  <Button
                    className="w-[200px] text-xl rounded-xl "
                    onClick={handleSetDepositTime}
                  >
                    Xác nhận
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default dangKyDauGiaPage;

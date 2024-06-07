"use client";
import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { nftContractAbi } from "@/abi/nftContractAbi";
import InputImageBtn from "@/components/AddImage";
import { toast } from "react-toastify";
import { config } from "@/provider/RainbowProvider"; 

function dangKyBienSoPage(props) {
  const { address } = useAccount();
  const isConnected = useAccount().isConnected;
  console.log(isConnected);

  const [bienSo, setLicensePlate] = useState("");
  const [loaiXe, setVehicleType] = useState("");
  const [tinhThanhPho, setProvince] = useState("");
  const [anhBienSo, setAnhBienSo] = useState(null);
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

  const handleMintNFT = async () => {
    if (!authorized) {
      toast.error("Bạn không có quyền thực hiện hành động này.");
      return;
    }
    try {
      const hash = await writeContract(config, {
        abi: nftContractAbi,
        address: "0xbf35ff6953b0ec6F29DcB9982Ce71f7C7D0fF356",
        functionName: "safeMint",
        args: [address, bienSo, tinhThanhPho, loaiXe],
      });

      const finish = async () => {
        await waitForTransactionReceipt(config, {
          hash,
        });
      };

      toast.promise(finish(), {
        pending: "Process minting...",
        success: "Mint NFT successful!",
        error: "Mint NFT failed, please try again!",
      });
    } catch (error) {
      console.log("Error mint NFT: ", error);
      toast.error(error?.message || error?.reason);
    }
  };

  const saveNFT = async () => {

    try {
      const response = await fetch("http://localhost:5000/BienSo/save-all", {
        method: "POST"
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

  const disableInputs = !authorized;

  return (
    <main className="bg-[#475657] min-h-screen">
      <div className="text-white border-2 rounded-lg border-white p-10 m-5">
        <p className="mb-5 text-4xl font-semibold">Đăng kí biển số đấu giá</p>
        <div className="border-2 rounded-lg border-white ">
          <div className="flex justify-center items-center ">
            <div className="gap-8 flex flex-col">
              <div className="p-5 flex flex-row justify-start gap-36">
                <p className="text-2xl font-medium">Biển số</p>
                <div>
                  <Input
                    type="text"
                    placeholder={""}
                    className={`w-[280px] !placeholder-opacity-80 !placeholder-white bg-[#475657] ${
                      disableInputs && "opacity-50"
                    }`}
                    name="bienSo"
                    value={bienSo}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    disabled={disableInputs}
                  />
                </div>
              </div>
              <div className="p-5 flex flex-row justify-start gap-12">
                <p className="text-2xl font-medium">Tỉnh/Thành phố</p>
                <div>
                  <Input
                    type="text"
                    placeholder={""}
                    className={`w-[280px] !placeholder-opacity-80 !placeholder-white bg-[#475657] ${
                      disableInputs && "opacity-50"
                    }`}
                    name="tinhThanhPho"
                    value={tinhThanhPho}
                    onChange={(e) => setProvince(e.target.value)}
                    disabled={disableInputs}
                  />
                </div>
              </div>
              <div className="p-5 flex flex-row justify-start gap-[148px]">
                <p className="text-2xl font-medium">Loại xe</p>
                <div>
                  <Input
                    type="text"
                    placeholder={""}
                    className={`w-[280px] !placeholder-opacity-80 !placeholder-white bg-[#475657] ${
                      disableInputs && "opacity-50"
                    }`}
                    name="loaiXe"
                    value={loaiXe}
                    onChange={(e) => setVehicleType(e.target.value)}
                    disabled={disableInputs}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="justify-center flex my-5 gap-5">
            <Button
              className="w-[200px] text-xl rounded-xl"
              onClick={handleMintNFT}
            >
              Mint
            </Button>
            <Button
              className="w-[200px] text-xl rounded-xl"
              onClick={saveNFT}
            >
              Xác nhận biển số
            </Button>
          </div>
        </div>
        <div className="mt-5">
          <div className="!text-white items-center flex flex-row gap-5">
            <div className="text-xl font-medium">Ví liên kết</div>
            <Input
              disabled
              placeholder=""
              value={address}
              className="w-[540px] bg-[#475657] text-xl font-bold items-center"
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
      </div>
    </main>
  );
}

export default dangKyBienSoPage;

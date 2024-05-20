"use client";
import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { nftContractAbi } from "@/abi/nftContractAbi";
import InputImageBtn from "@/components/AddImage";
import { toast } from "react-toastify";
import { config } from "@/config/wagmiConfig";

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
        address: "0x47f515ED707abfB69Eab27224A9CB996528dA761",
        functionName: "safeMint",
        args: [address, bienSo, loaiXe, tinhThanhPho],
      });
      console.log('aa', hash);
      
      const finish = async () => {
        waitForTransactionReceipt(config, {
          hash,
        });

        toast.promise(finish(), {
          pending: "Process minting...",
          success: "Mint NFT successful!",
          error: "Mint NFT failed, please try again!",
        });
      };
    } catch (error) {
      console.log("Error mint NFT: ", error);
      toast.error(error?.message || error?.reason);
    }
  };

  const disableInputs = !authorized;

  return (
    <main className="bg-[#475657] min-h-screen">
      <div className="text-white border-2 rounded-lg border-white p-10 m-5">
        <p className="mb-5 text-4xl font-semibold">Đăng kí biển số đấu giá</p>
        <div className="border-2 rounded-lg border-white">
          <div className="flex justify-between items-center ">
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
            </div>
            <div className=" p-5 mr-48 flex flex-col justify-start gap-12">
              <div className=" text-2xl font-medium w-full text-center">
                Ảnh mặt trước
              </div>
              <InputImageBtn
                setUrlImg={setAnhBienSo}
                urlImg={anhBienSo}
                title={undefined}
                disabled={disableInputs}
              />
              <Button disabled={disableInputs}>Upload</Button>
            </div>
          </div>
          <div className="justify-center flex my-5">
            <Button
              className="w-[200px] text-xl rounded-xl"
              onClick={handleMintNFT}
            >
              Mint
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
      </div>
    </main>
  );
}

export default dangKyBienSoPage;

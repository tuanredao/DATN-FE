"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import InputImageBtn from "@/components/AddImage";

function infoPage(props) {
  const account = useAccount();
  console.log("acount", account.address);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    city: "",
    district: "",
    ward: "",
    dateOfBirth: undefined,
    placeOfBirth: "",
    frontImage: "",
    backImage: "",
    wallet: "",
    KYC: false
  });

  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [backImage, setBackImage] = useState(null);
  const [frontImage, setFrontImage] = useState(null);



  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/users/getUser?wallet=${account.address}`
      );
      if (response.ok) {
        const userData = await response.json();
        console.log("found", userData.userData);
        const info = userData.userData;
        console.log("info", info);
        console.log("api", response);

        if (userData) {
          setFormData(info);
          setUserInfo(info);
        }
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [account.address]);

  console.log(account.address);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...userInfo });
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      wallet: account.address,
      KYC: false
    }));
  };

  const handleUploadFront = () => {
    setFormData({ ...formData, frontImage: frontImage });
  };

  const handleUploadBack = () => {
    setFormData({ ...formData, backImage: backImage });
  };

  console.log("formData", formData);
  console.log("frontImage: ", frontImage);
  console.log("backImage: ", backImage);

  const handleDateChange = (date) => {
    setFormData({ ...formData, dateOfBirth: date });
  };

  const [saveStatus, setSaveStatus] = useState(null);

  const handleSubmit = async () => {
    try {
      let updatedFormData = { ...formData };
      console.log("formData", formData);

      console.log("update", updatedFormData);

      if (updatedFormData.hasOwnProperty("wallet")) {
        delete updatedFormData.wallet;
      }

      let apiUrl, method, dataToSend;

      console.log("userInfo", userInfo);

      if (userInfo) {
        apiUrl = `http://localhost:5000/users/edit/?wallet=${account.address}`;
        method = "PUT";
        dataToSend = JSON.stringify(updatedFormData);
      } else {
        apiUrl = "http://localhost:5000/users/add";
        method = "POST";
        dataToSend = JSON.stringify(formData);
      }

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: dataToSend,
      });

      console.log("dataToSend", dataToSend);

      if (response.ok) {
        console.log("User data updated successfully");
        setIsEditing(false);
        setSaveStatus("success");
      } else {
        setIsEditing(false);
        setSaveStatus("error");
        console.error("Error updating user data", response);
      }
    } catch (error) {
      console.error("Error updating user data", error);
      setSaveStatus("error");
    }
  };

  return (
    <div className="text-white p-10">
      <div className=" border-2 rounded-lg border-white w-full p-10">
        <h1 className="">Thông tin cá nhân</h1>
        <div className="border-2 rounded-lg border-white p-5 flex justify-between">
          <div>
            <div className="">Họ và tên</div>
            <Input
              type="text"
              placeholder={""}
              value={formData?.fullName || ""}
              className="w-[280px] !placeholder-opacity-80 !placeholder-white bg-[#475657] "
              name="fullName"
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <div className=" ">Số điện thoại</div>
            <Input
              type="text"
              value={formData?.phoneNumber || ""}
              className="w-[280px] !placeholder-opacity-80 !placeholder-white bg-[#475657]"
              name="phoneNumber"
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <div className=" ">Email</div>
            <Input
              type="text"
              value={formData?.email || ""}
              className="w-[280px] !placeholder-opacity-80 !placeholder-white bg-[#475657]"
              name="email"
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <h1>Địa chỉ cư trú</h1>
        <div className="border-2 rounded-lg border-white p-5 flex justify-between">
          <div>
            <div className=" ">Tỉnh/Thành phố</div>
            <Input
              type="text"
              value={formData?.city || ""}
              className="w-[280px] !placeholder-opacity-80 !placeholder-white bg-[#475657]"
              name="city"
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <div className=" ">Quận/Huyện</div>
            <Input
              type="text"
              value={formData?.district || ""}
              className="w-[280px] !placeholder-opacity-100 !placeholder-white bg-[#475657]"
              name="district"
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <div className=" ">Phường/Xã</div>
            <Input
              type="text"
              value={formData?.ward || ""}
              className="w-[280px] !placeholder-opacity-80 !placeholder-white bg-[#475657]"
              name="ward"
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        <h1>Căn cước công dân</h1>
        <div className="border-2 rounded-lg border-white p-5 flex justify-between">
          <div className="flex justify-center flex-col">
            <div className=" ">Ngày cấp</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] !placeholder-opacity-80 !placeholder-white justify-start text-left font-normal bg-[#475657]",
                    !formData?.dateOfBirth && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 " />
                  {formData?.dateOfBirth ? (
                    format(formData?.dateOfBirth, "PPP")
                  ) : (
                    <span className=" ">Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 ">
                <Calendar
                  mode="single"
                  selected={formData?.dateOfBirth}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-center flex-col">
            <div className="">Nơi cấp</div>
            <Input
              type="text"
              value={formData?.placeOfBirth || ""}
              className="w-[280px] !placeholder-opacity-80 !placeholder-white bg-[#475657]"
              name="placeOfBirth"
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className=" flex justify-center flex-col">
            <div className="w-full text-center">Ảnh mặt trước</div>
            <InputImageBtn
              setUrlImg={setFrontImage}
              urlImg={frontImage || formData?.frontImage }
              title={undefined}
              disabled={!isEditing}
            />
            <Button onClick={handleUploadFront}>Upload</Button>
          </div>

          <div className=" flex justify-center flex-col">
            <div className="w-full text-center">Ảnh mặt sau</div>
            <InputImageBtn
              setUrlImg={setBackImage}
              urlImg={backImage || formData?.backImage}
              title={undefined}
              disabled={!isEditing}
            />
            <Button onClick={handleUploadBack}>Upload</Button>
            {/* <img src={formData?.frontImage} alt="" /> */}
          </div>
        </div>
        <h1>Ví liên kết </h1>
        <div className="border-2 rounded-lg border-white p-5 flex justify-between">
          <div className="!text-white items-center">
            <div className="">Ví liên kết</div>
            <Input
              disabled
              placeholder=""
              value={account.address}
              className="w-[520px] bg-[#475657] content-center text-xl font-bold"
            />
          </div>
        </div>
        <div className="pt-5 grid grid-cols-37 ">
          <div>
          {saveStatus === "success" && (
            <div className="text-green-500">
              Thay đổi đã được lưu thành công.
            </div>
          )}
          {saveStatus === "error" && (
            <div className="text-red-500">Đã xảy ra lỗi khi lưu thông tin.</div>
          )}
          </div>
          <div className={`flex justify-center w-full gap-10 pt-5 pr-[400px]` }>
            <Button
              variant="outline"
              className={`rounded-full ${
                isEditing ? "bg-[#62929E]" : "bg-gray-400"
              }`}
              disabled={!isEditing}
              onClick={handleSubmit}
            >
              Lưu thông tin
            </Button>

            <Button
              variant="outline"
              className=" bg-[#3C0000] rounded-full"
              onClick={handleEdit}
            >
              Sửa thông tin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default infoPage;

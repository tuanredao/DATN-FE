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
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import SearchUser from "@/components/SearchUser"; // adjust the import path if necessary

function ManageUsersPage(props) {
  const [auctionHistoryData, setAuctionHistoryData] = useState<any>();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchTrangThai, setSearchTrangThai] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/users/all");
        const data = await response.json();
        setAuctionHistoryData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleVerifyKYC = async (wallet) => {
    try {
      const response = await fetch(
        `http://localhost:5000/users/updateKYC?wallet=${wallet}`,
        {
          method: "PATCH",
        }
      );
      const data = await response.json();

      if (response.ok && data.message !== "Failed to update KYC status") {
        toast.success("KYC đã được xác minh thành công!");
      } else {
        console.error("Failed to update KYC status");
        toast.error("Không thể cập nhật trạng thái KYC.");
      }
    } catch (error) {
      console.error("Error updating KYC status:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái KYC.");
    }
  };

  const filteredUsers = auctionHistoryData?.users?.filter((item) => {
    const nameMatch = item.fullName
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const statusMatch =
      searchTrangThai === ""
        ? true
        : searchTrangThai === "true"
        ? item.KYC
        : !item.KYC;
    return nameMatch && statusMatch;
  });

  return (
    <main className="bg-[#475657] min-h-screen items-center">
      <div className="flex items-center justify-center">
        <p className="px-5 pl-7 pt-3 text-white text-3xl font-bold">
          Danh sách người dùng
        </p>
      </div>

      <div className="bg-[#4A6D7C] mt-8 !border !border-white !rounded-lg m-5 !text-white"></div>
      <div className="pb-10 flex justify-center items-center">
        <SearchUser
          searchTrangThai={searchTrangThai}
          setSearchTrangThai={setSearchTrangThai}
          searchName={searchName}
          setSearchName={setSearchName}
        />
      </div>
      <div className="bg-[#4A6D7C] mt-8 !border !border-white !rounded-lg m-5 !text-white justify-between">
        <Table className="text-white">
          <TableHeader className="!text-center">
            <TableRow className="!text-white">
              <TableHead className="w-[100px] text-center">STT</TableHead>
              <TableHead className="text-center">Tên</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.map((item, index) => (
              <React.Fragment key={item._id}>
                <TableRow
                  className="text-white align-middle m-3 cursor-pointer"
                  onClick={() => handleRowClick(index)}
                >
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{item.fullName}</TableCell>
                  <TableCell className="text-center">
                    {item.KYC ? "Đã KYC" : "Chưa KYC"}
                  </TableCell>
                </TableRow>
                {expandedIndex === index && (
                  <TableRow className="text-white">
                    <TableCell colSpan={3} className="bg-[#4A6D7C] p-5">
                      <div className="bg-[#4A6D7C] !text-white px-8 m-5 rounded-lg flex flex-col gap-10 ">
                        <div className="flex flex-row justify-between items-center">
                          <div className="flex flex-col justify-between">
                            <p className="text-2xl mb-4 font-bold">
                              {item.fullName}
                            </p>
                            <p>
                              <strong>Email:</strong> {item.email}
                            </p>
                            <p>
                              <strong>Số điện thọai:</strong> {item.phoneNumber}
                            </p>
                            <p>
                              <strong>Tỉnh/Thành phố:</strong> {item.city}
                            </p>
                            <p>
                              <strong>Quận/Huyện:</strong> {item.district}
                            </p>
                            <p>
                              <strong>Phường/Xã:</strong> {item.ward}
                            </p>
                            <p>
                              <strong>Ngày sinh:</strong>{" "}
                              {new Date(item.dateOfBirth).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Nơi sinh:</strong> {item.placeOfBirth}
                            </p>
                            <p>
                              <strong>Địa chỉ ví:</strong> {item.wallet}
                            </p>
                          </div>
                          <img
                            src={item.frontImage}
                            alt="Front ID"
                            className="w-80 h-48 object-cover"
                          />
                          <img
                            src={item.backImage}
                            alt="Back ID"
                            className="w-80 h-48 object-cover"
                          />
                        </div>
                        <div className="flex flex-row justify-center items-center">
                          <Button
                            className="w-[200px] text-xl rounded-xl"
                            onClick={() => handleVerifyKYC(item.wallet)}
                          >
                            Xác minh KYC
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}

export default ManageUsersPage;

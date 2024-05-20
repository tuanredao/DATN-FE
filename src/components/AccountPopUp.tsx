"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAccount } from "wagmi";
import Image from "next/image";
import profile from "./ui/icon/profile.png";

function NewDepositoryBtn() {
  const node = useRef();
  const [isOpen, toggleOpen] = useState(false);
  const { address } = useAccount();

  const toggleOpenMenu = () => {
    toggleOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      // @ts-ignore
      if (node?.current?.contains(e.target)) {
        return;
      }
      toggleOpen(false);
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const subMenuAnimate = {
    enter: {
      opacity: 1,
      rotateX: 0,
      y: 5,
      x: -97,
      transition: {
        duration: 0.2,
      },
      display: "block",
    },
    exit: {
      opacity: 0,
      rotateX: -15,
      x: -97,
      transition: {
        duration: 0.2,
        delay: 0.05,
      },
      transitionEnd: {
        display: "none",
      },
    },
  };

  return (
    <div className={``}>
      <div className="cursor-pointer" ref={node} onClick={toggleOpenMenu}>
          <Image src={profile} alt="profile" width={50} height={50} />
      </div>
      <motion.div
        initial="exit"
        animate={isOpen ? "enter" : "exit"}
        variants={subMenuAnimate}
        className={`absolute w-[215px] rounded-md dark:bg-bgDark z-[1] dark:text-textDark bg-white`}
      >
        <div className="bg-white text-black rounded-lg cursor-pointer">
          <Link href="/info">
            <div className=" px-4 py-2 border-b-[2px] border-b-black hover:bg-gray-300">
              Thông tin cá nhân
            </div>
          </Link>

          <Link href="/myNFT">
            <div className=" px-4 py-2 border-b-[2px] border-b-black hover:bg-gray-300">
            Thông tin tài khoản
            </div>
          </Link>

          <Link href="/myauctionsistory">
            <div className=" px-4 py-2 border-b-[2px] border-b-black hover:bg-gray-300">
              Lịch sử đấu giá
            </div>
          </Link>
          <Link href="/dangkidaugia">
            <div className=" px-4 py-2 border-b-[2px] border-b-black hover:bg-gray-300">
              Quản lý biển số xe
            </div>
          </Link>
          <Link href="/dangkidaugia">
            <div className=" px-4 py-2 border-b-[2px] border-b-black hover:bg-gray-300">
              Quản lý phiên đấu giá
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default NewDepositoryBtn;

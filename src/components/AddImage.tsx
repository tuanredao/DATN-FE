import { IKUpload } from "imagekitio-react";
import React from "react";
import Image from "next/image";

function InputImageBtn({
  setUrlImg,
  urlImg,
  title,
  className = "",
  disabled = false,
}) {
  const onError = (error: any) => {
    console.log("upload error", error);
  };

  const onSuccess = (res: any) => {
    const newUrl = res?.url;
    setUrlImg(newUrl);
  };

  return (
    <div
      className={`flex flex-col items-center pb-5 `}
    >
      <p className="mb-1 text-sm text-gray">{title}</p>
      <label>
        <div className={`cursor-pointer relative w-[200px] h-[150px] ${className}`}>
          {urlImg ? (
            <Image
              src={urlImg}
              alt="avatar"
              fill
              className=""
            />
          ) : (
            <div className="border rounded-full px-3 text-center">
              
                Chọn ảnh
              
            </div>
          )}
        </div>
        <IKUpload
          className="hidden"
          onError={onError}
          onSuccess={onSuccess}
          disabled={disabled}
        />
      </label>
    </div>
  );
}

export default InputImageBtn;
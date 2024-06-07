"use client";

import * as React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { IKContext, IKUpload } from "imagekitio-react";
import ImageKit from "imagekit";
import { RainbowProvider } from "@/provider/RainbowProvider";



const queryClient = new QueryClient();

const IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/datn";

const IMAGEKIT_PUBLIC_KEY = "public_oW5FhbplbrUV7qMKxf7PzD4thA8=";

const IMAGEKIT_PRIVATE_KEY = "private_NPHCcYKJlrn4d+vl6ApL3Vl83UY=";

export function Providers({ children }: { children: React.ReactNode }) {
  const imageKit = new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
  });

  const authenticator = async () => {
    try {
      const response = imageKit.getAuthenticationParameters();

      if (!response) {
        throw new Error(`FetAuthenticationParameters function failed!`);
      }

      const { signature, expire, token } = response;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };
  return (
    <IKContext
      urlEndpoint={IMAGEKIT_URL_ENDPOINT}
      publicKey={IMAGEKIT_PUBLIC_KEY}
      authenticator={authenticator}
    >
      
    <RainbowProvider >
      <QueryClientProvider client={queryClient}>
   {children}
      </QueryClientProvider>
    </RainbowProvider>
    </IKContext>
  );
}

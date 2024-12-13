"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NextPage } from "next";
import { TypedDataDefinition } from "viem";
import { SignatureMessage } from "~~/components/signatorio/SignatureMessage";
import { SignaturesList } from "~~/components/signatorio/SignaturesList";
import { useSignatureVerification } from "~~/hooks/signatorio/useSignatureVerification";
import { useTypedDataHighlight } from "~~/hooks/signatorio/useTypedDataHighlight";

const ViewSignature: NextPage<{
  searchParams: { [key: string]: string | string[] | undefined };
}> = ({ searchParams: _ }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const message = searchParams.get("message");
  const rawTypedData = searchParams.get("typedData");
  const [typedData, setTypedData] = useState<TypedDataDefinition | null>(null);
  const [signatures, setSignatures] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<string[]>([]);

  const addressChecks = useSignatureVerification(message, typedData, signatures, addresses);
  const highlightedTypedData = useTypedDataHighlight(typedData);

  // Handle initial data from search params
  useEffect(() => {
    const sigs = searchParams.get("signatures") || "";
    const addrs = searchParams.get("addresses") || "";
    setSignatures(sigs ? sigs.split(",") : []);
    setAddresses(addrs ? addrs.split(",") : []);
  }, [searchParams]);

  // Parse typed data from URL
  useEffect(() => {
    if (rawTypedData) {
      try {
        setTypedData(JSON.parse(decodeURIComponent(rawTypedData)));
      } catch (error) {
        console.error("Failed to parse typed data:", error);
      }
    }
  }, [rawTypedData]);

  if (!message && !rawTypedData) {
    router.push("/");
    return null;
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 container max-w-screen-sm">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body gap-4">
            <SignatureMessage message={message} typedData={typedData} highlightedTypedData={highlightedTypedData} />
            <SignaturesList signatures={signatures} addresses={addresses} addressChecks={addressChecks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSignature;

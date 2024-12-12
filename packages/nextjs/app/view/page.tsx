"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignatureMessage } from "./_components/SignatureMessage";
import { SignaturesList } from "./_components/SignaturesList";
import { useIpfsData } from "./_components/useIpfsData";
import { useSignatureVerification } from "./_components/useSignatureVerification";
import { useTypedDataHighlight } from "./_components/useTypedDataHighlight";
import { TypedDataDefinition } from "viem";

const ViewSignature: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [message, setMessage] = useState(searchParams.get("message"));
  const rawTypedData = searchParams.get("typedData");
  const ipfs = searchParams.get("ipfs");
  const [typedData, setTypedData] = useState<TypedDataDefinition | null>(null);
  const [signatures, setSignatures] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<string[]>([]);

  const addressChecks = useSignatureVerification(message, typedData, signatures, addresses);
  const highlightedTypedData = useTypedDataHighlight(typedData);

  useIpfsData(ipfs, {
    setMessage,
    setTypedData,
    setSignatures,
    setAddresses,
  });

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

  if (!message && !rawTypedData && !ipfs) {
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

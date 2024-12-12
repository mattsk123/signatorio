"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignatureMessage } from "./_components/SignatureMessage";
import { SignaturesList } from "./_components/SignaturesList";
import { useSignatureVerification } from "./_components/useSignatureVerification";
import { codeToHtml } from "shiki";
import { TypedDataDefinition } from "viem";

const ViewSignature: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const message = searchParams.get("message");
  const rawTypedData = searchParams.get("typedData");
  const [typedData, setTypedData] = useState<TypedDataDefinition | null>(null);
  const [signatures, setSignatures] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [highlightedTypedData, setHighlightedTypedData] = useState<string | null>(null);

  const addressChecks = useSignatureVerification(message, typedData, signatures, addresses);

  useEffect(() => {
    const sigs = searchParams.get("signatures") || "";
    const addrs = searchParams.get("addresses") || "";
    setSignatures(sigs ? sigs.split(",") : []);
    setAddresses(addrs ? addrs.split(",") : []);
  }, [searchParams]);

  useEffect(() => {
    if (rawTypedData) {
      try {
        setTypedData(JSON.parse(decodeURIComponent(rawTypedData)));
      } catch (error) {
        console.error("Failed to parse typed data:", error);
      }
    }
  }, [rawTypedData]);

  useEffect(() => {
    if (!typedData) return;

    const highlightTypedData = async () => {
      const html = await codeToHtml(JSON.stringify(typedData, null, 2), {
        lang: "json",
        themes: { light: "min-light", dark: "nord" },
      });
      setHighlightedTypedData(html);
    };

    highlightTypedData();
  }, [typedData]);

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

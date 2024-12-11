"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignMessage } from "./_components/SignMessage";
import { SignTypedData } from "./_components/SignTypedData";
import { TypedDataChecks, eip712Example } from "./_components/types";
import { NextPage } from "next";
import { useLocalStorage } from "usehooks-ts";
import { hashTypedData } from "viem";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { address } = useAccount();
  const router = useRouter();
  const [messageText, setMessageText] = useLocalStorage("messageText", "hello ethereum");
  const [typedData, setTypedData] = useLocalStorage("typedData", eip712Example);
  const [manualTypedData, setManualTypedData] = useLocalStorage(
    "manualTypedData",
    JSON.stringify(eip712Example, null, 4),
  );
  const [invalidJson, setInvalidJson] = useState(false);
  const [typedDataChecks, setTypedDataChecks] = useState<TypedDataChecks>({
    types: true,
    message: true,
  });

  useEffect(() => {
    if (typedData) {
      const checks: TypedDataChecks = {
        types: "types" in typedData,
        message: "message" in typedData,
      };
      try {
        checks.hash = hashTypedData(typedData);
      } catch (e) {
        console.log("failed to compute hash", e);
      }
      setTypedDataChecks(checks);
    }
  }, [typedData]);

  const handleSignature = (signature: string, params: Record<string, string>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, value);
    });
    searchParams.set("signatures", signature);
    searchParams.set("addresses", address ?? "");
    router.push(`/view?${searchParams.toString()}`);
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 container max-w-screen-sm">
        <h1 className="text-center">
          <span className="block text-2xl mb-2">Welcome to</span>
          <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
        </h1>

        <div className="flex flex-col">
          <SignMessage
            messageText={messageText}
            setMessageText={setMessageText}
            onSign={signature => handleSignature(signature, { message: messageText })}
          />

          <div className="divider">OR</div>

          <SignTypedData
            manualTypedData={manualTypedData}
            setManualTypedData={setManualTypedData}
            typedData={typedData}
            setTypedData={setTypedData}
            invalidJson={invalidJson}
            setInvalidJson={setInvalidJson}
            typedDataChecks={typedDataChecks}
            setTypedDataChecks={setTypedDataChecks}
            onSign={signature =>
              handleSignature(signature, {
                typedData: encodeURIComponent(JSON.stringify(typedData)),
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Home;

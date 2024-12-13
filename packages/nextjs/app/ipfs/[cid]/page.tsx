"use client";

import { useState } from "react";
import { NextPage } from "next";
import { TypedDataDefinition } from "viem";
import { useIpfsData } from "~~/app/ipfs/[cid]/_components/useIpfsData";
import { SignatureMessage } from "~~/components/signatorio/SignatureMessage";
import { SignaturesList } from "~~/components/signatorio/SignaturesList";
import { useSignatureVerification } from "~~/hooks/signatorio/useSignatureVerification";

const ViewIpfsSignature: NextPage<{ params: { cid: string } }> = ({ params }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [typedData, setTypedData] = useState<TypedDataDefinition | null>(null);
  const [signatures, setSignatures] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<string[]>([]);

  const addressChecks = useSignatureVerification(message, typedData, signatures, addresses);

  useIpfsData(params.cid, {
    setMessage,
    setTypedData,
    setSignatures,
    setAddresses,
  });

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 container max-w-screen-sm">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body gap-4">
            <p className="whitespace-nowrap overflow-ellipsis overflow-hidden -mb-4">
              Retrieved from IPFS: <span className="font-mono">{params.cid}</span>
            </p>

            <SignatureMessage message={message} typedData={typedData} />
            <SignaturesList signatures={signatures} addresses={addresses} addressChecks={addressChecks} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewIpfsSignature;

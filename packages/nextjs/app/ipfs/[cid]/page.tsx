"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { NextPage } from "next";
import { TypedDataDefinition } from "viem";
import { useIpfsData } from "~~/app/ipfs/[cid]/_components/useIpfsData";
import { SignatureMessage } from "~~/components/signatorio/SignatureMessage";
import { SignaturesList } from "~~/components/signatorio/SignaturesList";
import { useSignatureVerification } from "~~/hooks/signatorio/useSignatureVerification";
import { useTypedDataHighlight } from "~~/hooks/signatorio/useTypedDataHighlight";

const ViewIpfsSignature: NextPage<{ params: { cid: string } }> = ({ params }) => {
  const searchParams = useSearchParams();

  const [message, setMessage] = useState(searchParams.get("message"));
  const [typedData, setTypedData] = useState<TypedDataDefinition | null>(null);
  const [signatures, setSignatures] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<string[]>([]);

  const addressChecks = useSignatureVerification(message, typedData, signatures, addresses);
  const highlightedTypedData = useTypedDataHighlight(typedData);

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
            <SignatureMessage message={message} typedData={typedData} highlightedTypedData={highlightedTypedData} />
            <SignaturesList signatures={signatures} addresses={addresses} addressChecks={addressChecks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewIpfsSignature;

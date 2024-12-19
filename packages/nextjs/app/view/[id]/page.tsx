"use client";

import { useEffect, useState } from "react";
import { NextPage } from "next";
import { TypedDataDefinition } from "viem";
import { SignatureMessage } from "~~/components/signatorio/SignatureMessage";
import { SignaturesList } from "~~/components/signatorio/SignaturesList";
import { useSignatureVerification } from "~~/hooks/signatorio/useSignatureVerification";
import { messagesTable, signaturesTable } from "~~/services/db/schema";

const ViewSignature: NextPage<{ params: { id: string } }> = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const [message, setMessage] = useState<string | null>(null);
  const [typedData, setTypedData] = useState<TypedDataDefinition | null>(null);
  const [signatures, setSignatures] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<string[]>([]);

  const addressChecks = useSignatureVerification(message, typedData, signatures, addresses);

  useEffect(() => {
    const fetchMessage = async () => {
      const res = await fetch(`/api/signatures/${id}`);
      const { message, signatures } = (await res.json()) as {
        message: typeof messagesTable.$inferSelect;
        signatures: (typeof signaturesTable.$inferSelect)[];
      };
      if (message.type === "text") {
        setMessage(message?.message);
      } else if (message.type === "typed_data") {
        setTypedData(JSON.parse(message?.message));
      } else {
        throw new Error("Invalid message type");
      }

      setSignatures(signatures.map(s => s.signature));
      setAddresses(signatures.map(s => s.signer));
    };

    fetchMessage();
  }, [id]);

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 container max-w-screen-sm">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body gap-4">
            <SignatureMessage message={message} typedData={typedData} />
            <SignaturesList signatures={signatures} addresses={addresses} addressChecks={addressChecks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSignature;

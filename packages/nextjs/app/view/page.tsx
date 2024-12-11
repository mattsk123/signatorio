"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  type Address as AddressType,
  type Client,
  type Hex,
  TypedDataDefinition,
  hashMessage,
  hashTypedData,
  isAddress,
  isHex,
  recoverMessageAddress,
  recoverTypedDataAddress,
} from "viem";
import { getCode, readContract } from "viem/actions";
import { useClient } from "wagmi";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

enum SignatureStatus {
  INVALID = "INVALID",
  MATCH = "MATCH",
  MISMATCH = "MISMATCH",
}

const EIP1271_SPEC = {
  magicValue: "0x1626ba7e",
  abi: [
    {
      constant: true,
      inputs: [
        { name: "_hash", type: "bytes32" },
        { name: "_sig", type: "bytes" },
      ],
      name: "isValidSignature",
      outputs: [{ name: "magicValue", type: "bytes4" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ],
} as const;

interface SignatureStatusIconProps {
  status: SignatureStatus | undefined;
}

const SignatureStatusIcon: React.FC<SignatureStatusIconProps> = ({ status }) => {
  if (status === SignatureStatus.MATCH) {
    return (
      <div
        className="p-1 rounded-full bg-success text-success-content tooltip before:max-w-48 float-start"
        data-tip="The provided signature matches the address."
      >
        <CheckCircleIcon className="w-4 h-4" />
      </div>
    );
  }

  if (status === SignatureStatus.MISMATCH) {
    return (
      <div
        className="p-1 rounded-full bg-error text-error-content tooltip before:max-w-48 float-start"
        data-tip="The provided signature DOES NOT match the address."
      >
        <ExclamationCircleIcon className="w-4 h-4" />
      </div>
    );
  }

  if (!status) {
    return (
      <div className="p-1 rounded-full bg-warning text-warning-content tooltip h-6" data-tip="Verifying signature...">
        <div className="loading loading-xs h-4" />
      </div>
    );
  }

  return (
    <div
      className="p-1 rounded-full bg-error text-error-content tooltip before:max-w-48 float-start"
      data-tip="Something went wrong while verifying the signature. It might not be valid!"
    >
      <ExclamationCircleIcon className="w-4 h-4" />
    </div>
  );
};

const checkEip1271 = async (
  client: Client,
  address: AddressType,
  message: string,
  signature: Hex,
): Promise<SignatureStatus> => {
  try {
    const addressCode = await getCode(client, { address });
    if (!addressCode || addressCode === "0x") {
      return SignatureStatus.MISMATCH;
    }

    const returnValue = await readContract(client, {
      address,
      abi: EIP1271_SPEC.abi,
      functionName: "isValidSignature",
      args: [message, signature],
    });

    return returnValue === EIP1271_SPEC.magicValue ? SignatureStatus.MATCH : SignatureStatus.MISMATCH;
  } catch (error) {
    console.error("EIP1271 check failed:", error);
    return SignatureStatus.MISMATCH;
  }
};

const VERIFICATION_DELAY = 1000; // 1 second

const ViewSignature: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const client = useClient();

  const message = searchParams.get("message");
  const rawTypedData = searchParams.get("typedData");
  const [typedData, setTypedData] = useState<TypedDataDefinition | null>(null);
  const [signatures, setSignatures] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [addressChecks, setAddressChecks] = useState<SignatureStatus[]>([]);

  useEffect(() => {
    const sigs = searchParams.get("signatures") || "";
    const addrs = searchParams.get("addresses") || "";
    setSignatures(sigs ? sigs.split(",") : []);
    setAddresses(addrs ? addrs.split(",") : []);
  }, [searchParams]);

  useEffect(() => {
    if (!client || (!message && !typedData) || !signatures.length || !addresses.length) return;

    const verifySignatures = async () => {
      const checks = await Promise.all(
        signatures.map(async (sig, index) => {
          if (index + 1 > addresses.length || !isAddress(addresses[index]) || !isHex(sig)) {
            return SignatureStatus.INVALID;
          }

          try {
            const signingAddress = message
              ? await recoverMessageAddress({ message, signature: sig })
              : await recoverTypedDataAddress({ ...typedData, signature: sig });

            if (!signingAddress) return SignatureStatus.INVALID;

            if (signingAddress.toLowerCase() === addresses[index].toLowerCase()) {
              return SignatureStatus.MATCH;
            }

            const messageHash = message ? hashMessage(message) : hashTypedData(typedData);
            if (!messageHash) return SignatureStatus.INVALID;

            return checkEip1271(client, addresses[index], messageHash, sig);
          } catch (error) {
            console.error(`Signature verification failed for ${sig}:`, error);
            return SignatureStatus.INVALID;
          }
        }),
      );

      setAddressChecks(checks);
    };

    verifySignatures();
  }, [signatures, message, client, addresses]);

  useEffect(() => {
    if (rawTypedData) {
      try {
        setTypedData(JSON.parse(decodeURIComponent(rawTypedData)));
      } catch (error) {
        console.error("Failed to parse typed data:", error);
      }
    }
  }, [rawTypedData, setTypedData]);

  if (!message && !rawTypedData) {
    router.push("/");
    return null;
  }

  return (
    <div className="flex flex-col max-w-xl mx-auto p-4 space-y-4">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body gap-4">
          <div>
            {message && (
              <>
                <h2 className="card-title">Message</h2>
                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-xs font-mono text-base-content break-all my-0">{message}</p>
                </div>
              </>
            )}

            {typedData && (
              <>
                <h2 className="card-title">Typed Data</h2>
                <div className="bg-base-200 p-4 rounded-lg">
                  <pre className="text-xs font-mono text-base-content break-all my-0">
                    {JSON.stringify(typedData, null, 2)}
                  </pre>
                </div>
              </>
            )}
          </div>

          <div>
            <h2 className="card-title">Signatures</h2>
            {signatures.map((signature, index) => (
              <div key={index} className="bg-base-200 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Address address={addresses[index]} />
                  <div className="flex-grow" />
                  <div className="text-xs">
                    <SignatureStatusIcon status={addressChecks[index]} />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-mono text-base-content/70 break-all mb-0">{signature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSignature;

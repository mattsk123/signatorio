"use client";

import LoadingButton from "./LoadingButton";
import { TypedDataChecks } from "./types";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useSignTypedData } from "wagmi";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

type TypedDataProps = {
  manualTypedData: string;
  setManualTypedData: (value: string) => void;
  typedData: any;
  setTypedData: (value: any) => void;
  invalidJson: boolean;
  setInvalidJson: (value: boolean) => void;
  typedDataChecks: TypedDataChecks;
  setTypedDataChecks: (checks: TypedDataChecks) => void;
  onSign: (signature: string) => void;
};

export const SignTypedData = ({
  manualTypedData,
  setManualTypedData,
  typedData,
  setTypedData,
  invalidJson,
  setInvalidJson,
  typedDataChecks,
  setTypedDataChecks,
  onSign,
}: TypedDataProps) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { signTypedDataAsync, isPending } = useSignTypedData();

  const handleTypedDataChange = (value: string) => {
    try {
      setManualTypedData(value);
      const newTypedData = JSON.parse(value);
      setTypedData(newTypedData);
      setInvalidJson(false);
    } catch (error) {
      console.log(error);
      setInvalidJson(true);
      setTypedDataChecks({ types: false, message: false });
    }
  };

  const handleSignTypedData = async () => {
    if (!typedDataChecks.hash) return;
    const signature = await signTypedDataAsync(typedData);
    onSign(signature);
  };

  return (
    <>
      <textarea
        value={manualTypedData}
        className={`textarea font-mono leading-tight ${invalidJson ? "textarea-error" : ""}`}
        rows={20}
        onChange={e => handleTypedDataChange(e.target.value)}
      />

      <div className="flex flex-col gap-2 mt-4">
        <ValidationMessages invalidJson={invalidJson} typedDataChecks={typedDataChecks} />
      </div>

      <LoadingButton
        onClick={isConnected ? handleSignTypedData : openConnectModal}
        disabled={isPending}
        isLoading={isPending}
        loadingText="Signing..."
        defaultText={isConnected ? "Sign Typed Data" : "Connect Wallet"}
      />
    </>
  );
};

const ValidationMessages = ({
  invalidJson,
  typedDataChecks,
}: {
  invalidJson: boolean;
  typedDataChecks: TypedDataChecks;
}) => (
  <>
    {invalidJson && (
      <div className="alert alert-error flex items-center">
        <ExclamationCircleIcon className="w-6 h-6" />
        Invalid JSON
      </div>
    )}
    {!typedDataChecks.types && <div className="alert alert-error">Missing types in typed data</div>}
    {!typedDataChecks.message && <div className="alert alert-error">Missing message in typed data</div>}
    {!invalidJson && !typedDataChecks.hash && <div className="alert alert-error">Invalid EIP-712 input data</div>}
  </>
);

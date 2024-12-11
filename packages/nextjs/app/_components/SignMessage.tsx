"use client";

import LoadingButton from "./LoadingButton";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";

type SignMessageProps = {
  messageText: string;
  setMessageText: (value: string) => void;
  onSign: (signature: string) => void;
};

export const SignMessage = ({ messageText, setMessageText, onSign }: SignMessageProps) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { signMessageAsync, isPending } = useSignMessage();

  const handleSign = async () => {
    const signature = await signMessageAsync({ message: messageText });
    onSign(signature);
  };

  return (
    <>
      <textarea className="textarea" value={messageText} onChange={e => setMessageText(e.target.value)} />
      <LoadingButton
        onClick={isConnected ? handleSign : openConnectModal}
        disabled={isPending}
        isLoading={isPending}
        loadingText="Signing..."
        defaultText={isConnected ? "Sign Message" : "Connect Wallet"}
      />
    </>
  );
};

"use client";

import { useRouter } from "next/navigation";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useLocalStorage } from "usehooks-ts";
import { useAccount, useSignMessage } from "wagmi";

const Home: NextPage = () => {
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [messageText, setMessageText] = useLocalStorage("messageText", "hello ethereum");
  const { signMessageAsync, isPending } = useSignMessage();

  const router = useRouter();

  const sign = async () => {
    const signature = await signMessageAsync({
      message: messageText,
    });

    const searchParams = new URLSearchParams();
    searchParams.set("message", messageText);
    searchParams.set("signatures", signature);
    searchParams.set("addresses", address ?? "");

    router.push(`/view?${searchParams.toString()}`);
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>

          <div className="flex flex-col">
            <textarea
              className="textarea"
              value={messageText}
              onChange={e => {
                setMessageText(e.target.value);
              }}
            ></textarea>

            <button
              className="btn btn-primary mt-4"
              onClick={isConnected ? sign : openConnectModal}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <div className="loading" />
                  Signing...
                </>
              ) : isConnected ? (
                "Sign Message"
              ) : (
                "Connect Wallet"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

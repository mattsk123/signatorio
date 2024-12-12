import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TypedDataDefinition } from "viem";

interface IpfsData {
  msg?: string;
  data?: any;
  address?: string;
  sig?: string;
}

interface UseIpfsDataReturn {
  setMessage: (message: string | null) => void;
  setTypedData: (data: TypedDataDefinition | null) => void;
  setSignatures: (signatures: string[]) => void;
  setAddresses: (addresses: string[]) => void;
}

export const useIpfsData = (
  ipfs: string | null,
  { setMessage, setTypedData, setSignatures, setAddresses }: UseIpfsDataReturn,
) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchFromIpfs = async () => {
      if (!ipfs) return;

      try {
        const response = await fetch(`https://pineapple.fyi/ipfs/${ipfs}`);
        const data: IpfsData = await response.json();

        const newSearchParams = new URLSearchParams(searchParams);

        if (data.msg || data.data) {
          if (data.msg) {
            setMessage(data.msg);
            newSearchParams.set("message", data.msg);
          }

          if (data.data) {
            const enhancedData = { primaryType: "Vote", ...data.data };
            const compressedData = JSON.stringify(enhancedData);
            newSearchParams.set("typedData", encodeURIComponent(compressedData));
            setTypedData(enhancedData);
          }

          if (data.address && data.sig) {
            setSignatures([data.sig]);
            newSearchParams.set("signatures", data.sig);
            setAddresses([data.address]);
            newSearchParams.set("addresses", data.address);
          }

          router.push(`${location.pathname}?${newSearchParams.toString()}`);
        } else {
          router.push("/");
        }
      } catch (e) {
        console.log(e);
        router.push("/");
      }
    };

    fetchFromIpfs();
  }, [ipfs, router, searchParams, setMessage, setTypedData, setSignatures, setAddresses]);
};

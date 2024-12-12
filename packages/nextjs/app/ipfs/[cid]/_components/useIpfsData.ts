import { useEffect } from "react";
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
  useEffect(() => {
    const fetchFromIpfs = async () => {
      if (!ipfs) return;

      try {
        const response = await fetch(`https://pineapple.fyi/ipfs/${ipfs}`);
        const data: IpfsData = await response.json();

        if (data.msg || data.data) {
          if (data.msg) {
            setMessage(data.msg);
          }

          if (data.data) {
            const enhancedData = { primaryType: "Vote", ...data.data };
            setTypedData(enhancedData);
          }

          if (data.address && data.sig) {
            setSignatures([data.sig]);
            setAddresses([data.address]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchFromIpfs();
  }, [ipfs, setMessage, setTypedData, setSignatures, setAddresses]);
};

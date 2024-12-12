import { EIP1271_SPEC, SignatureStatus } from "./types";
import { Address as AddressType, Client, Hex } from "viem";
import { getCode, readContract } from "viem/actions";

export const checkEip1271 = async (
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

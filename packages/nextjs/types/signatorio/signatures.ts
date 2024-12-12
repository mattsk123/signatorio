export enum SignatureStatus {
  INVALID = "INVALID",
  MATCH = "MATCH",
  MISMATCH = "MISMATCH",
}

export const EIP1271_SPEC = {
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

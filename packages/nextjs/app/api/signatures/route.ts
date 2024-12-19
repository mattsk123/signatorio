import { NextRequest, NextResponse } from "next/server";
import { isAddress, isHex, recoverMessageAddress, recoverTypedDataAddress } from "viem";
import { createMessageWithSignature } from "~~/services/db";
import { messageTypeEnum } from "~~/services/db/schema";

export const POST = async (req: NextRequest) => {
  const { signature, message, messageType, address } = await req.json();

  if (!signature || !message || !messageType || !address) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  if (!isHex(signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (!isAddress(address)) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  if (!messageTypeEnum.enumValues.includes(messageType)) {
    return NextResponse.json({ error: "Invalid message type" }, { status: 400 });
  }

  const recoveredAddress =
    messageType === "typed_data"
      ? await recoverTypedDataAddress({ ...JSON.parse(message), signature })
      : await recoverMessageAddress({ message, signature });

  if (recoveredAddress !== address) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const messageId = await createMessageWithSignature(message, messageType, signature, address);

  return NextResponse.json({ messageId });
};

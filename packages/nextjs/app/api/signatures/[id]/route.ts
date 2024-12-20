import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { recoverMessageAddress, recoverTypedDataAddress } from "viem";
import { db } from "~~/services/db";
import { messagesTable, signaturesTable } from "~~/services/db/schema";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  const [message] = await db.select().from(messagesTable).where(eq(messagesTable.id, id)).execute();
  const signatures = await db.select().from(signaturesTable).where(eq(signaturesTable.message, id)).execute();

  return NextResponse.json({
    message,
    signatures,
  });
};

export const POST = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    const { signature, signer } = await req.json();

    if (!signature || !signer) {
      return NextResponse.json({ error: "Signature and signer are required" }, { status: 400 });
    }

    const [message] = await db.select().from(messagesTable).where(eq(messagesTable.id, id)).execute();

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const [existingSignature] = await db
      .select()
      .from(signaturesTable)
      .where(and(eq(signaturesTable.message, id), eq(signaturesTable.signature, signature)))
      .execute();

    if (existingSignature) {
      return NextResponse.json({ error: "Signature already exists for this signer" }, { status: 409 });
    }

    const recoveredAddress =
      message.type === "text"
        ? await recoverMessageAddress({
            message: message.message,
            signature,
          })
        : await recoverTypedDataAddress({ ...JSON.parse(message.message), signature });

    if (recoveredAddress !== signer) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const [newSignature] = await db
      .insert(signaturesTable)
      .values({
        message: id,
        signature,
        signer,
      })
      .returning()
      .execute();

    return NextResponse.json({
      success: true,
      signature: newSignature,
    });
  } catch (error) {
    console.error("Error creating signature:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
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

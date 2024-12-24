import { ImageResponse } from "next/og";
import { eq } from "drizzle-orm";
import { db } from "~~/services/db";
import { MessageType, messagesTable, signaturesTable } from "~~/services/db/schema";

export const alt = "Signator.IO";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const { id } = params;
  const [message] = await db.select().from(messagesTable).where(eq(messagesTable.id, id)).execute();

  if (!message) {
    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(to bottom right, #1a1a1a, #2d2d2d)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "inter",
          }}
        >
          <div
            style={{
              color: "#ffffff",
              fontSize: 60,
              fontWeight: 700,
              letterSpacing: "-0.025em",
            }}
          >
            Message Not Found
          </div>
        </div>
      ),
      {
        ...size,
      },
    );
  }

  const signatures = await db.select().from(signaturesTable).where(eq(signaturesTable.message, id)).execute();

  const formatMessage = (message: string, type: MessageType) => {
    if (type === "typed_data") {
      try {
        const parsed = JSON.parse(message);
        // Return a simplified representation of the typed data
        return `${parsed.domain.name} - ${parsed.primaryType}`;
      } catch {
        return "Invalid JSON message";
      }
    }
    return message.length > 200 ? message.substring(0, 200) + "..." : message;
  };

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 60,
          fontFamily: "inter",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              color: "#94a3b8",
              fontSize: 24,
            }}
          >
            {new Date(message.createdAt).toLocaleDateString()}
          </div>
          <div
            style={{
              background: message.type === "typed_data" ? "#8b5cf6" : "#334155",
              padding: "8px 16px",
              borderRadius: 9999,
              color: "#e2e8f0",
              fontSize: 20,
            }}
          >
            {message.type === "typed_data" ? "Typed Message" : "Text"}
          </div>
        </div>

        {/* Message Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            flex: 1,
          }}
        >
          <div
            style={{
              color: "#ffffff",
              fontSize: 36,
              lineHeight: 1.4,
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {formatMessage(message.message, message.type)}
          </div>

          {message.type === "typed_data" && (
            <div
              style={{
                color: "#94a3b8",
                fontSize: 24,
                lineHeight: 1.4,
              }}
            >
              Structured data signature request
            </div>
          )}
        </div>

        {/* Footer remains the same */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#94a3b8",
              fontSize: 24,
            }}
          >
            Created by: {message.creator.substring(0, 6)}...{message.creator.substring(38)}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                color: "#e2e8f0",
                fontSize: 24,
              }}
            >
              {signatures.length} {signatures.length === 1 ? "Signature" : "Signatures"}
            </div>
            <div
              style={{
                background: "#22c55e",
                width: 12,
                height: 12,
                borderRadius: "50%",
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}

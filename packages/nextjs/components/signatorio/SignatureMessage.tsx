interface MessageSectionProps {
  message: string | null;
  typedData: any;
  highlightedTypedData: string | null;
}

export const SignatureMessage: React.FC<MessageSectionProps> = ({ message, typedData, highlightedTypedData }) => {
  return (
    <div>
      {!message && !typedData && (
        <>
          <h2 className="card-title skeleton h-7 w-1/3 min-w-48"></h2>
          <div className="rounded-lg skeleton h-60"></div>
        </>
      )}

      {message && (
        <>
          <h2 className="card-title">Message</h2>
          <div className="bg-base-200 p-4 rounded-lg">
            <p className="text-xs font-mono text-base-content break-all my-0 h-60 overflow-auto">{message}</p>
          </div>
        </>
      )}

      {typedData && (
        <>
          <h2 className="card-title">Typed Data</h2>
          {highlightedTypedData ? (
            <div
              dangerouslySetInnerHTML={{ __html: highlightedTypedData }}
              className="[&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:text-sm [&>pre]:h-60 [&>pre]:overflow-y-auto"
            />
          ) : (
            <div className="rounded-lg skeleton h-60"></div>
          )}
        </>
      )}
    </div>
  );
};

interface MessageSectionProps {
  message: string | null;
  typedData: any;
  highlightedTypedData: string | null;
}

export const SignatureMessage: React.FC<MessageSectionProps> = ({ message, typedData, highlightedTypedData }) => {
  return (
    <div>
      {message && (
        <>
          <h2 className="card-title">Message</h2>
          <div className="bg-base-200 p-4 rounded-lg">
            <p className="text-xs font-mono text-base-content break-all my-0">{message}</p>
          </div>
        </>
      )}

      {typedData && (
        <>
          <h2 className="card-title">Typed Data</h2>
          {highlightedTypedData && (
            <div
              dangerouslySetInnerHTML={{ __html: highlightedTypedData }}
              className="[&>pre]:p-4 [&>pre]:rounded-2xl [&>pre]:overflow-x-auto"
            />
          )}
        </>
      )}
    </div>
  );
};

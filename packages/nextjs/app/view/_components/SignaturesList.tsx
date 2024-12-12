import { SignatureStatusIcon } from "./SignatureStatusIcon";
import { SignatureStatus } from "./types";
import { Address } from "~~/components/scaffold-eth";

interface SignaturesListProps {
  signatures: string[];
  addresses: string[];
  addressChecks: SignatureStatus[];
}

export const SignaturesList: React.FC<SignaturesListProps> = ({ signatures, addresses, addressChecks }) => {
  return (
    <div>
      <h2 className="card-title">Signatures</h2>
      {signatures.map((signature, index) => (
        <div key={index} className="bg-base-200 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Address address={addresses[index]} />
            <div className="flex-grow" />
            <div className="text-xs">
              <SignatureStatusIcon status={addressChecks[index]} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs font-mono text-base-content/70 break-all mb-0">{signature}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

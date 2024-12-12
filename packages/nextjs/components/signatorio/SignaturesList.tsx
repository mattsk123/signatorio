import { SignatureStatusIcon } from "./SignatureStatusIcon";
import { Address } from "~~/components/scaffold-eth";
import { SignatureStatus } from "~~/types/signatorio/signatures";

interface SignaturesListProps {
  signatures: string[];
  addresses: string[];
  addressChecks: SignatureStatus[];
}

export const SignaturesList: React.FC<SignaturesListProps> = ({ signatures, addresses, addressChecks }) => {
  return (
    <div>
      <h2 className="card-title">Signatures</h2>

      <div className="flex flex-col gap-2">
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
        {signatures.length === 0 && <div className="bg-base-200 rounded-lg skeleton h-32"></div>}
      </div>
    </div>
  );
};

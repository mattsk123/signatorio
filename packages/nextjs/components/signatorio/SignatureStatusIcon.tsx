import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { SignatureStatus } from "~~/types/signatorio/signatures";

interface SignatureStatusIconProps {
  status: SignatureStatus | undefined;
}

export const SignatureStatusIcon: React.FC<SignatureStatusIconProps> = ({ status }) => {
  if (status === SignatureStatus.MATCH) {
    return (
      <div
        className="p-1 rounded-full bg-success text-success-content tooltip before:max-w-48 float-start"
        data-tip="The provided signature matches the address."
      >
        <CheckCircleIcon className="w-4 h-4" />
      </div>
    );
  }

  if (status === SignatureStatus.MISMATCH) {
    return (
      <div
        className="p-1 rounded-full bg-error text-error-content tooltip before:max-w-48 float-start"
        data-tip="The provided signature DOES NOT match the address."
      >
        <ExclamationCircleIcon className="w-4 h-4" />
      </div>
    );
  }

  if (!status) {
    return (
      <div className="p-1 rounded-full bg-warning text-warning-content tooltip h-6" data-tip="Verifying signature...">
        <div className="loading loading-xs h-4" />
      </div>
    );
  }

  return (
    <div
      className="p-1 rounded-full bg-error text-error-content tooltip before:max-w-48 float-start"
      data-tip="Something went wrong while verifying the signature. It might not be valid!"
    >
      <ExclamationCircleIcon className="w-4 h-4" />
    </div>
  );
};

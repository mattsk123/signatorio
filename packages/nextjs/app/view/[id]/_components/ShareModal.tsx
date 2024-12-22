import { useState } from "react";
import QRCode from "react-qr-code";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export const ShareModal = ({ isOpen, onClose, url }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Share Signature Request</h3>
        <div className="flex justify-center">
          <QRCode value={url} className="bg-white p-4 rounded-lg" />
        </div>
        <div className="mt-4">
          <p className="text-sm text-center mb-2">Or copy this link:</p>
          <div className="flex gap-2">
            <input type="text" className="input input-bordered w-full" value={url} readOnly />
            <button
              className="btn btn-primary btn-square"
              onClick={() => {
                navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? <CheckCircleIcon className="w-6 h-6" /> : <DocumentDuplicateIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

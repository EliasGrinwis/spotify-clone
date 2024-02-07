import {Icon} from "@iconify/react";

export default function SuccessMessage() {
  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      <div
        id="toast-success"
        className="relative flex items-center w-96 p-4 bg-lightgray rounded-lg shadow text-customgray"
        role="alert">
        <div className="line"></div>
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-green-500 text-text">
          <Icon className="w-4 h-4" icon="material-symbols:check" />
        </div>
        <div className="ml-3">
          <h1 className="text-md font-bold text-text">Success!</h1>
          <p className="text-sm text-custom-grey-text">
            Toegevoed aan favoriete
          </p>
        </div>
      </div>
    </div>
  );
}

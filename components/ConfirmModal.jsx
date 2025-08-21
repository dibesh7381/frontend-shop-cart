import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ConfirmModal({ open, message, onConfirm, onCancel, type = "warning" }) {
  const colors = {
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
  };

  const iconColors = {
    warning: "text-yellow-500",
    danger: "text-red-500",
    success: "text-green-500",
  };

  return (
    <Transition show={open} as={Fragment}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm px-4">
        <Transition.Child
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full sm:w-96 p-4 sm:p-6 text-center">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto flex items-center justify-center rounded-full ${colors[type]} mb-4`}>
              <ExclamationTriangleIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${iconColors[type]}`} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Confirm Action</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-6">{message}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={onConfirm}
                className={`py-2 w-full sm:w-auto px-6 rounded-lg font-medium shadow-md transition transform hover:scale-105 ${
                  type === "danger"
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                Yes
              </button>
              <button
                onClick={onCancel}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 w-full sm:w-auto px-6 rounded-lg font-medium shadow-md transition transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
}

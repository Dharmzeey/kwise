import { useFormStatus } from "react-dom";

type ButtonProp = {
  buttonText: string;
  pendingText: string;
};

export function SubmitButton(buttonProp: ButtonProp) {
  const { pending } = useFormStatus();

  return (
    <div className="flex justify-center mt-4">
      <button
        type="submit"
        aria-disabled={pending}
        disabled={pending}
        className="bg-main-color px-3 py-3  cursor-pointer rounded-md text-white"
      >
        {pending ? buttonProp.pendingText : buttonProp.buttonText.toUpperCase()}
      </button>
    </div>
  );
}

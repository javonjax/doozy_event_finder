import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseFormRegister,
} from "react-hook-form";
import {
  EmailValidation,
  UsernameValidation,
  RegistrationPasswordValidation,
  ConfirmPasswordValidation,
} from "./RegistrationForm";
import clsx from "clsx";
import { LoginPasswordValidation } from "./LoginForm";

export interface InputProps {
  register: UseFormRegister<FieldValues>;
  name: string;
  label: string;
  options:
    | EmailValidation
    | UsernameValidation
    | RegistrationPasswordValidation
    | LoginPasswordValidation
    | ConfirmPasswordValidation;
  validationError?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  submissionError?: string;
}

// Form input component for react-hook-forms.
const FormInput = ({
  register,
  name,
  label,
  options,
  validationError,
  submissionError,
}: InputProps): React.JSX.Element => {
  const inputType = ["password", "confirmPassword"].includes(name)
    ? "password"
    : "text";

  const errorStyling = submissionError?.includes(name)
    ? "border-2 border-red bg-[rgb(245, 152, 152)]"
    : "";
  return (
    <>
      <label className="mb-2">{label}:</label>
      <input
        className={clsx(
          "z-10 h-[2rem] rounded-lg p-2 text-black",
          errorStyling,
        )}
        type={inputType}
        {...register(name, options)}
      />
      <div className="my-1 ml-1 flex min-h-4 items-start text-xs">
        <p className="m-0 text-red-600">
          {validationError?.message?.toString()}
        </p>
      </div>
    </>
  );
};

export default FormInput;

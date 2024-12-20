import { FieldError, FieldErrorsImpl, FieldValues, Merge, UseFormRegister } from "react-hook-form";
import { EmailValidation, UsernameValidation, PasswordValidation, ConfirmPasswordValidation } from "./RegistrationForm";

export interface InputProps {
    register: UseFormRegister<FieldValues>;
    name: string;
    label: string;
    options: EmailValidation | UsernameValidation | PasswordValidation | ConfirmPasswordValidation;
    validationError?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
    submissionError?: string;
}

const Input = ({ register, name, label, options, validationError, submissionError }: InputProps) => {
  const inputType = ['password', 'confirmPassword'].includes(name)
    ? 'password'
    : 'text';

  return (
    <>
      <label>{label}:</label>
      <input 
        className={`form-input${submissionError?.includes(name) ? ' input-error' : ''}`}
        type={inputType}  
        {...register(name, options)} />
      {validationError && 
      <div className="error-tooltip"> 
        <p>{validationError.message?.toString()}</p>
      </div>}
    </>
  );
};

export default Input;

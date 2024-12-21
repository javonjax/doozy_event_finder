import { FieldError, FieldErrorsImpl, FieldValues, Merge, UseFormRegister } from "react-hook-form";
import { EmailValidation, UsernameValidation, RegistrationPasswordValidation, ConfirmPasswordValidation } from "./RegistrationForm";
import clsx from "clsx";
import { LoginPasswordValidation } from "./LoginForm";

export interface InputProps {
    register: UseFormRegister<FieldValues>;
    name: string;
    label: string;
    options: EmailValidation | UsernameValidation | RegistrationPasswordValidation | LoginPasswordValidation | ConfirmPasswordValidation;
    validationError?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
    submissionError?: string;
}

const Input = ({ register, name, label, options, validationError, submissionError }: InputProps): React.JSX.Element => {
  const inputType = ['password', 'confirmPassword'].includes(name)
    ? 'password'
    : 'text';

    const errorStyling = submissionError?.includes(name) ? 'border-2 border-red bg-[rgb(245, 152, 152)]' : '';
    console.log(errorStyling, name)
  return (
    <>
      <label className='mb-2'>{label}:</label>
      <input 
        className={clsx('text-black h-[2rem] rounded-lg z-10 p-2', errorStyling)}
        type={inputType}
        {...register(name, options)} />
      <div className='flex items-start text-xs min-h-4 ml-1 my-1'> 
        <p className='text-red-600 m-0'>{validationError?.message?.toString()}</p>
      </div>
    </>
  );
};

export default Input;

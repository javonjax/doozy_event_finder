import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import FormInput from "./FormInput";
import {
  EMAIL_REGEX,
  USERNAME_REGEX,
  PASSWORD_REGEX,
} from "../../../../schemas/schemas";
import { useToast } from "@/hooks/use-toast";

// Environment variables.
const REGISTRATION_API_URL: string = import.meta.env
  .VITE_BACKEND_REGISTRATION_API_URL;

// Validation options for react-hook-forms.
let passwordInput: any;
export const emailValidation = {
  required: "Email address is required.",
  pattern: {
    value: EMAIL_REGEX,
    message: "Email address is invalid.",
  },
};

export type EmailValidation = typeof emailValidation;

export const usernameValidation = {
  required: "Username is required.",
  minLength: {
    value: 4,
    message: "Must be at least 4 characters long.",
  },
  maxLength: {
    value: 24,
    message: "Must be less than 24 characters long.",
  },
  pattern: {
    value: USERNAME_REGEX,
    message: "May only contain letters, numbers, hyphens, and underscores.",
  },
};

export type UsernameValidation = typeof usernameValidation;

export const registrationPasswordValidation = {
  required: "Password is required.",
  minLength: {
    value: 8,
    message: "Must be at least 8 characters long.",
  },
  maxLength: {
    value: 24,
    message: "Must be less than 24 characters long.",
  },
  pattern: {
    value: PASSWORD_REGEX,
    message:
      "Must contain an uppercase letter, a number, and a special character [!@#$%].",
  },
};

export type RegistrationPasswordValidation =
  typeof registrationPasswordValidation;

export const confirmPasswordValidation = {
  required: "Please confirm your password.",
  validate: {
    passwordMatch: (value: string) =>
      value === passwordInput || "Passwords must match.",
  },
};

export type ConfirmPasswordValidation = typeof confirmPasswordValidation;

const RegistrationForm = (): React.JSX.Element => {
  // Hooks.
  const [registrationError, setRegistrationError] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    watch,
  } = useForm({ mode: "onChange" });

  // Event handlers.
  const onSubmit: SubmitHandler<FieldValues> = async (e) => {
    const res: globalThis.Response = await fetch(REGISTRATION_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(e),
    });

    const jsonRes: { message: string } = await res.json();

    if (!res.ok) {
      setRegistrationError(jsonRes.message);
      toast({
        title: "Registration error.",
        description: jsonRes.message,
        variant: "destructive",
        duration: 5000,
      });
    } else {
      setRegistrationError("");
      navigate("/login");
      toast({
        title: "Account registered! You may now login.",
        description: jsonRes.message,
        className: "text-[hsl(var(--text-color))] bg-green-600",
        duration: 5000,
      });
    }
  };

  // Watch the 'password' field to compare with the 'confirm password' field.
  passwordInput = watch("password");

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="my-4 flex w-[400px] flex-col rounded-2xl bg-[hsl(var(--background))] p-4 text-[hsl(var(--text-color))]">
        <h1 className="mb-4 text-[2rem]">Register</h1>
        {registrationError && (
          <p className="m-0 mb-4 text-red-600">{registrationError}</p>
        )}
        <form
          className="flex grow flex-col text-[hsl(var(--text-color))]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormInput
            register={register}
            name="email"
            label="Email address"
            options={emailValidation}
            validationError={errors.email}
            submissionError={registrationError}
          />
          <FormInput
            register={register}
            name="username"
            label="Username"
            options={usernameValidation}
            validationError={errors.username}
            submissionError={registrationError}
          />
          <FormInput
            register={register}
            name="password"
            label="Password"
            options={registrationPasswordValidation}
            validationError={errors.password}
          />
          <FormInput
            register={register}
            name="confirmPassword"
            label="Confirm password"
            options={confirmPasswordValidation}
            validationError={errors.confirmPassword}
          />
          <button
            className="mx-auto mb-4 mt-1 flex w-fit cursor-pointer items-center rounded-2xl border-2 border-orange-400 p-4 text-[hsl(var(--text-color))] hover:bg-[hsl(var(--text-color))] hover:text-[hsl(var(--background))] disabled:cursor-default disabled:hover:bg-[hsl(var(--background))] disabled:hover:text-[hsl(var(--text-color))]"
            type="submit"
            disabled={!isValid}
          >
            Create account
          </button>
        </form>
        <div className="flex flex-col text-[hsl(var(--text-color))]">
          <p>
            Already have an account?{" "}
            <NavLink to="/login" className="text-orange-400">
              Login here.
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;

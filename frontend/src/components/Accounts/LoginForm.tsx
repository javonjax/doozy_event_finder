import React, { useContext, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { NavigateFunction, NavLink, useNavigate } from "react-router-dom";
import { emailValidation } from "./RegistrationForm";
import FormInput from "./FormInput";
import { useToast } from "@/hooks/use-toast";
import { AuthContext, AuthContextProvider } from "../Providers/AuthContext";

// Environment variables.
const LOGIN_API_URL: string = import.meta.env.VITE_BACKEND_LOGIN_API_URL;

// Validation options for react-hook-forms.
export const loginPasswordValidation = {
  required: "Password is required.",
};

export type LoginPasswordValidation = typeof loginPasswordValidation;

const LoginForm = (): React.JSX.Element => {
  // Hooks.
  const [loginError, setLoginError] = useState<string>("");
  const { toast } = useToast();
  const navigate: NavigateFunction = useNavigate();
  const authContext = useContext<AuthContextProvider | undefined>(AuthContext);
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({ mode: "onChange" });

  // Event handlers.
  const onSubmit: SubmitHandler<FieldValues> = async (e) => {
    const res: globalThis.Response = await fetch(LOGIN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(e),
    });

    const jsonRes: { message: string } = await res.json();
    if (!res.ok) {
      setLoginError(jsonRes.message);
      toast({
        title: "Login error.",
        description: jsonRes.message,
        variant: "destructive",
        duration: 5000,
      });
    } else {
      setLoginError("");
      if (authContext) {
        authContext.login();
      }
      toast({
        title: jsonRes.message,
        description: "Enjoy your time with Doozy!",
        className: "text-[hsl(var(--text-color))] bg-green-600",
        duration: 5000,
      });
      navigate("/");
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="my-4 flex w-[400px] flex-col rounded-2xl bg-[hsl(var(--background))] p-4 text-[hsl(var(--text-color))]">
        <h1 className="mb-4 text-[2rem]">Login</h1>
        {loginError && <p className="m-0 mb-4 text-red-600">{loginError}</p>}
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
          />
          <FormInput
            register={register}
            name="password"
            label="Password"
            options={loginPasswordValidation}
            validationError={errors.password}
          />
          <button
            className="mx-auto mb-4 mt-1 flex w-fit cursor-pointer items-center rounded-2xl border-2 border-orange-400 p-4 text-[hsl(var(--text-color))] hover:bg-[hsl(var(--text-color))] hover:text-[hsl(var(--background))] disabled:cursor-default disabled:hover:bg-[hsl(var(--background))] disabled:hover:text-[hsl(var(--text-color))]"
            type="submit"
            disabled={!isValid}
          >
            Sign In
          </button>
        </form>
        <div className="flex flex-col text-[hsl(var(--text-color))]">
          <p>
            Need an account?{" "}
            <NavLink to="/register" className="text-orange-400">
              Register here.
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

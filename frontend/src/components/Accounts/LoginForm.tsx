import React, { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';;
import { emailValidation } from './RegistrationForm';
import Input from './Input';
import { useToast } from '@/hooks/use-toast';

// Validation options for react-hook-forms.

export const loginPasswordValidation = {
  required: 'Password is required.',
};

export type LoginPasswordValidation = typeof loginPasswordValidation;

const SignInForm = (): React.JSX.Element => {
  const SIGNIN_API_URL = import.meta.env.VITE_BACKEND_SIGNIN_API_URL;

  const [signInError, setSignInError] = useState<string>('');

  const { toast } = useToast();

  const navigate = useNavigate();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({ mode: 'onChange' });

  const onSubmit: SubmitHandler<FieldValues> = async (e) => {
    const res = await fetch(SIGNIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(e),
    });

    const data = await res.json();
    if (!res.ok) {
      setSignInError(data.message);
      toast({
        title: 'Login error.',
        description: data.message,
        variant: 'destructive',
        duration: 5000,
      });
    } else {
      setSignInError('');
      navigate('/');
      toast({
        title: data.message,
        duration: 5000,
      });
    }
    // TODO: put token in cookie
    console.log(data.token);
  };

  return (
    <div className='h-full w-full flex items-center justify-center'>
      <div className='text-[hsl(var(--text-color))] w-[400px] bg-[hsl(var(--background))] rounded-2xl flex flex-col p-4'>
        <h1 className='text-[2rem] mb-4'>Login</h1>
        {signInError && <p className='m-0 bg-red-600 mb-4'>{signInError}</p>}
        <form className='flex flex-col grow text-[hsl(var(--text-color))]' onSubmit={handleSubmit(onSubmit)}>
          <Input
            register={register}
            name='email'
            label='Email address'
            options={emailValidation}
            validationError={errors.email}
          />
          <Input
            register={register}
            name='password'
            label='Password'
            options={loginPasswordValidation}
            validationError={errors.password}
          />
          <button 
            className='mx-auto mt-1 mb-4 cursor-pointer text-[hsl(var(--text-color))] flex items-center w-fit border-2 border-orange-400 p-4 rounded-2xl hover:text-[hsl(var(--background))] 
              hover:bg-[hsl(var(--text-color))] disabled:cursor-default disabled:hover:bg-[hsl(var(--background))] disabled:hover:text-[hsl(var(--text-color))]'
            type='submit' 
            disabled={!isValid}>
            Sign In
          </button>
        </form>
        <div className='text-[hsl(var(--text-color))] flex flex-col'>
          <p>
            Need an account?{' '}
            <NavLink to='/register' className='text-orange-500'>
                Register here.
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;

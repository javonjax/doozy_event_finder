import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import Input from './Input';
import {
  EMAIL_REGEX,
  USERNAME_REGEX,
  PASSWORD_REGEX,
} from '../../../../schemas/schemas';
import { useToast } from '@/hooks/use-toast';

let passwordInput: any;

// Validation options for react-hook-forms.
export const emailValidation = {
  required: 'Email address is required.',
  pattern: {
    value: EMAIL_REGEX,
    message: 'Email address is invalid.',
  },
};

export type EmailValidation = typeof emailValidation;

export const usernameValidation = {
  required: 'Username is required.',
  minLength: {
    value: 4,
    message: 'Must be at least 4 characters long.',
  },
  maxLength: {
    value: 24,
    message: 'Must be less than 24 characters long.',
  },
  pattern: {
    value: USERNAME_REGEX,
    message: 'May only contain letters, numbers, hyphens, and underscores.',
  },
};

export type UsernameValidation = typeof usernameValidation;

export const registrationPasswordValidation = {
  required: 'Password is required.',
  minLength: {
    value: 8,
    message: 'Must be at least 8 characters long.',
  },
  maxLength: {
    value: 24,
    message: 'Must be less than 24 characters long.',
  },
  pattern: {
    value: PASSWORD_REGEX,
    message:
      'Must contain an uppercase letter, a number, and a special character [!@#$%].',
  },
};

export type RegistrationPasswordValidation = typeof registrationPasswordValidation;

export const confirmPasswordValidation = {
  required: 'Please confirm your password.',
  validate: {
    passwordMatch: (value: string) =>
      value === passwordInput || 'Passwords must match.',
  },
};

export type ConfirmPasswordValidation = typeof confirmPasswordValidation;

const RegistrationForm = (): React.JSX.Element => {
  const REGISTRATION_API_URL = import.meta.env.VITE_BACKEND_REGISTRATION_API_URL;
  const [registrationError, setRegistrationError] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    watch,
  } = useForm({ mode: 'onChange' });

  const onSubmit: SubmitHandler<FieldValues> = async (e) => {
    const res = await fetch(REGISTRATION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(e),
    });

    const data = await res.json();

    if (!res.ok) {
      setRegistrationError(data.message);
      toast({
        title: 'Registration error.',
        description: data.message,
        variant: 'destructive',
        duration: 5000,
      });
    } else {
      setRegistrationError('');
      navigate('/signin');
      toast({
        title: 'Account registered! You may now sign in.',
        description: data.message,
        duration: 5000,
      });
    }
  };

  // Watch the 'password' field to compare with the 'confirm password' field.
  passwordInput = watch('password');

  return (
    <div className='flex items-center justify-center h-full w-full'>
      <div className='flex flex-col text-[hsl(var(--text-color))] w-[400px] bg-[hsl(var(--background))] rounded-2xl p-4'>
        <h1 className='text-[2rem] mb-4'>Register</h1>
        {registrationError && (
          <p className='m-0 bg-red-600 mb-4'>{registrationError}</p>
        )}
        <form
          className='flex flex-col grow text-[hsl(var(--text-color))]'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            register={register}
            name='email'
            label='Email address'
            options={emailValidation}
            validationError={errors.email}
            submissionError={registrationError}
          />
          <Input
            register={register}
            name='username'
            label='Username'
            options={usernameValidation}
            validationError={errors.username}
            submissionError={registrationError}
          />
          <Input
            register={register}
            name='password'
            label='Password'
            options={registrationPasswordValidation}
            validationError={errors.password}
          />
          <Input
            register={register}
            name='confirmPassword'
            label='Confirm password'
            options={confirmPasswordValidation}
            validationError={errors.confirmPassword}
          />
          <button
            className='mx-auto mt-1 mb-4 cursor-pointer text-[hsl(var(--text-color))] flex items-center w-fit border-2 border-orange-400 p-4 rounded-2xl hover:text-[hsl(var(--background))] 
              hover:bg-[hsl(var(--text-color))] disabled:cursor-default disabled:hover:bg-[hsl(var(--background))] disabled:hover:text-[hsl(var(--text-color))]'
            type='submit'
            disabled={!isValid}
          >
            Create account
          </button>
        </form>
        <div className='text-[hsl(var(--text-color))] flex flex-col'>
          <p>
            Already have an account?{' '}
            <NavLink to='/login' className='text-orange-500'>
              Login here
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;

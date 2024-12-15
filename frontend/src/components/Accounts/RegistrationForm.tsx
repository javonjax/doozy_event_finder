import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import Input from './Input';
import { EMAIL_REGEX, USERNAME_REGEX, PASSWORD_REGEX } from '../../../../schemas/schemas';
import { useToast } from '@/hooks/use-toast';

const REGISTRATION_API_URL = import.meta.env.VITE_BACKEND_REGISTRATION_API_URL;

const RegistrationForm = (): React.JSX.Element => {
  const [registrationError, setRegistrationError] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();
 
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    watch,
  } = useForm({ mode: 'onChange' });

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    const res = await fetch(REGISTRATION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(e)
    });

    const data = await res.json();

    if (!res.ok) {
      setRegistrationError(data.message);
      toast.error(data.message);
    } else {
      setRegistrationError('');
      navigate('/signin');
      toast.success('Account registered! You may now sign in.');
    }
  };

  // Watch the 'password' field to compare with the 'confirm password' field.
  const passwordInput = watch('password');

  // Validation options for react-hook-forms.
  const emailValidation = {
    required: 'Email address is required.',
    pattern: {
      value: EMAIL_REGEX,
      message: 'Email address is invalid.',
    },
  };

  const usernameValidation = {
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

  const passwordValidation = {
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

  const confirmPasswordValidation = {
    required: 'Please confirm your password.',
    validate: {
      passwordMatch: (value: string) =>
        value === passwordInput || 'Passwords must match.',
    },
  };

  return (
    <div className="registration-container">
      <div className="registration-form-container">
        <h1>Register</h1>
        {registrationError && <p className="submission-error">{registrationError}</p>}
        <form className="registration-form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            register={register}
            name="email"
            label="Email address"
            options={emailValidation}
            validationError={errors.email}
            submissionError={registrationError}
          />
          <Input
            register={register}
            name="username"
            label="Username"
            options={usernameValidation}
            validationError={errors.username}
            submissionError={registrationError}
          />
          <Input
            register={register}
            name="password"
            label="Password"
            options={passwordValidation}
            validationError={errors.password}
          />
          <Input
            register={register}
            name="confirmPassword"
            label="Confirm password"
            options={confirmPasswordValidation}
            validationError={errors.confirmPassword}
          />
          <button type="submit" disabled={!isValid}>
            Create account
          </button>
        </form>
        <div className="form-nav">
          <p>Already have an account? <NavLink to="/signin">Sign In</NavLink></p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;

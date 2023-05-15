import {
  Button,
  Card,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react';
import { supabase } from '@supabase-sdk';
import { useForm } from 'react-hook-form';

interface LoginProps {
  setShowLogin: (showLogin: boolean) => void;
}

interface AuthFields {
  email: string;
  password: string;
}

const Login = ({ setShowLogin }: LoginProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<AuthFields>();

  async function onSubmit(values: AuthFields) {
    try {
      const response = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Card padding={5}>
      <Stack spacing={3}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <FormControl isInvalid={!!errors['email']}>
              <FormLabel htmlFor="email">Email address</FormLabel>
              <Input
                id="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                })}
                type="email"
              />
              <FormErrorMessage>
                {errors.email && errors.email?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                id="password"
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Email is required',
                  minLength: {
                    value: 8,
                    message: 'Minimum length should be 8',
                  },
                })}
                type="password"
              />
              <FormErrorMessage>
                {errors.password && errors.password?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl>
              <Button
                colorScheme="blue"
                width={'100%'}
                isLoading={isSubmitting}
                type="submit"
              >
                Login
              </Button>
            </FormControl>
          </Stack>
        </form>
        <Button colorScheme="green" onClick={() => setShowLogin(false)}>
          Register
        </Button>
      </Stack>
    </Card>
  );
};

export default Login;

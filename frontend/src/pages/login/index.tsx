import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import authenticate from '../../api/authenticate';
import { AuthWrapper } from '../../components/AuthWrapper';
import { Main } from '../../components/Main';

const MotionBox = motion(Box);

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await authenticate({ username, password });

      toast({
        title: 'Login successful.',
        description: 'You are now logged in.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <Container centerContent>
        <Main pt="10rem">
          <MotionBox
            mt={8}
            p={8}
            boxShadow="lg"
            borderRadius="md"
            width="100%"
            maxWidth="md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading mb={6}>Login</Heading>
            <FormControl id="username" mb={4} isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" mb={4} isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                colorScheme="purple"
                isLoading={loading}
                onClick={handleLogin}
                width="full"
              >
                Login
              </Button>
            </MotionBox>
          </MotionBox>
        </Main>
      </Container>
    </AuthWrapper>
  );
};

export default LoginPage;

import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const AuthWrapper = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (getCookie('apiKey')) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, []);

  return children;
};

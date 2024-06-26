import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  TableContainer,
  useColorModeValue,
  useToast,
  Button,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { AuthWrapper } from '../../components/AuthWrapper';
import UploadModal from '../../components/UploadModal';
import CertificateTable from '../../components/CertificateTable';
import { motion } from 'framer-motion';
import { Certificate } from '../../types/Certificate';
import getCerts from '../../api/getCerts';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/router';

const MotionBox = motion(Box);

const Index = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const certs = await getCerts();
      setCertificates(certs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    fetchCertificates(); // Refresh certificates after successful upload
    toast({
      title: 'Certificate Added',
      description: 'Your certificate has been successfully added.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const onLogout = () => {
    deleteCookie('apiKey');
    router.push('/');
  };

  return (
    <AuthWrapper>
      <Container pt="10rem" maxW="fit-content">
        <Flex>
          <UploadModal onUploadSuccess={handleUploadSuccess} />
          <Spacer />
          <Button colorScheme="gray" onClick={onLogout}>
            Logout
          </Button>
        </Flex>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          textAlign="center"
          mt={8}
          p={5}
          boxShadow="md"
          borderRadius="md"
          bg={useColorModeValue('white', 'gray.700')}
          maxW="100%"
          overflowX="auto"
        >
          <TableContainer>
            <CertificateTable certificates={certificates} loading={loading} />
          </TableContainer>
        </MotionBox>
      </Container>
    </AuthWrapper>
  );
};

export default Index;

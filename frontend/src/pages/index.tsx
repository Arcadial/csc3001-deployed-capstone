import { Container } from '../components/Container';
import { Main } from '../components/Main';
import ImageUpload from '../components/ImageUpload';
import {
  Box,
  Text,
  VStack,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Index = () => (
  <Container>
    <Main pt="8rem">
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
      >
        <VStack spacing={4}>
          <Heading size="lg">Check Certificate Validity</Heading>
          <Text fontSize="md">
            To check the validity of your certificate, please upload the image
            of your certificate here.
          </Text>
          <ImageUpload />
        </VStack>
      </MotionBox>
    </Main>
  </Container>
);

export default Index;

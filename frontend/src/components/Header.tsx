import React from 'react';
import {
  Flex,
  Box,
  Link,
  useColorModeValue,
  Text,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Hero } from './Hero';
import { DarkModeSwitch } from './DarkModeSwitch';

const Header: React.FC = () => {
  const backgroundColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999 }}
    >
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg={backgroundColor}
        color={textColor}
        boxShadow="md"
        borderBottomWidth={1}
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Box display="flex" alignItems="center">
          <Hero title="Certified." size="300px" />
        </Box>
        <Flex align="center">
          <Button
            as={Link}
            href="/login"
            fontSize="lg"
            mr={4}
            colorScheme="purple"
            _hover={{ textDecoration: 'none' }}
            fontWeight="bold"
          >
            For Institutions
          </Button>
          <DarkModeSwitch />
        </Flex>
      </Flex>
    </motion.header>
  );
};

export default Header;

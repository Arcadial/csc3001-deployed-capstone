import React, { ChangeEvent, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Center,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { AiOutlineUpload } from 'react-icons/ai';
import verifyCert from '../api/verifyCert';
import Loading from './Loading';

const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationStatus, setValidationStatus] = useState<
    'valid' | 'invalid' | 'unknown'
  >('unknown');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const backgroundColor = useColorModeValue('gray.50', 'gray.700');
  const highlightColor = useColorModeValue('gray.100', 'gray.800');
  const validColor = useColorModeValue('green.200', 'green.800');
  const invalidColor = useColorModeValue('red.200', 'red.800');

  useEffect(() => {
    if (selectedFile) {
      setLoading(true);
      validateCertificate(selectedFile);
    }
  }, [selectedFile]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const validateCertificate = async (file: File) => {
    try {
      const response = await verifyCert(file);
      setValidationStatus(response ? 'valid' : 'invalid');
      setLoading(false);
    } catch (error) {
      console.error('Error validating certificate:', error);
      setValidationStatus('invalid'); // Set to invalid if response failed
      setLoading(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setValidationStatus('unknown');
  };

  return (
    <Center>
      <motion.div
        className="image-uploader-container"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          position="relative"
          borderWidth={2}
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          borderStyle="dashed"
          borderRadius="md"
          p={4}
          textAlign="center"
          boxSize="lg"
          overflow="hidden"
          display="flex"
          flexDirection="column"
          bg={
            validationStatus === 'valid'
              ? validColor
              : validationStatus === 'invalid'
              ? invalidColor
              : backgroundColor
          }
        >
          {selectedFile && loading ? (
            <Loading loadingText="Loading" />
          ) : (
            <>
              <Box
                flex="1"
                bg={dragging ? highlightColor : 'white'}
                py={4}
                borderTopRadius="md"
              >
                <Center h="full">
                  <Text
                    fontSize="xl"
                    bgGradient="linear(to-l, heroGradientStart, heroGradientEnd)"
                    bgClip="text"
                    fontWeight="bold"
                  >
                    {validationStatus === 'valid'
                      ? 'Certificate is valid'
                      : validationStatus === 'invalid'
                      ? 'Certificate is invalid'
                      : 'Drag & Drop the image of your cert'}
                  </Text>
                </Center>
              </Box>
              {validationStatus === 'unknown' && (
                <Box
                  flex="0.1" // Adjust to change the proportion
                  bg={backgroundColor}
                  py={4}
                  borderRadius="md"
                >
                  <Center>
                    <Input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="file-input">
                      <Button
                        ml={2}
                        as="span"
                        leftIcon={<AiOutlineUpload />}
                        colorScheme="purple"
                      >
                        Upload Image
                      </Button>
                    </label>
                  </Center>
                </Box>
              )}
            </>
          )}
          {validationStatus !== 'unknown' && (
            <Box flex="0.1" bg={backgroundColor} py={4} borderRadius="md">
              <Center>
                <Button onClick={resetState}>Reset</Button>
              </Center>
            </Box>
          )}
        </Box>
      </motion.div>
    </Center>
  );
};

export default ImageUpload;

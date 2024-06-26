import React, { ChangeEvent, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Center,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { AiOutlineUpload } from 'react-icons/ai';
import addCert from '../api/addCert';
import Loading from './Loading';

const NewCertUpload = ({
  onClose,
  onUploadSuccess,
}: {
  onClose: () => void;
  onUploadSuccess: () => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const toast = useToast();

  const backgroundColor = useColorModeValue('gray.50', 'gray.700');
  const highlightColor = useColorModeValue('gray.100', 'gray.800');

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

  useEffect(() => {
    if (selectedFile) {
      setLoading(true);
      processCertificate(selectedFile);
    }
  }, [selectedFile]);

  const processCertificate = async (file: File) => {
    try {
      await addCert(file);
      setLoading(false);
      setSelectedFile(null); // Reset selected file after successful upload
      onClose();
      onUploadSuccess();
    } catch (error) {
      console.error('Error processing certificate:', error);
      setLoading(false);
    }
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
          bg={backgroundColor}
        >
          {loading ? (
            <Loading loadingText="Processing" />
          ) : (
            <>
              <Box
                flex="1"
                bg={dragging ? highlightColor : 'white'}
                py={4}
                borderTopRadius="md"
              >
                <Center h="full">
                  <Text color="black" fontSize="xl">
                    Drag & Drop the image of your cert
                  </Text>
                </Center>
              </Box>
              <Box flex="0.1" py={4} borderRadius="md">
                <Center>
                  <Input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file-input">
                    <Button ml={2} as="span" leftIcon={<AiOutlineUpload />}>
                      Upload Image
                    </Button>
                  </label>
                </Center>
              </Box>
            </>
          )}
          {selectedFile && (
            <Box flex="0.1" py={4} borderRadius="md">
              <Center>
                <Button onClick={() => setSelectedFile(null)}>Reset</Button>
              </Center>
            </Box>
          )}
        </Box>
      </motion.div>
    </Center>
  );
};

export default NewCertUpload;

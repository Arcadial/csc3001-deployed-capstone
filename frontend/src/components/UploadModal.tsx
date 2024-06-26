import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Box,
} from '@chakra-ui/react';
import NewCertUpload from './NewCertUpload';

const UploadModal = ({ onUploadSuccess }: { onUploadSuccess: () => void }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="purple" onClick={onOpen}>
        Upload Certificate
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Certificate</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box maxH="70vh" overflowY="auto">
              <NewCertUpload
                onClose={onClose}
                onUploadSuccess={onUploadSuccess}
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UploadModal;

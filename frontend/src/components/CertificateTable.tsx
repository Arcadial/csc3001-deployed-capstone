import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Spinner,
} from '@chakra-ui/react';
import { Certificate } from '../types/Certificate';
import dayjs from 'dayjs';

const CertificateTable = ({
  certificates,
  loading,
}: {
  certificates: Array<Certificate>;
  loading: boolean;
}) => {
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Table variant="striped" colorScheme="purple">
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Institute</Th>
          <Th>Recipient</Th>
          <Th>Major</Th>
          <Th>Degree Level</Th>
          <Th>Issuing Date</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {certificates.map((certificate) => (
          <Tr key={certificate.Id}>
            <Td>{certificate.Id}</Td>
            <Td>{certificate.Institute}</Td>
            <Td>{certificate.Recipient}</Td>
            <Td>{certificate.Major}</Td>
            <Td>{certificate.DegreeLevel}</Td>
            <Td>{dayjs(certificate.IssuingDate).format('YYYY/MM/DD')}</Td>
            <Td>{certificate.Status}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default CertificateTable;

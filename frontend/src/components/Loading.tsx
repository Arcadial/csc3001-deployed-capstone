import { Spinner, Text, VStack, Box } from '@chakra-ui/react';

const Loading = ({ loadingText }: { loadingText: string }) => (
  <VStack spacing={4} align="center" justify="center" height="100vh">
    <Box display="flex" alignItems="center">
      <Spinner size="xl" color="purple.500" />
      <Text fontSize="xl" color="gray.700" ml={4}>
        {loadingText}...
      </Text>
    </Box>
  </VStack>
);

export default Loading;

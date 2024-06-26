import { Flex, Heading, Link } from '@chakra-ui/react';

export const Hero = ({ title, size }: { title: string; size?: string }) => (
  <Link style={{ textDecoration: 'none' }} href="/">
    <Flex
      justifyContent="center"
      alignItems="center"
      width={size} // Set the width based on the size prop
      height="auto" // Adjust height to auto
      bgGradient="linear(to-l, heroGradientStart, heroGradientEnd)"
      bgClip="text"
      py={2}
    >
      <Heading fontSize="5xl">{title}</Heading> {/* Adjust font size */}
    </Flex>
  </Link>
);

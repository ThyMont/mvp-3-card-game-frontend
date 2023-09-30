import { Box, Heading, Text, Button, Link } from "@chakra-ui/react";

const Home = () => {
  return (
    <Box p={8} textAlign="center">
      <Heading mb={4}>Bem-vindo ao Cassino Virtual</Heading>
      <Text fontSize="xl" mb={6}>
        O lugar perfeito para se divertir e testar sua sorte!
      </Text>
      <Link to="/login">
        <Button colorScheme="teal" size="lg">
          Comece a Jogar
        </Button>
      </Link>
    </Box>
  );
};

export default Home;

import { Box, Heading, Text, Link, Flex, Image } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const PageNotFound = () => {
  return (
    <Flex direction="column" align="center" justify="center" h="100vh" bg="gray.100">
      <Heading as="h1" fontSize="6xl" mb={4}>
        Oops! Página não encontrada
      </Heading>
      <Box textAlign="center" maxW="500px">
        <Text fontSize="lg" mb={6}>
          Parece que a página que você estava procurando decidiu tirar um dia de folga! Mas não se
          preocupe, ela promete voltar amanhã, bem descansada!
        </Text>
        <Text fontSize="lg" mb={6}>
          Mas não se preocupe, você pode voltar para a{" "}
          <Link as={RouterLink} to="/" color="blue.500">
            página inicial
          </Link>
          .
        </Text>
        <Image
          src="https://media.giphy.com/media/14uQBm1VlAs6a4/giphy.gif"
          alt="Página não encontrada"
          borderRadius="md"
          maxH="300px"
        />
      </Box>
    </Flex>
  );
};

export default PageNotFound;

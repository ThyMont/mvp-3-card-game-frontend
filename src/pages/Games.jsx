import { Box, Flex, Heading, SimpleGrid } from "@chakra-ui/react";

const Games = () => {
  return (
    <Flex align="center" justify="center" h="80vh">
      <Box p={8} justi>
        <Heading mb={6}>Escolha um Jogo</Heading>
        <SimpleGrid columns={[1, 2]} spacing={8}>
          <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Box as="a" href="/blackjack">
              <img
                src="https://tudosobreapostas.com.br/wp-content/uploads/2020/10/como-jogar-black-jack.jpg"
                alt="Blackjack"
              />
            </Box>
            <Box p="6">
              <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                Blackjack
              </Box>
            </Box>
          </Box>

          <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
            <img src="https://www.ioccaruaru.com.br/img/em_breve.jpg" alt="Coming Soon" />
            <Box p="6">
              <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                Mais em Breve
              </Box>
            </Box>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default Games;

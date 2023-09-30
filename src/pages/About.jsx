import { Flex, Heading, Image, Link, Text } from "@chakra-ui/react";

const About = () => {
  return (
    <Flex direction="column" align="center" justify="center" h="100vh">
      <Heading as="h1" mb={4}>
        Sobre
      </Heading>
      <Text>
        Bem-vindo ao MVP do módulo de Arquitetura de Software no curso de pós-graduação em
        Engenharia de Software na PUC-Rio.
      </Text>
      <Text>Versão do Sistema: 0.1</Text>
      <Image
        src="https://media.licdn.com/dms/image/D4D03AQHBMnMNAqFrKw/profile-displayphoto-shrink_200_200/0/1688128819334?e=1701302400&v=beta&t=XdBjC62i7l8oAuQ2Rx43zfWOKZyn1P-NF9UBqiy2DK8"
        borderRadius="full"
        boxSize="200px"
        mt={6}
        mx="auto"
      />
      <Text mt={4}>Thyago Monteiro</Text>
      <Link href="https://www.linkedin.com/in/thyagomonteiro/" isExternal color="blue.500">
        Perfil no LinkedIn
      </Link>
      <br />
      <Link href="https://github.com/ThyMont" isExternal color="blue.500">
        GitHub
      </Link>
    </Flex>
  );
};

export default About;

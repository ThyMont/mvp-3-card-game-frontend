import { useContext, useState } from "react";
import {
  Box,
  Text,
  Button,
  HStack,
  VStack,
  Grid,
  GridItem,
  Heading,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
} from "@chakra-ui/react";
import { PlayerContext } from "../reducer/playerReducer";
import { Coin1Icon, Coin5Icon, Coin25Icon, Coin50Icon, Coin100Icon } from "../components/Coins";
import { deleteAccount } from "../api";
import { toast } from "react-toastify";
import LoadingOverlay from "../components/LoadingOverlay";
import { redirect } from "react-router-dom";

const User = () => {
  const { player, handleDelete, handleResetCoins, handleLogin } = useContext(PlayerContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [password, setPassword] = useState("");

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setIsDeleteAccountModalOpen(false);
    const playerToDelete = await handleLogin(player.username, password);

    if (playerToDelete) {
      await deleteAccount(player, password).then(() => {
        handleDelete();
        toast.error("Adeus! sentirei saudades");
        setIsDeleteAccountModalOpen(false);
        setIsLoading(false);
        setPassword("");
        redirect("/");
      });
      return;
    }
    setIsDeleteAccountModalOpen(true);
    toast.error("Senha incorreta");
    setIsLoading(false);
  };

  const handleReset = async () => {
    setIsLoading(true);
    await handleResetCoins()
      .then(() => {
        toast("Suas moedas foram resetadas");
        setIsLoading(false);
      })
      .catch(() => {
        toast.error("Algo deu errado! tente novamente mais tarde");
        setIsLoading(false);
      });
  };

  return player != null ? (
    <Box p="8" boxShadow="lg" mx="auto" maxW="xl">
      <Text fontSize="3xl" fontWeight="bold" mb="4">
        Perfil do Usuário
      </Text>
      <VStack align="start" spacing="4">
        <Text>
          Nome: <strong>{player.name}</strong>
        </Text>
        <Text>
          Nome de Usuário: <strong>{player.username}</strong>
        </Text>
        <Heading mb={4} size="lg">
          Minha Carteira
        </Heading>
        <Grid
          templateColumns="repeat(5, 1fr)"
          gap={4}
          bg="#aaa"
          p={4}
          borderRadius={5}
          alignItems="center"
        >
          <GridItem>
            <Coin1Icon fontSize={"7xl"} color={"white"} />
            <Text textAlign="center" fontWeight={"bold"} color={"#333"}>
              x {player?.wallet?.coin_1}
            </Text>
          </GridItem>
          <GridItem>
            <Coin5Icon fontSize={"7xl"} color={"red"} />
            <Text textAlign="center" fontWeight={"bold"} color={"#333"}>
              x {player?.wallet?.coin_5}
            </Text>
          </GridItem>
          <GridItem>
            <Coin25Icon fontSize={"7xl"} color="green" />
            <Text textAlign="center" fontWeight={"bold"} color={"#333"}>
              x {player?.wallet?.coin_25}
            </Text>
          </GridItem>
          <GridItem>
            <Coin50Icon fontSize={"7xl"} color="blue" />
            <Text textAlign="center" fontWeight={"bold"} color={"#333"}>
              x {player?.wallet?.coin_50}
            </Text>
          </GridItem>
          <GridItem>
            <Coin100Icon fontSize={"7xl"} color="black" />
            <Text textAlign="center" fontWeight={"bold"} color={"#333"}>
              x {player?.wallet?.coin_100}
            </Text>
          </GridItem>
        </Grid>
        <Text>
          Total de Moedas: <strong>{player?.wallet?.total}</strong>
        </Text>
        <HStack spacing="4">
          <Button
            colorScheme="red"
            onClick={() => setIsDeleteAccountModalOpen(true)}
            disabled={password === ""}
          >
            Apagar conta
          </Button>
          <Button colorScheme="orange" onClick={handleReset}>
            Resetar Moedas
          </Button>
        </HStack>
      </VStack>
      <Modal isOpen={isDeleteAccountModalOpen} onClose={() => setIsDeleteAccountModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmação de Exclusão de Conta</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Tem certeza de que deseja excluir sua conta? Vamos sentir muito a sua falta!
            </Text>
            <FormControl isRequired>
              <FormLabel>Senha</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={handleDeleteAccount} isDisabled={password === ""}>
              Confirmar Exclusão
            </Button>
            <Button variant="ghost" onClick={() => setIsDeleteAccountModalOpen(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isLoading && <LoadingOverlay />}
    </Box>
  ) : (
    <Box textAlign="center" p="8">
      <Heading as="h2" size="xl" mb="4">
        Ops, parece que você não está logado!
      </Heading>
      <Text fontSize="lg" mb="8">
        Para acessar esta página, faça o login primeiro.
      </Text>
      <Text fontSize="lg" fontStyle="italic" mb="8">
        Por que o usuário não pôde entrar? Porque ele não tinha credenciais!
      </Text>

      <Button as={Link} to="/login" colorScheme="blue" size="lg">
        Fazer Login
      </Button>
    </Box>
  );
};

export default User;

/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  Heading,
  Image,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tooltip,
  OrderedList,
  ListItem,
  GridItem,
  Grid,
  IconButton,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { PlayerContext } from "../../reducer/playerReducer";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { beginBlackjackMatch, double, hit, stand } from "../../api";
import { toast } from "react-toastify";
import {
  Coin100Icon,
  Coin1Icon,
  Coin25Icon,
  Coin50Icon,
  Coin5Icon,
  CoinIcon,
} from "../../components/Coins";
import LoadingOverlay from "../../components/LoadingOverlay";

const BACKGROUND = "https://games.netent.com/wp-content/uploads/2018/09/blackjack_background.jpg";

const Blackjack = () => {
  const [started, setStarted] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const { player, findPlayer } = useContext(PlayerContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [match, setMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const initialBet = {
    coin_1: 0,
    coin_5: 0,
    coin_25: 0,
    coin_50: 0,
    coin_100: 0,
    total: 0,
  };
  console.log(player?.wallet);

  const [bet, setBet] = useState(initialBet);

  const initialAction = {
    hit: false,
    double: false,
    stand: false,
    endGame: false,
    canBet: true,
  };

  const [actions, setActions] = useState(initialAction);

  const handleGameStart = () => {
    setMatch(null);
    setStarted(true);
    setIsGameStarted(true);
  };

  const handleGameOver = async (endedMatch) => {
    const { winner, is_natural_blackjack, payment } = endedMatch;
    setActions({
      hit: false,
      double: false,
      stand: false,
      canBet: true,
    });
    await findPlayer(player.id).then((m) => {
      setIsLoading(false);
      return m;
    });

    setBet(initialBet);
    setIsGameStarted(false);
    if (winner == "dealer") {
      toast.error("Você perdeu! =(", { position: "top-center" });
    } else if (winner == "player" && is_natural_blackjack) {
      toast.info("BLACKJACK! Parabéns, você ganhou! Seu prêmio é de $" + payment, {
        position: "top-center",
      });
    } else if (winner == "player") {
      toast.info("Parabéns, você ganhou!  Seu prêmio é de $" + payment, { position: "top-center" });
    } else {
      toast.warn("Empatou!", { position: "top-center" });
    }
  };

  const handleHit = async () => {
    setIsLoading(true);
    await hit(player).then((m) => {
      setMatch(m);
      if (m.game_over) {
        handleGameOver(m);
        return m;
      }

      setActions({
        hit: true,
        double: false,
        stand: true,
        canBet: false,
      });
      setIsLoading(false);
      return m;
    });
  };

  const handleDouble = async () => {
    setIsLoading(true);
    const newMatch = await double(player);
    setMatch(newMatch);
    await handleGameOver(newMatch);
  };

  const handleStand = async () => {
    setIsLoading(true);
    const newMatch = await stand(player);
    setMatch(newMatch);
    await handleGameOver(newMatch);
  };

  const handleEndGame = async () => {
    setActions(initialAction);
    setStarted(false);
    setIsLoading(true);
    setMatch(null);
    setBet(initialBet);
    await findPlayer(player.id).then((m) => {
      setIsLoading(false);
      return m;
    });
  };
  const increaseBet = (coin) => {
    console.log(!actions.canBet || bet.coin_5 >= player.wallet.coin_5);
    const newBet = { ...bet };
    newBet[`coin_${coin}`] = bet[`coin_${coin}`] + 1;
    newBet["total"] = totalBet(newBet);
    setBet(newBet);
  };

  const decreaseBet = (coin) => {
    const newBet = { ...bet };
    newBet[`coin_${coin}`] = bet[`coin_${coin}`] - 1;
    newBet["total"] = totalBet(newBet);
    console.log(newBet);
    setBet(newBet);
  };

  const totalBet = (newBet) => {
    console.log({ newBet });
    return (
      newBet.coin_1 * 1 +
      newBet.coin_5 * 5 +
      newBet.coin_25 * 25 +
      newBet.coin_50 * 50 +
      newBet.coin_100 * 100
    );
  };
  const startMatch = async () => {
    setIsLoading(true);
    setMatch(null);
    if (bet.total > 0) {
      const newMatch = await beginBlackjackMatch(bet, player).then((m) => {
        setIsLoading(false);
        return m;
      });
      setMatch(newMatch);
      setActions({
        hit: true,
        double: true,
        stand: true,
        canBet: false,
      });
    } else {
      toast.error("Você deve fazer uma aposta para inicar a partida");
    }
  };

  return player ? (
    <Stack
      spacing={5}
      mx={"auto"}
      minH="80vh"
      py={2}
      px={12}
      pb="10"
      bgImage={BACKGROUND}
      align={"Center"}
    >
      {started ? (
        <>
          <Stack h="100%" align="center" justify="center">
            <Box rounded="lg" h="100%" bg="transparent" boxShadow="2xl" p={12} textAlign="Justify">
              <Grid
                templateAreas={`"bet dealer actions"
                  "bet player actions"`}
                gridTemplateColumns={"30% 40% 30%"}
                gridTemplateRows={"50% 50%"}
                h="100%"
                w="80vw"
                gap="1"
                color="blackAlpha.700"
                fontWeight="bold"
              >
                <GridItem pl="2" area={"bet"}>
                  <Stack spacing="6">
                    <Text fontSize="lg" color="white" fontWeight="bold" textAlign="center">
                      Sua Aposta
                    </Text>
                    <Text fontSize="md" color="white" fontWeight="bold" textAlign="center">
                      Estão exibidas somente suas moedas disponíveis
                    </Text>
                    <Stack spacing={2} direction={"row"}>
                      <Text fontSize="lg" fontWeight="bold" color="#FFFFFF">
                        Valor da Aposta:
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color="#FFFFFF">
                        {bet.total}
                      </Text>
                    </Stack>
                    {player.wallet.coin_1 > 0 && (
                      <Box
                        display="flex"
                        justifyContent="space-around"
                        alignItems="center"
                        w="100%"
                      >
                        <Text fontSize="lg" fontWeight="bold" mr="2">
                          <Coin1Icon fontSize={"5xl"} color={"white"} />
                        </Text>
                        <IconButton
                          colorScheme="blue"
                          icon={<AddIcon />}
                          onClick={() => increaseBet(1)}
                          isDisabled={!actions.canBet || bet.coin_1 >= player.wallet.coin_1}
                        />
                        <Text color="white" fontSize="lg" fontWeight="bold">
                          {bet.coin_1}
                        </Text>
                        <IconButton
                          colorScheme="red"
                          icon={<MinusIcon />}
                          onClick={() => decreaseBet(1)}
                          isDisabled={!actions.canBet || bet.coin_1 === 0}
                        />
                      </Box>
                    )}

                    {player.wallet.coin_5 > 0 && (
                      <Box
                        display="flex"
                        justifyContent="space-around"
                        alignItems="center"
                        w="100%"
                      >
                        <Text fontSize="lg" fontWeight="bold" mr="2">
                          <Coin5Icon fontSize={"5xl"} color={"red"} />
                        </Text>
                        <IconButton
                          colorScheme="blue"
                          icon={<AddIcon />}
                          onClick={() => increaseBet(5)}
                          isDisabled={!actions.canBet || bet.coin_5 >= player.wallet.coin_5}
                        />
                        <Text fontSize="lg" color="white" fontWeight="bold">
                          {bet.coin_5}
                        </Text>
                        <IconButton
                          colorScheme="red"
                          icon={<MinusIcon />}
                          onClick={() => decreaseBet(5)}
                          isDisabled={!actions.canBet || bet.coin_5 === 0}
                        />
                      </Box>
                    )}

                    {player.wallet.coin_25 > 0 && (
                      <Box
                        display="flex"
                        justifyContent="space-around"
                        alignItems="center"
                        w="100%"
                      >
                        <Text fontSize="lg" fontWeight="bold" mr="2">
                          <Coin25Icon fontSize={"5xl"} color="green" />
                        </Text>
                        <IconButton
                          colorScheme="blue"
                          icon={<AddIcon />}
                          onClick={() => increaseBet(25)}
                          isDisabled={!actions.canBet || bet.coin_25 >= player.wallet.coin_25}
                        />
                        <Text fontSize="lg" color="white" fontWeight="bold">
                          {bet.coin_25}
                        </Text>
                        <IconButton
                          colorScheme="red"
                          icon={<MinusIcon />}
                          onClick={() => decreaseBet(25)}
                          isDisabled={!actions.canBet || bet.coin_25 === 0}
                        />
                      </Box>
                    )}

                    {player.wallet.coin_50 > 0 && (
                      <Box
                        display="flex"
                        justifyContent="space-around"
                        alignItems="center"
                        w="100%"
                      >
                        <Text fontSize="lg" fontWeight="bold" mr="2">
                          <Coin50Icon fontSize={"5xl"} color={"blue"} />
                        </Text>
                        <IconButton
                          colorScheme="blue"
                          icon={<AddIcon />}
                          onClick={() => increaseBet(50)}
                          isDisabled={!actions.canBet || bet.coin_50 >= player.wallet.coin_50}
                        />
                        <Text fontSize="lg" color="white" fontWeight="bold">
                          {bet.coin_50}
                        </Text>
                        <IconButton
                          colorScheme="red"
                          icon={<MinusIcon />}
                          onClick={() => decreaseBet(50)}
                          isDisabled={!actions.canBet || bet.coin_50 === 0}
                        />
                      </Box>
                    )}

                    {player.wallet.coin_100 > 0 && (
                      <Box
                        display="flex"
                        justifyContent="space-around"
                        alignItems="center"
                        w="100%"
                      >
                        <Text fontSize="lg" fontWeight="bold" mr="2">
                          <Coin100Icon fontSize={"5xl"} color={"black"} />
                        </Text>
                        <IconButton
                          colorScheme="blue"
                          icon={<AddIcon />}
                          onClick={() => increaseBet(100)}
                          isDisabled={!actions.canBet || bet.coin_100 >= player.wallet.coin_100}
                        />
                        <Text fontSize="lg" color="white" fontWeight="bold">
                          {bet.coin_100}
                        </Text>
                        <IconButton
                          colorScheme="red"
                          icon={<MinusIcon />}
                          onClick={() => decreaseBet(100)}
                          isDisabled={!actions.canBet || bet.coin_100 === 0}
                        />
                      </Box>
                    )}

                    {bet.total > 0 && match == null && (
                      <Button
                        colorScheme="teal"
                        size="lg"
                        width="100%"
                        onClick={startMatch}
                        isDisabled={!actions.canBet || totalBet === 0}
                      >
                        Apostar
                      </Button>
                    )}
                    {!isGameStarted && match != null && (
                      <Button
                        colorScheme="teal"
                        size="lg"
                        width="100%"
                        onClick={handleGameStart}
                        isDisabled={!actions.canBet || totalBet === 0}
                      >
                        Reiniciar Partida
                      </Button>
                    )}
                  </Stack>
                </GridItem>

                <GridItem pl="2" area={"dealer"}>
                  <Box>
                    <Text color="white" fontSize="xl" fontWeight="bold" mb="2">
                      Dealer
                    </Text>
                    <Stack spacing={-20} direction={"row"}>
                      {match?.dealer?.cards.map((card, index) => (
                        <Card key={index} image={card.image} />
                      ))}
                    </Stack>
                    <Text color="white" fontSize="lg" fontWeight="bold">
                      Score: {match?.dealer?.score}
                    </Text>
                  </Box>
                </GridItem>

                <GridItem pl="2" area={"player"}>
                  <Box>
                    <Text color="white" fontWeight="bold" mb="2">
                      Player
                    </Text>
                    <Stack spacing={-20} direction={"row"}>
                      {match?.player?.cards.map((card, index) => (
                        <Card key={index} image={card.image} />
                      ))}
                    </Stack>
                    <Text color="white" fontSize="lg" fontWeight="bold">
                      Score: {match?.player?.score}
                    </Text>
                  </Box>
                </GridItem>

                <GridItem area={"actions"}>
                  <Stack spacing={2}>
                    <Text fontSize="lg" fontWeight="bold" color="#FFFFFF">
                      Saldo:
                    </Text>
                    <CoinIcon color={"white"} />
                    <Text fontSize="lg" fontWeight="bold" color="#FFFFFF">
                      ${player.wallet.total - bet.total}
                    </Text>
                  </Stack>
                  <Stack
                    w="100%"
                    h="100%"
                    spacing={4}
                    mt={4}
                    p={2}
                    justifyContent="center"
                    alignItems="center"
                  >
                    {actions.hit && (
                      <Button
                        colorScheme={"teal"}
                        width="100%"
                        size="lg"
                        h="16"
                        onClick={handleHit}
                      >
                        Hit
                      </Button>
                    )}
                    {actions.double && (
                      <Button
                        colorScheme="blue"
                        width="100%"
                        size="lg"
                        h="16"
                        onClick={handleDouble}
                      >
                        Double
                      </Button>
                    )}
                    {actions.stand && (
                      <Button
                        colorScheme="green"
                        width="100%"
                        size="lg"
                        h="16"
                        onClick={handleStand}
                      >
                        Stand
                      </Button>
                    )}
                    {
                      <Button
                        colorScheme="red"
                        width="100%"
                        size="lg"
                        h="16"
                        onClick={handleEndGame}
                      >
                        Encerrar Jogo
                      </Button>
                    }
                  </Stack>
                </GridItem>
              </Grid>
            </Box>
          </Stack>
          {isLoading && <LoadingOverlay />}
        </>
      ) : (
        <>
          <Stack h="80vh" w="80vw">
            <Box
              rounded={"lg"}
              h={"100%"}
              bg="transparent"
              boxShadow={"2xl"}
              p={12}
              textAlign="Justify"
            >
              <Stack direction={"column"} spacing={10}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Heading color={"#FFF"} mb={10}>
                    Blackjack
                  </Heading>
                  <Heading color={"#FFF"} as="h3" mb={10}>
                    Saldo: $ {player.wallet.total}
                  </Heading>
                </Stack>
                <Stack>
                  <>
                    <Button h={"5em"} onClick={onOpen}>
                      Regras do jogo
                    </Button>

                    <Modal isOpen={isOpen} onClose={onClose} w="90vw">
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Regras do jogo</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody p={5}>
                          <OrderedList spacing={5}>
                            <ListItem cursor="pointer">
                              <Tooltip label="O objetivo é vencer o dealer obtendo uma mão de cartas com um valor total mais próximo de 21 do que o dealer, sem ultrapassar 21.">
                                Objetivo do Jogo
                              </Tooltip>
                            </ListItem>
                            <ListItem cursor="pointer">
                              <Tooltip label="As cartas numeradas (2 a 10) têm o valor correspondente. As cartas de figuras (Valete, Rainha e Rei) valem 10 pontos cada. O Ás pode valer 1 ou 11 pontos, dependendo do que for mais favorável ao jogador.">
                                Valor das Cartas
                              </Tooltip>
                            </ListItem>
                            <ListItem cursor="pointer">
                              <Tooltip label="Cada jogador e o dealer recebem duas cartas iniciais viradas para cima.">
                                Início do Jogo
                              </Tooltip>
                            </ListItem>
                            <ListItem cursor="pointer">
                              <Tooltip label="Pedir Carta (Hit): O jogador pode pedir mais cartas para aumentar o valor da sua mão. O jogador pode pedir quantas cartas desejar, mas se o valor total da mão ultrapassar 21, ele perde automaticamente. Ficar com a Mão (Stand): O jogador decide manter sua mão atual e passa a vez para o dealer.">
                                Opções do Jogador
                              </Tooltip>
                            </ListItem>
                            <ListItem cursor="pointer">
                              <Tooltip label="O dealer deve seguir regras específicas. Geralmente, ele deve pedir cartas até alcançar um total de 17 ou mais.">
                                Opções do Dealer
                              </Tooltip>
                            </ListItem>
                            <ListItem cursor="pointer">
                              <Tooltip label="O jogador vence se tiver uma mão com um valor mais próximo de 21 do que o dealer, sem ultrapassar 21. Nesse caso, o jogador recebe o dobro da aposta. Se o jogador ultrapassar 21 pontos, ele perde automaticamente. Se o jogador e o dealer tiverem o mesmo valor de mão, é um empate (push) e a aposta é devolvida ao jogador. Um 'Blackjack Natural' (um Ás e uma carta de valor 10) geralmente paga 3:2 (1.5x a aposta).">
                                Vitória e Pagamento
                              </Tooltip>
                            </ListItem>
                            <ListItem cursor="pointer">
                              <Tooltip label="O jogador tem a opção de dobrar a aposta original após receber as duas primeiras cartas, em troca de se comprometer a pedir apenas mais uma carta. Essa jogada pode ser vantajosa quando o jogador tem uma mão inicial muito forte e acredita que uma única carta adicional a deixará em uma posição vantajosa.">
                                Double Down (Dobrar a Aposta)
                              </Tooltip>
                            </ListItem>
                            <ListItem cursor="pointer">
                              <Tooltip label="O jogo termina quando todos os jogadores (incluindo o dealer) decidem ficar com suas mãos (Stand) ou ultrapassam 21 (Bust).">
                                Final do Jogo
                              </Tooltip>
                            </ListItem>
                          </OrderedList>
                        </ModalBody>

                        <ModalFooter>
                          <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Fechar
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </>
                  <Button h={"5em"} colorScheme="blue" onClick={handleGameStart}>
                    Iniciar partida
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </>
      )}
    </Stack>
  ) : (
    <Stack spacing={5} mx={"auto"} minH="90vh" py={8} px={12} bgImage={BACKGROUND} align={"Center"}>
      <Stack h="80vh" w="80vw">
        <Box rounded={"lg"} h={"100%"} bg="transparent" boxShadow={"2xl"} p={12}>
          <Heading mb={10}>O clássico jogo do 21 pra você!</Heading>
          <Text mb={8}>
            Blackjack ou vinte-e-um é um jogo praticado com cartas em casinos e que pode ser jogado
            com 1 a 8 baralhos de 52 cartas, em que o objetivo é ter mais pontos do que o
            adversário, mas sem ultrapassar os 21 (caso em que se perde). O dealer só pode pedir até
            um máximo de 5 cartas ou até chegar ao número 17.
          </Text>
          <Text>Faça já seu login e jogue à vontade!</Text>
          <Box align={"center"} p={6}>
            <Image rounded={10} boxShadow={"2xl"} maxH={"30vh"} src={image1} alt="Casino Coins" />
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};

const Card = ({ image }) => (
  // <Box

  // >
  <Image
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    p="2"
    m="1"
    w={"fit-content"}
    position="relative"
    maxH={"20vh"}
    src={image}
    alt="Card"
  />
  // </Box>
);
const image1 =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYWFRgVFhYZGBgaGBgaHRwcGhoaGBwcGBgaGhwcGBocIS4lHB4rIRgYJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QHxISHzQrJSs0NDQ0NDQ0NDY0NjQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIAK4BIgMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAEBQMGAAECB//EAEEQAAEDAQUFBQUGBQMEAwAAAAEAAhEDBBIhMUEFUWFxgQYikaHwEzKxwdEUQlJy4fEHFYKSohYjYjNTstJDk8L/xAAaAQADAQEBAQAAAAAAAAAAAAAAAgMBBAUG/8QALREAAgIBBAECBgIBBQAAAAAAAAECEQMEEiExQVGRBRMUImFxMoGxI1JiocH/2gAMAwEAAhEDEQA/APYS4DUBRPttMZvb4qg9j6Fa2B1SrVdcBgAYSrfT7O0RoTzMqSt9I3gmftilo6eQlLrRag891nXBN6WzabcmhENpNGQCHFvs20jz/anZepXOjRyxWWT+HLPvucesfBeiLEyhRj5KtZuxVnYPdHhK4tfYqg8YNA5YK2LFuxBZ5jb/AOHerHkeYSO09i7QzQOHgvalyWA5gLNgHgb9k1KZkscOmHki7Nay3Ne1VbCx2bQltq7NUKnvMHgFKWKzYylHpnlNorl2RIQhqOGqvPaPszSpMLmEt64eC8+eSTmkUV0EskrtsHttEvzKFbs4bkwcxcyqJUScm+yBtlAUgphTNA1WFi0wJsNquLu07RdoUKGrHAJXFN2c8tPCUtzRFaNpPI3pTXrudomjwFGWDctUUbHDGPSEzA+cAvTP4c2Ulz3OHuj6kqoUWNDgYyKvPZm1XGVH6On4JZPmjsgko35M2/XEuUnZ8i5gVV7Xai97nE5lZQtbmO7pgLk1OF5Y7Uzr0+ZQbb6Zc7XarglILb2mgERKgr2pz24uSl9nvAlQw6P/AHM6p62CX2rkgFqFR5dkmVnquBEb0qpWUA4JrQbBC7JpJJFfhcnLLJ+o0FsdrIQlTasTj5LdWoIKSWkZpEexOMY80E1Kl8TvVp7G2WJcd6plmqK7bEtQpsaDmSnf8T5/PPdnLLtCrdpvduaV5TZWX60xPeJ81fu0ltu2d3EJL2P2e1wDjnmUkXUWxZK5JFgo7PbdGGg+CxOPZhYp8ldyEH8LLQSx7dJP1Xoa8V7I9oRZXGRLXHTML0Ox9trK/N90/wDLBelGSXZ5K5RZ1iBobWov92o09UW2oDkQUykmbRIsWltMYYtStOMBVK37VdecL8CcgpzntGSstTqwGZAQ9TaLBrKpVTaY1cT1QdbbbRqpPK2PsRd6m1hoEHV2kTm6OSolo7QnSUurbXqOyMJbkwuKLR2ntbDTPeJw1K85bUOiYV77/eJUDLNdTxVdkZyTfBDecttlFOEKBx4LRDV0rbXKRgK07ktA0SVw8wu7xQ7ySgDm9K2WLXsStYoA23BWix1gLORwVaRlnqywtCWRSCs50BWqjpyW2UzkiqTGg4qVpOy8ovbSBGVHCUSH9zDVQ2qo28pKb2AQXeaZPglTsHLoKmp2rHFaNBpycurPs6o911jbx5iBzJyWSSrktgy5MUrh2Fl7S1KbeHaSrns3sq2P9yqJ3MIAHNzs/AI+2dlKN3C+DGYcfngoboo9b63LJVJKzzOxsdfA0lWx5PcA3oersw0nwcRofqNCi7OP9xoOmKs5JxtHl/d837lTJO2FeKbWakIbsptEN7pMFD9pLRfqxoEnuFplpgojC40LLM45W/B6l9vbvWLzgbQq71in8ll/qYCtdB5Tx2x6YYXX8RvKW1qLAB3wurcjztrIqddzciRyMJnZdv2hnu1HdcUnLVjSQtoLaLnZO3Nob70O8k9sf8QWH32OHGJHkvP9l3C7vqyWVtIkZQpSntdI9LTaCWaG9vj9Fz/1XRe03HYx1VD2pb233G8TintWx0HDAAYaJc3ZjDKRzt8lFoq8v2KzW2poAg32pxVxOx6ZBk/BJLRsxmMFMpxXaMfwzLK9rv8A6E/tSpW2oqCq26SM1wrKmeVKLi2n2FG2rltvQ/s5WewRQoS62grbbS1CCipBRQAcLS2FGaoQbqa4DSigGF4FaZSvEBoLicgBJPIDNQ2SyvqPDGCXHwA1J3Ab16V2d2C2gz8Tz7zyMTwG4cFLJkUf2WxYXPl8L1KUzYdoIn2To4lo8iQQtVNi1/8AtO6QfgSvUnUBzXLqHBR+fL0R0rS4vVnlX8ltH/af5fMomzbCtIP/AEo5vZ/7L0ttlW/sqSWaT8FIYccfJ54zs9aCZLQP6h8lNS7M2iZmmOb3fJqvpoRoojS4fXokc5F0oMpDuyFR7pc9g/KHO+QRTex9PN73u/KGtHnKt7aYXfshHr1CN8q7McYXbRXrL2cszDhSBP8AyLneRMa7k4p2VrRAaGjcAAESxoHrzWyeXrr6lK7fbNtL+KoHqWcQllZzmnumBqNDhu+ibud4evqg7RQEaJWVxvwxTaajKg3O3fTelBYWvlG2qjddOYUbsRjkcJ+SeMq/RuTEpc+UV+3EPeShphHWuwuYSc2nXdzQr2rvg048Hh5YyjJqS5MvDcsWrqxMYJrfa67mtvMe0DMwR4oejXZPeOKue1qvtGuY97WiMgPmk+ytjWZ1RjDefeMawubHle1ymq/CLZM2ByUMbu/PgHp2hsYLd8Fei0eydmYMGN8Ft2xqDf8A4p6BKtXFq0iv0f8AyPOZC4FV7cWuXpT9jWeJ9l5Ln/S1ncJu3fJY9TCraLYsebDzjnRQbHtW0Oddw5psDUdm8Dkmtt7IMDSWPLTGpn4qisrVKdUte6WgkSOCyGSGa3B9Hr6XWbUo5ny3Vlr+wPd9/wA/0Ub9iSMXnxPyQ9l2ix2DSTy/dHU7Q2MQ7zTco9GUZSXD4/AOzYdJokv8/qhqthogxf8ANMalKm4Rdd4FLK1lptPuOMcCmUpepyx0GBvmN/sDrUWj3DeQz3kJq61OEBlLyUVWz1KmDg1ipHJXZ5uq+EcuWJ/0Lqb5KKgb1w+yXMyDyUUqqafR4eTFLHLbJUyeAjtl7KfaHXWDAe84+63mdTwRXZ3s+60G++W0xrq/g3hvPhw9IsVjZSYGtaGtAwA+PEneo5MtcR7K4sF8y6/yL9jbBZQbDRLj7zjmT8hw/dOQGtCCtW0WtwkQkFs2+MQFxufPqz0YYJSVdIszLc0uunNTe1adV5Xa+0DmPD73CN4+oTaydpQ8CHA8j8k33JdFXplfDPQRVC0bQBgqgzbo3qR22GnVZuYv0rLO+2tHNRfagVV3bVE4lR2fa96oGNMl2XIYkpXKTHWlSRbBaG8Mvhw6hYbQOUevH6pUa4AJ3D91ALRIG93zRuZiwIbtqzMdM9d64qHOPqd+nRQUSAJ0Hnhr5LKNcvaS3BskDUnGOmSy7F20+Dh9Xhrr0XN8x64Lhwxj6+tCu6PoJS9JIDtFElLqlAt0VkNMH1xUFWhKLoFNMr4IIg5+sEqtlgjFg6fT6KxWqx6hAOEYFUhNxdoXNhjljT9yvSFpWH7O3c3w/RaXV89eh530EvUFfZGk92zPJ3kH5hROs9oa8XaQYDgJgJnVrbRdgKB61B8kutGztpPI7jGwcy8n5KLzQ8te6PDxfDs19e5NY2V21GmrWDbuMXplP7R2qpMHvTyzVWPZW2uN59akzkCfmFNZdh+wl1S0AncGA+EyubJPTSfab/FnrYdJqktqaS9wm19sHEgsY+7+Uof/AFDaHk3ab40wA+KC/n4FcU2vvM0JaJVrDXuaC193oqx0uGk2vcpk1r0/2TateaK06zW+0AmHMbrjj5IG1dnKrWz7+/evQbFbfZMc0uvl2/BB+3DpLTPLJdEVHHxBUeRq/iEpyTUr/FcHltKmaTi5gx1CMs3aFxN0MJdyCsVr2BUq1HOF1jTpqpLL2Vcx9+8PBVk4tX5PV0HxjZthKVLzxdEuw673Uw97QHEkNBAIAbgXEZElwcADgLpwMiCW7TpuwD6LjuikTj0U1op3IZndaBzvS/8A/aq1hoUW17Q97WtZScy7nDXAnIDMyzLikXR2yyvNOUlJ0uqLMajJg+ynddpg/CVy+y0n+9TYeV5v/iQq7ZtnC1VDXey5TOQk33xgHEzgMNN2G82ajTDGtY0Q1oDQNwAgfBaSyTlCkpu/PPQKNj2f/tD/AOyt/wC6msfZ+zXr7qYus7x71R04wBdL8ZJAg4b8JRARL+6xo1cS48my1viS/wDtC1SZzS+53Llh1Pat3BtNoYMAJMiNJy8llrtAqti9UpnSLrm9ZDSqv2g2maNOGY1Xm5TGt4wJjWJHMlo1XHY611ajKntn3yyoWAw0RdAnFoE46pXBNXQ8ZtPh8hNp2RWJgVHPnAQ3OdIwhMtnfw/Lu9aKziPws7o/qdmekJ7ssiSdQPjgnJrxgEkIxs6MmfJVRZXnfw9sRH/S63nXvGUstH8N6X3CY3OiY4O+oKv9GrIQ+0691mGZIaOuvQSeivKEdu6znjnzbqs84b2KY6blas3E5FpHmFp/Yt4920n+pjT8HNV0Y2AABouH6nwXFuZ3fOnfDKFaOytpA7lWm78wez4Xks2bY7RZ6xfXpOa0NcA4Q5uJGN5pMZawvSahgAakx9VokHDp4o3uqKfMkylv2kHCJWbM2gHVcTgMUw232Xa+X0CGP3fcdzH3TxHgqZYmVKVYtqNLHCZB14g5EcQhRTXBbemXTa21iQ2lTxe9wY0cT9MT0TmnSFKm1gJJAA0gmM8eKq/ZajfqPtDsmSxk/iI7zhyBA6lP61tA1x4HFJLjgRq3S6JSMcTPQE4749YLTam7HyQlMl5nEDjMuOpw+PNFNjIeuQSs0NouJGKkIlR03IgRvQiEuGA2inqlNsozontRL7SzduWdMtB2qElw71iOuLapuNob/ZbTJMsg8SoTY6rQS54znNHMoOIgPExuH1S62bNqulvt2t3wwT5uXjpWuaolCfNNr2OHUWiHOqi7uGvVRV22YSSL3iVw7ZAu3H2gn8t0ZclujZbPTBvOdUJ1cS7wAwW/bVX7L/0tF36v9Fd7R2ui6mW0qPfHuuA7wO/DFIKG0K92C8q82vbtGnIZT0mYDRhvlUnaW1G1qrnBoEx7uU6r1vh8m47XF13bPL+J6eM0pNdcU+yKrUe/E1HK97EuGk0MzAg75VEY3gYRdmtD6ZDmOIIPRejKNrg8PNp1KK28UehEdx4BDHlsNJyBQ1LYlZzb1R178hxSazdq3gd9jXjiEzsnaei5zWhj2Fzmt7rsO8QOG9JG48UJhySxfbKJDaBD3NGTTcxz7ncx/tVP2Xs37R7R7nkML33QNXmSHHSAHjz62C20/agi+9l516WGHYmYndihtnbNFIODKjyCCACRdaT94AYXslh7+HIoQdOm6OuzVqLqRY736ZLCOAy8MW/0puHJHZNkmm/2nt3mSC+W++B+IyiGWodxr6xa97Wm7/t5uGQBYdcpQLlqU24c3yN2YkAZnBS26u0OcSQGMEScg1gxdyMF3VLrBaJffZWD/ZmXjuE4gtZduNGN+4eQcle3dn2isC2nVa1ha0FhEAkGZvgE7sMsFqRJ2uxfs7bFCpazXrPuBvdpMIcQBjLnQIa6N+rv+ITbsGT7B7zm+s93+DB8QVxWa5lmYx1nZWeBcLGAXWiHQReDiYhvEkk4LjshablAsex7Cx2Jcwi8XuMBo94nAThuTPlGRdMuljtYY6HZOwniPXkjK20ADBMH1B5KvGux4LA9t7OAQHg6GMwVxS2qw/7NpAIHuuggjqMRyXNJNO0duKcXw+y5WHaAJic0JtS2XntAyGPX1KXWex0cHU6pjMC8CPhK1aXgYz64pZzk40Whig57kN2VpjkPP9wuKlYSBxn9PJJxtADVbFubjJk5cVO2x/lJMY1K4zywPmobO+87gCSTyyHiQhXOBEDM5DGZ4wpBQui6DJjHl88ceKxjbUlSDSJB9cB81BbbCyq0te0OHgeYIxB5LTK0Rw9YqVlUE8o/VYK4tCl+xSymGUD3WyYJxxM56nFAe3ZRxqNde4g67lagcJ5LlxzyI+OHzRfqbGb6KxSrvq94i6zTEDDcNQFOy3sb94cI00R+0dkU6rSBeYT95hgjjGR6hVw9jWAQ60Vhx7sde6mSi+2PvvpDelthrjdabx1jIc01o2mQqvS7O1KbYoVmOGcOF0nPNzZk5aLuzi1Aw9gaN4eDPKAscV4Zlp9os73oSs9CsqOA72Hj5yo31ZS0PFUS3hvWKC+ViajBXaWbUa697Om8gfd1HIkJRaNrbRY5xdQuz/wcR5FXPZPaim8BrzcfucY/tdkeWaeUrXTcDDw2N4w8clwLLKEtuTEvYh81tWuvVHkNbtFbyJuQN4pn4lCnaFvfrU3d2nA8YwXtoosc3ulrmnc4QfNdMluDYE4nBvorrjq9PHuFf0T3yfUn/g8SobAtlYglj3A6kyeglei9neyTLOz/AHAHue0EgjQ6AHJWdrwDekTvIaI5IK17YosJL6rZiYJElS1OsWWG3Fd/jgxKd+pWe0PZprGuq0ZAaJcw7t4+iqD65j3cFYe03bNr6bqVAEueCJOe7AbkgoNMCc9y9DQPM8f+r/V9nBqoxi1XfmjqlWZkUxsTWl7S37svz1YC8ebQgW2Vpnf5qbZYIe8/hYfEvYw/4ucux9HMuwjbj3ewfdP4Zj8N4T5eUqqUrQ5rXMaSGvi8BrH7q4uIILTiCCCN4OBVds2xnGo5rpuNPvauGYA4xmdFJHq6XNCMWpfsP2E1ws9SSQHyGDiQWyObiB/She0tK7Vv6PA6FgDSPANPVOapEMYBAvNgDAC53wP8FuGVXtZ3XuDgQJEA5SeAnFBKOp25Xkrs52DZDSpBzhDqhD41DGy1k7iSXmN11ZtXb7KOHvv0aDl+c/dHmtbftbyx76QN7ANgS4MENBA/EGjxxVDfSeBec1wG8gicRJxzxIx3lPGKfZDLlc5OT8noWwdqGtSD3RfDnNdGAmZEDddLUZUrS9o0aL3Uy1vPC/8A4qm9kqpD3j7t0EnQEHDlgXeCsFKpgXHNxvdIho6ADrKlm+20LFjV1QEQ4AjcQCPApXbqDc293g0kD+0YeS69quHvlQVroduwFjXtMseWnpHgICn/AJzWaIeLw/EMfELlwXJTWn2UhnnHhM7/AJyDjMLpu14zOHA4IOrZ2OzaJ35HxCEdZMSGnCJx3nLHofJaoxZdav1LRYdpzi1xLt0/KcU9se0L0Xs92vMwvMhSqNMgHxH1TWxbYe0htQdcJ8dVksXoVhqIydWelFwIifWmC4FEjL1y8AkVg2mDEef1VhoVw7n+ihKLR0KXocGo4YbvXyUvtDl6BGR9b1Jc1j4cPXVbNMHL1HDklMckcCoMDOc8IIzG9RVKw904YjDeN/68FNcJOGBOIIxxGh3yg7a3A4RgcDwO8DGDMZEJgVWQVWNJlri34Y/son1Ht1kb/wBCk1vtTmOJzHqQVAzbM4ShRY9oZ1K28nlooKtcTyQdW2h2IIQb7R+3RMomOQ29uFiT+2W0+wTeL6v5pkeui3ZnPZNx72SMmuIB6ZKX7NHvFC1GnMQu6UFJU0eDGcou4uhgzbFoYIDw4D8TWn4Qtjbtc5mn/Y6fJyWzhlj6yWmOJKi9LibvavYtHV5V1Jhn8wrVJ7zRyafm5DOspLiXvJ/LA+GK17QtywC7ovB9FUjhhD+KQstTll22bZZWN9wY74x81FUbUx73yU9wB24c/wBVN9mGd6evknIWQ2J4OLn47tU0szWhjiDN54/waZ/82qzdkeyFG0URVqPcXXnNLW3Q1pacJJBJMXXae8l3aCx06FZ1GkXXWQTeMkvcATjAwuhg6IkuBkvItWpXBete0ClQ1izbtouljbwAhxMk8AMBic3LnYMOc5/ewBaCcMXCHQ0YRdJGZz0hD2uqH1SQ1ryIYJF7InCJgY3sY3JzZxdaBhMYxgJ4Ddu4LbaVIao1+QlB07FD3vc8vvtDS1wEAAyAOGJwRF9adUAEk4BZyLZE+m0AMa0NBxIAAF0Z4DDHAdTuXZKHNYAF78JjmB91oAzOOQ1JSm2beABuNJ0nT+73R/l0U3GU3wMnQ8c6MTkgrRtFrSGgguOABN0EnLQmDviOKrf2+pWeGhwaScDMRh+L7p/LHJQWuy3Gh16bxIIIuunfEmRx5KkcCTpsLLnTqBzQ4ZEa58iNCMlolI9j7TnuuzwnmcL3UxPEzqYcOeozg4ujbMe+BJXDBAxzJk893QQOijv3jwafFw+Q+PJbc9UhGkY2bcUPaXtDSXZASf04rbnrPZMcO/Bxm6cjz3qqRjdAOx9qvDoa0nkCQArzsfaodBGPrVV6nUu5ADlgFGXXHX2f1AfEKeXEnyjr0+qae2XR6dZrRInToiKbvDz3FVDZW0r0QrHRrwJB/Q+sFwyjTPS4a4GD2x6z3HDIjeEsttWBicsznp+2Kn+2tjPwP64FKLfag7I4+t+YR2bBV2J7ay8T9fkkVusjm95oMck8LSTPyj6qZtOeKpGW02UdxTTanDPBaFoJ1Ks1p2Yx4yhKq+xS04H9VVSiyLjJEDahgLF0LG5YmtEqZKWFwmSeGCh9mQcQT04KWq8b4M6ThooAx5ETgdMjjyzyXUeKY54C49odPOFIyxOwnCd/6qY2K7lLjyjy05oNAQ1zs+KIo2aTkThofOeqJFMRrPwUlCmW65xpjrkPogwjfZXjTDfI+K0WvGnUGfHwU5YcjPjhn1PBbcyBi8RJwGE9UAHbB7W1LEHFtP2ge0dwktF4DBzXAHjIjHDcqpa+1j3vc97O85xc7HUmThGHJOTaWA6aRhOuOqWbQ2Yyr3m91x3DA81vHkZP1Aj2id+Dz/RcntA46Rxzjoga2zntJETCgdZXj7pTbYjcDCzbVazGHOdvMeSKHaAbikRpHctezO5GyJpYP9QN3Fcu260nGYGnHefX6Ibp3LV1Y4RYDm2bTY8RJGBGX4onrgRycRqgmWotiKmQgdwHAGYxGSChZCIwilSNGP26RBcDn7zQfOZA9c4jXBJllM8pb5hBrE21AG0yy9MhvdIgEn3gQTjwOSZu2q0/egefT6qvrEssak7YD/8AmbcgRC5dtEb0iWI2IBladpEiG+P0QPtnfiPio1iZRSAmFof+I+KlZa3j7xQqxFICx7E2qW4O9cVaqe3cMwvNrO+64HTXqnDXELly4lZ3YM7Spl1G1tb0dUNW2jfOfmq017lM2+VD5aR1LNZYKNox97zHxTGg/BVuy0Xa+SbWdxHD1vU5RKxkOGZZfVdOpA/sh6JICMpvU2UIvs43FbRd31KxbYpRfY7jhxI8iVMKZABAxEaj64c8c1Gytm08ue7h66rs1AP0iM9F6h80bDnYYCIz9H1C1XtD8Lt3THEQeM55KB1Y4DLDfgZ3KN4JO4HGNOu79UAcio4+9LuRu65YafRE06oGQI5fXVDhmGDTr14T68ljnu3H4dSg0JdVH3nc5B/ZaY6nvk9UL7SeS7ZTESM/10G5BhM5zD7rfUBboDOThoBmdI+O5QSZgYZDd4+tFvAZka6+JQBM+Jw+XWd+SHrlhzw6Lb3iIBz4RkoywuOgOXoIAGrMZoPFR07KMyPUJjTsRzcczpmd+BhEuswIwPw8SCVtm2LTY2u0jmNy6bsxuo9eKOebs4T8efBRAvcMAd4HKVgWD/yxkaT08fIqJ9gaN3rij2U3aiNfQ9QpWMnOB89N+OWeqAtig2Jv4PJcnZ24DTDn8E9cwEa7s8MPll4LTWYzdnLP4E64boyRYWxM3ZIjER60UFTZPqE9fhu8gMua0SNToJOfhHArbDcyrVbBHJDVLMQrZUpjfifWKAqWQH18fW5apMZSK4QtQm1bZ+75IGpZiFqkMmDrF0WkLkpjTJTTZ9cOFx2BGR3hK1tjiDIzCWUdyoaEtrssQa5pnMcEZZbUAccEssNuvDjqPoiXVJ0XJKLXDOyE12iy2a1U4GMnjHkCEX7ZugjnA/dVGnUIywRlKo45lScTohkLCy0DiT63IhloA1+KTU7TAjD4lSNfPDrikcSqmPftXrBYlzIgY6DUrFm03cJBaxqwefkpWOY7EgtO/CP0S+nUJXL3nDdOS9Gj50NcxmHeBnfh+xwUlmpj7paeu6M8PUIMUgRKhFOMsJ5ooB26hhN5k84/dDupjEw2MsCDymDKVe0J+C5+1H7uBRQDG6DMA8dfErgMA1w4g68eiXm2ncMBuClp28j7o0QAcaYyE8YgHkon0MIMRwGC4Zb5wiOKmvzCAIW04OB6rtlQDPLX1pnmpPYjPju3Lh9AHGB+qAOjUvQGg5Rv5YqF9JwzwG/9lstjEE+K5NQuMknRAHTaxwBP7Rl5Qp6FW6cDpOR13IUOxMhSR8fmgAh9QPEZRjGMYyg3sgnMjiRnwnNdEZmTgR9VyH4QdwK0DtojTXTDnG7FEsyn546+SFEEQRlh0Cmwyx0CwCWqwGHB+G6d/rgoSDOfo8+GimYQQZnLTPA588FOyg04bv148EALnNdv8SOPgsYwjG8csRHHTgi7rQYxyHrNbrUoF7yxz59D6yABxSaeenAzr64IetRG4eRRTmzuz+e7r5KJzceo+iAFtewA5YdCl1osJCsTmnfvUDyDpn9FqYykVt1AhROarS+xNI9ahBV9nAa6/T6ptxqYkY8gyMCmdmtk4HA/Hkha1niUK4IlFSKRm10P21FK2sd6RUrY5ueI80wpVpEqEsdF45Bmy1xl46qalascSlIcuw5TcS8cjLE23YDH4fRYlLHYDkFiNiN+az//2Q==";

export default Blackjack;

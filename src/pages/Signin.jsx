import { useContext } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { PlayerContext } from "../reducer/playerReducer";
import { toast } from "react-toastify";
import { redirect } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { handleSignin } = useContext(PlayerContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSigninClickButton = async () => {
    setIsLoading(true);
    const res = await handleSignin(name, username, password).then((r) => {
      setIsLoading(false);
      toast.info("Cadastro realizado com sucesso!");
      return r;
    });
    if (res.message) {
      toast.error(res.message);
    } else {
      redirect("/");
    }
  };
  return (
    <>
      <Flex
        minH={"80vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={6} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Cadastro
            </Heading>
          </Stack>
          <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
            <Stack spacing={4}>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>Nome</FormLabel>
                  <Input type="text" value={name} onChange={handleNameChange} />
                </FormControl>
              </Box>
              <FormControl id="username" isRequired>
                <FormLabel>Nome de usuário</FormLabel>
                <Input type="username" value={username} onChange={handleUsernameChange} />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Senha</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() => setShowPassword((showPassword) => !showPassword)}
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={!name || !username || !password ? "gray.400" : "blue.400"}
                  color={"white"}
                  _hover={{
                    bg: !name || !username || !password ? "gray.500" : "blue.500",
                  }}
                  cursor={(!name || !username || !password) && "not-allowed"}
                  onClick={handleSigninClickButton}
                  disabled={!name || !username || !password}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Já tem cadastro?{" "}
                  <Link href="/login" color={"blue.400"}>
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
      {isLoading && <LoadingOverlay />}
    </>
  );
};

export default Signin;

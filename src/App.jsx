import { Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Games from "./pages/Games";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import Blackjack from "./pages/games/Blackjack";
import User from "./pages/User";
import { useEffect, useState } from "react";
import { PlayerContext } from "./reducer/playerReducer";
import { authenticate, getPlayer, postNewPlayer, resetCoins } from "./api";
import { toast } from "react-toastify";

function App() {
  // const [state, dispatch] = React.useReducer(playerReducer, createPlayerInitialState);
  const [player, setPlayer] = useState();
  const handleLogoff = () => {
    setPlayer(null);
    localStorage.removeItem("player_id");
    toast.success("Você saiu com sucesso! Volte sempre");
  };
  const handleDelete = () => {
    setPlayer(null);
    localStorage.removeItem("player_id");
  };
  const handleLogin = async (username, password) => {
    const newPlayer = await authenticate(username, password);
    if (newPlayer) {
      setPlayer(newPlayer);
      localStorage.setItem("player_id", newPlayer.id);
      return true;
    } else {
      return false;
    }
  };
  const handleResetCoins = async () => {
    const response = await resetCoins(player);
    await findPlayer(player.id);
    return response;
  };
  const handleSignin = async (name, username, password) => {
    const res = await postNewPlayer({ name, username, password })
      .then((res) => res)
      .catch(() => false);
    return res;
  };

  const findPlayer = async (playerId) => {
    const newPlayer = await getPlayer(playerId);
    if (newPlayer) {
      setPlayer(newPlayer);
      return await newPlayer;
    }
    return null;
  };

  const contextValue = {
    player,
    handleLogoff,
    handleLogin,
    handleSignin,
    findPlayer,
    handleDelete,
    handleResetCoins,
  };
  useEffect(() => {
    const playerId = localStorage.getItem("player_id");

    if (playerId != null) {
      findPlayer(playerId);
    }
  }, []);
  return (
    <PlayerContext.Provider value={contextValue}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="games" element={<Games />} />
          <Route path="login" element={<Login />} />
          <Route path="signin" element={<Signin />} />
          <Route path="blackjack" element={<Blackjack />} />
          <Route path="user" element={<User />} />

          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </PlayerContext.Provider>
  );
}

export default App;

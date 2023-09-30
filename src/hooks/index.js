import { useEffect, useState } from "react";
import { authenticate, getPlayer } from "../api";

const usePlayer = () => {
  const [player, setPlayer] = useState(null);
  const [, startLoading, stopLoading] = useLoading();

  //TODO: retirar MOCK
  useEffect(() => {
    setTimeout(() => {}, 3000);
    findPlayer();
    // setPlayer({
    //   id: 1,
    //   name: "Thyago",
    //   username: "thymont",
    //   wallet: {
    //     coin_1: 5,
    //     coin_100: 1,
    //     coin_25: 5,
    //     coin_5: 4,
    //     coin_50: 5,
    //     total: 500,
    //   },
    // });
  }, []);

  const findPlayer = async () => {
    await startLoading();
    const playerId = localStorage.getItem("player_id");
    if (playerId != null) {
      const newPlayer = await getPlayer(playerId);
      setPlayer(newPlayer);
    }
    await stopLoading();
  };

  async function doLogin(username, password) {
    startLoading();
    const newPlayer = await authenticate(username, password);
    if (newPlayer) {
      localStorage.setItem("player_id", newPlayer.id);
      setPlayer(newPlayer);
      stopLoading();
      return newPlayer;
    } else {
      setPlayer(null);
      await stopLoading();
      return false;
    }
  }

  const doLogoff = () => {
    startLoading();
    localStorage.removeItem("player_id");
    setPlayer(null);
  };

  return [player, doLogin, doLogoff];
};

const useLoading = () => {
  const [isLoading, setLoading] = useState(true);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return [isLoading, startLoading, stopLoading];
};

export { usePlayer, useLoading };

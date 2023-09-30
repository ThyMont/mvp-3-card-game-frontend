import Axios from "axios";

const axios = Axios.create({
  baseURL: "http://localhost:5000",
  // baseURL: "http://172.17.0.2:5000",
});

const authenticate = async (username, password) => {
  const formdata = new FormData();
  formdata.set("username", username);
  formdata.set("password", password);
  return await axios
    .post("/login", formdata)
    .then((res) => res.data.player)
    .catch(() => null);
};

const getPlayer = async (id) => {
  return await axios
    .get(`/player/${id}`)
    .then((res) => res.data.player)
    .catch(() => null);
};

const postNewPlayer = async ({ name, username, password }) => {
  const formdata = new FormData();
  formdata.set("name", name);
  formdata.set("username", username);
  formdata.set("password", password);
  await axios.post("/player", formdata);
};

const beginBlackjackMatch = async (bet, player) => {
  const formData = new FormData();
  formData.set("coin_1", bet.coin_1);
  formData.set("coin_5", bet.coin_5);
  formData.set("coin_25", bet.coin_25);
  formData.set("coin_50", bet.coin_50);
  formData.set("coin_100", bet.coin_100);
  formData.set("player_id", player.id);

  const match = await axios
    .post("/blackjack/new", formData)
    .then((res) => res.data)
    .catch(console.log("deu ruim"));
  return match;
};
const hit = async (player) => {
  const formData = new FormData();
  formData.set("player_id", player.id);
  const match = await axios.get("/blackjack/hit/" + player.id).then((res) => res.data);
  return match;
};
const stand = async (player) => {
  const formData = new FormData();
  formData.set("player_id", player.id);
  const match = await axios.get("/blackjack/stand/" + player.id).then((res) => res.data);
  return match;
};
const double = async (player) => {
  const formData = new FormData();
  formData.set("player_id", player.id);
  const match = await axios.get("/blackjack/double/" + player.id).then((res) => res.data);
  return match;
};

const deleteAccount = async (player, password) => {
  console.log({ player, password });
  const formData = new FormData();
  formData.set("player_id", player.id);
  formData.set("password", password);
  const response = await axios.delete(`/player/${player.id}`);
  return response.data;
};

const resetCoins = async (player) => {
  const response = await axios.put(`/player/${player.id}/resetcoins`);
  return response.data;
};

export {
  authenticate,
  getPlayer,
  postNewPlayer,
  beginBlackjackMatch,
  hit,
  stand,
  double,
  deleteAccount,
  resetCoins,
};

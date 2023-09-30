import { createContext } from "react";
import { getPlayer } from "../api";
import { Immer } from "immer";

function playerReducer(state, action) {
  const fn = playerActions[action.type];
  if (fn) {
    const immer = new Immer();
    immer.immerable = true;

    return immer.produce(state, (draftState) => fn(draftState, action.payload));
  }
  console.log("[WARNING] Action without reducer:", action);
  return state;
  // switch (action.type) {
  //   case "doLogin": {
  //     return { ...state, ...action.newPlayer };
  //   }
  //   case "doLogin2": {
  //     return {
  //       ...state,
  //       id: 1,
  //       name: "Thyago",
  //       username: "thymont",
  //       wallet: {
  //         coin_1: 5,
  //         coin_100: 1,
  //         coin_25: 5,
  //         coin_5: 4,
  //         coin_50: 5,
  //         total: 500,
  //       },
  //     };
  //   }
  //   case "doLogout": {
  //     return null;
  //   }
  // }
  // throw Error("Unknown action: " + action.type);
}
// console.log("OIEE");
// const playerId = localStorage.getItem("player_id");
// let newPlayer = null;
// if (playerId != null) {
//   newPlayer = await getPlayer(playerId);
//   return {
//     player: newPlayer,
//     isLoggedIn: true,
//     loading: false,
//     error: null,
//   };
// }
const playerInitialState = {
  player: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};
// return {
//   player: {
//     id: 1,
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
// },
// isLoggedIn: false,
// loading: false,
// error: null,
// };

const playerActions = {
  login_pending: (state, payload) => {
    state.loading = true;
    state.isLoggedIn = false;
    state.error = null;
    state.player = null;
  },
  login_resolved: (state, payload) => {
    state.loading = false;
    state.isLoggedIn = true;
    state.error = null;
    state.player = payload.newPlayer;
  },
  login_rejected: (state, payload) => {
    state.loading = false;
    state.isLoggedIn = false;
    state.error = payload.message;
    state.player = null;
  },
};

// function createPlayerInitialState() {
//   return {
//     id: 1,
//     name: "Thyago",
//     username: "thymont",
//     wallet: {
//       coin_1: 5,
//       coin_100: 1,
//       coin_25: 5,
//       coin_5: 4,
//       coin_50: 5,
//       total: 500,
//     },
//   };
// }

const PlayerContext = createContext(null);
export {
  playerReducer,
  playerInitialState as createPlayerInitialState,
  playerActions,
  PlayerContext,
};

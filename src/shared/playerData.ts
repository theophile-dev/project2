export interface PlayerData {
  position: {
    x: number;
    y: number;
  };
  speed: {
    x: number;
    y: number;
  };
}

export interface GameState {
  [uuid: string]: PlayerData;
}
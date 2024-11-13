import type { GameState, PlayerData } from "./src/shared/playerData";


interface UserData{
  uuid: string
}

const gameState: GameState = {};

const server = Bun.serve<UserData>({
  port: 3000,
  fetch(req, server) {
    const uuid = req.url.split('/').at(-1);
    const success = server.upgrade(req, { data: { uuid: uuid } });
    return success
      ? undefined
      : new Response("WebSocket upgrade error", { status: 400 });
  },
  websocket: {
    open(ws) {
      // Initialize player data when a new connection is opened
      gameState[ws.data.uuid] = {
        position: { x: 0, y: 0 },
        speed: { x: 0, y: 0 },
      };
      // Subscribe client to the game-update channel
      ws.subscribe("game-update");
    },
    message(ws, message) {
      try {
        // Parse the incoming message as JSON and cast to player data structure
        const parsedMessage = JSON.parse(message as string) as PlayerData;
    
        // Update the player's state in gameState
        const playerId = ws.data.uuid;
        gameState[playerId] = {
          position: parsedMessage.position,
          speed: parsedMessage.speed,
        };
    
        //console.log(`Updated player ${playerId} state:`, gameState[playerId]);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    },
    close(ws) {
      // Remove player data when a connection is closed
      delete gameState[ws.data.uuid];
    },
  },
});

// Broadcast game state to all clients 24 times per second
setInterval(() => {
  const gameStateString = JSON.stringify(gameState);
  server.publish("game-update", gameStateString);
}, 1000 / 24);

console.log(`Listening on ${server.hostname}:${server.port}`);
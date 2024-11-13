import { Application, Assets, Sprite, Texture } from 'pixi.js';
import huli from '../res/huli1.png';
import { Player } from './player';
import type { GameState, PlayerData } from './shared/playerData';


function CreateWebSocketClient(playerUUID: string): WebSocket {
    let socket = new WebSocket("wss://hypsnowfrog.dev/ws/" + playerUUID);
    return socket;
}

/*
    socket.onopen = function (e) {
        socket.send("My name is John");
    };

    socket.onmessage = function (event) {
        alert(`[message] Data received from server: ${event.data}`);
    };
    socket.onclose = function (event) {
        if (event.wasClean) {
            alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {

            alert('[close] Connection died');
        }
    };

    socket.onerror = function (error) {
        alert(`[error]`);
    };
*/

    /*
    huliSprite.x = app.screen.width / 2;
    huliSprite.y = app.screen.height / 2;
    */

function addPlayer(playerData: PlayerData, playerTexture: Texture, application: Application, playerMap: PlayerMap, uuid: string) {
    const player = new Player(playerTexture, playerData);
    application.stage.addChild(player.getSprite());
    playerMap[uuid] = player;
}

export interface PlayerMap {
    [uuid: string]: Player;
}

export async function game() {

    const app = new Application();
    await app.init({ background: '#1099bb', resizeTo: window });
    document.body.appendChild(app.canvas);

    const playerMap: PlayerMap= {};
    const playerUUID = crypto.randomUUID()
    const ws = CreateWebSocketClient(playerUUID);

    const playerTexture = await Assets.load(huli);
    addPlayer({
        position: { x: 0, y: 0 },
        speed: { x: 0, y: 0 },
      }, playerTexture, app, playerMap, playerUUID)

    const mainPlayer = playerMap[playerUUID];


    document.addEventListener("pointermove", function (e) {
        mainPlayer.setSpeed(e.clientX, e.clientY);
    })

    app.ticker.add((time) => {
        for (const [key, value] of Object.entries(playerMap)) {
            value.update(time.deltaTime);
        }

    });

}
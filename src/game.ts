import { Application, Assets, Sprite } from 'pixi.js';
import huli from '../res/huli1.png';

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  
let s;

function WebSocketTest() {
    let socket = new WebSocket("wss://hypsnowfrog.dev/ws/test"+getRandomInt(2000));

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
}



export async function game() {

    WebSocketTest()

    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Load the bunny texture
    const texture = await Assets.load(huli);

    // Create a bunny Sprite
    const huliSprite = new Sprite(texture);

    // Center the sprite's anchor point
    huliSprite.anchor.set(0.5);

    // Move the sprite to the center of the screen
    huliSprite.x = app.screen.width / 2;
    huliSprite.y = app.screen.height / 2;

    app.stage.addChild(huliSprite);

    let targetX: number = app.screen.width / 2;
    let targetY: number = app.screen.height / 2;

    document.addEventListener("pointermove", function (e) {
        targetX = e.clientX;
        targetY = e.clientY;
    })
    // Listen for animate update
    let lastangle = 0;
    app.ticker.add((time) => {
        // Calculate the direction to the target
        let directionX = targetX - huliSprite.x;
        let directionY = targetY - huliSprite.y;

        // Calculate the angle for rotation
        let angle = Math.atan2(directionY, directionX);
        if (Math.abs(angle - lastangle) < 0.4) {
            huliSprite.rotation = angle;
        }
        lastangle = angle;


        // Calculate the distance to move each frame
        let distance = 8; // Adjust this value to control speed
        let distanceX = Math.cos(angle) * distance;
        let distanceY = Math.sin(angle) * distance;

        // Move the sprite
        huliSprite.x += distanceX * time.deltaTime;
        huliSprite.y += distanceY * time.deltaTime;
    });

}
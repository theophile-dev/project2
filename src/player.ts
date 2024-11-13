import { Sprite, type Texture } from "pixi.js";
import type { PlayerData } from "./shared/playerData";



export class Player {
    
    private sprite: Sprite;
    private data: PlayerData;
  
    constructor(texture: Texture, initialData: PlayerData) {
      this.data = initialData;
      this.sprite = new Sprite(texture);
      
      // Set the initial position of the sprite
      this.sprite.x = this.data.position.x;
      this.sprite.y = this.data.position.y;
    }
  
    // Method to update the player's state and position
    public update(deltaTime: number): void {
      // Update the position based on speed and deltaTime
      this.data.position.x += this.data.speed.x * deltaTime;
      this.data.position.y += this.data.speed.y * deltaTime;
  
      // Move the sprite to the new position
      this.sprite.x = this.data.position.x;
      this.sprite.y = this.data.position.y;

      // Update the rotation of the sprite based on the speed
      this.sprite.rotation = Math.atan2(this.data.speed.y, this.data.speed.x);
    }
  
    // Getter for the sprite
    public getSprite(): Sprite {
      return this.sprite;
    }
  
    // Getter for player data
    public getPlayerData(): PlayerData {
      return this.data;
    }

    public setSpeed(x: number, y:number) {
        this.data.speed.x = x;
        this.data.speed.y = y;
    }

    // Getter for player data
    public overridePlayerData(data: PlayerData) {
        this.data = data
        this.sprite.x = this.data.position.x;
        this.sprite.y = this.data.position.y;
    }
  }
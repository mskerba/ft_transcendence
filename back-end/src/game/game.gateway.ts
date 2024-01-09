import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import decodeJwtFromCookies from 'src/common/get-userId-from-cookie';
import { GameService } from './game.service';

class ballClass {
  constructor(player1SocketID, player2SocketID, player1ID, player2ID, server) {
    this.player1SocketID = player1SocketID;
    this.player2SocketID = player2SocketID;

    this.player1ID = player1ID;
    this.player2ID = player2ID;
    this.server = server;

    this.ball = {
      diameter: this.diameter,
      height: this.canva.height - this.diameter,
      width: this.canva.width / 2
    };
    this.score = { player1: 0, player2: 0 }

    this.sign = 1
    this.derection = {
      height: -9,
      width: this.speed
    };
  }

  private server;
  public player1ID;
  public player2ID;
  public player1SocketID;
  public player2SocketID;
  private canva = { width: 1080, height: 600 };
  private player1: number = 300;
  private player2: number = 300;
  private diameter = 35;
  private ball: any;
  public score: any
  private derection: any;
  private speed: number = 9;
  private sign: number;
  private paddleHeight = 140;
  private paddelWidth = 18;

  private handleGameLogic() {
    if (this.ball.height <= this.ball.diameter / 2 || this.ball.height >= this.canva.height - this.ball.diameter / 2)
      this.derection.height *= -1;

    this.restIsGoal();

    // //calculate green paddle 
    this.ballInPlayer1();

    // //calculate blue paddle 
    this.ballInPlayer2();


    this.ball.height += this.derection.height;
    this.ball.width += this.derection.width * this.sign;

    this.server.to(this.player1SocketID).emit('ballPosition', { ball: this.ball });
    this.server.to(this.player2SocketID).emit('ballPosition', { ball: this.ball });
  }

  private restIsGoal() {
    if (this.ball.width < 0 || this.ball.width >= this.canva.width) {
      if (this.ball.width < 0)
        this.score.player2++;
      else
        this.score.player1++;
      this.ball.height = this.canva.height - this.diameter;
      this.ball.width = this.canva.width / 2;
      this.server.to(this.player1SocketID).emit('score', { score: this.score });
      this.server.to(this.player2SocketID).emit('score', { score: this.score });

    }
  }

  private ballInPlayer1() {
    let sizeH = this.paddleHeight / 2 + this.ball.diameter / 2;
    let sizeW = this.paddelWidth + 5 + this.ball.diameter / 2;
    if ((this.player1 + sizeH > this.ball.height) && (this.player1 - sizeH < this.ball.height)
      && (sizeW >= this.ball.width)) {
      this.sign *= -1;
      this.derection.height = 9;
      this.derection.height = this.derectionY(this.ball.height - this.player1, this.derection.height);
    }
  }

  private ballInPlayer2() {
    let sizeH = this.paddleHeight / 2 + this.ball.diameter / 2;
    let sizeW = this.canva.width - this.paddelWidth - 5 - this.ball.diameter / 2;
    if ((this.player2 + sizeH > this.ball.height) && (this.player2 - sizeH < this.ball.height)
      && (sizeW <= this.ball.width)) {
      this.sign *= -1;
      this.derection.height = 9;
      this.derection.height = this.derectionY(this.ball.height - this.player2, this.derection.height);
    }
  }

  private derectionY(val: number, x: number): number {
    const mapVal = map(Math.abs(val), 0, this.paddleHeight / 2, 90, 120);
    const angle = (val > 0) ? 180 - mapVal : mapVal;
    const adjacent = (val > 0) ? this.canva.width - this.ball.width : this.ball.width;
    const hypotenuse = adjacent / Math.cos(radians(angle));
    const opposit = Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(adjacent, 2));
    const stepsXinc = opposit / x;
    let y = adjacent / stepsXinc;
    y = (y > 0.01) ? y : 0;
    if (!y)
      return y
    return y * (val / Math.abs(val));
  }


}

let person1;

@Injectable()
@WebSocketGateway({ namespace: '/game', cors: true }) // Added namespace here
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private gameTimeout: NodeJS.Timeout;
  private gameInterval: NodeJS.Timeout;
  private myMap = new Map();
  private connectedUsers = new Map();
  private connectedprivateUsers = new Map();

  constructor(private gameService: GameService) { }

  @WebSocketServer() server: Server;



  handleConnection(client: Socket) {

  const key = client?.handshake?.query?.key || '';
  console.log("the size of private map : ", this.connectedprivateUsers.size);
  const cookies = client?.handshake?.headers?.cookie;
  const userId: number | null = decodeJwtFromCookies(cookies);
  
  if (userId === null)
    return ;

  if (key != "") {
    if ([...this.connectedprivateUsers.values()].includes(key)){
      this.connectedprivateUsers.set({id:client.id, user:userId},key);
      this.startPrivateGame(key);
    }
    else 
      this.connectedprivateUsers.set({id:client.id, user:userId},key);
     

  } else if (![...this.connectedUsers.values()].includes(userId)) {

    let isUserInGame = false;
    
    for(const [key, value] of this.myMap) {
      if (value.player1ID === userId || value.player2ID === userId) {
        isUserInGame = true;
        break;
      }
      
    };

    if (!isUserInGame) {
      this.connectedUsers.set(client.id, userId);
    }

  }
  this.startGame();
  
    

  // .player1ID
}

  startPrivateGame(privateKey){
    let player1, player2, player1Id, player2Id;
    this.connectedprivateUsers.forEach((value, key) => {
      if (privateKey == value){
        if (!player1) {
          player1 = key.id;
          player1Id = key.user;
        }
        else {
          player2 = key.id;
          player2Id = key.user;
        }
      }
    })
    
    let i = 0;
    let objBallClass = new ballClass(player1, player2, player1Id, player2Id, this.server);
    this.connectedprivateUsers.forEach((value, key, index) => {
      if (privateKey == value) {
        this.server.to(key.id).emit('inGame', {});
        this.myMap.set(key.id, objBallClass);
        this.server.to(key.id).emit('playersinfo', { player1: player1Id, player2: player2Id });
      }});

    this.gameTimeout = setTimeout(() => {
      if (objBallClass.score.player1 != objBallClass.score.player2) {
        this.server.to(player1).emit('stopGame', {});
        this.server.to(player2).emit('stopGame', {});
      }
      else {
        setInterval(() => {
          if (objBallClass.score.player1 != objBallClass.score.player2) {
            this.server.to(player1).emit('stopGame', {});
            this.server.to(player2).emit('stopGame', {});
          }

        }, 16.5);

      }
    }, 60000);
    this.connectedprivateUsers.forEach((value, key, index) => {
      if (privateKey == value) {
        delete this.connectedprivateUsers[key];
        this.connectedprivateUsers.delete(key);
      }});

  }
  
  startGame() {
    if (this.connectedUsers.size > 1) {
      let player1, player2, player1Id, player2Id;
      this.connectedUsers.forEach((value, key) => {
        if (!player1) {
          player1 = key;
          player1Id = value;
        }
        else {
          player2 = key;
          player2Id = value;
        }
      })

      let i = 0;
      let objBallClass = new ballClass(player1, player2, player1Id, player2Id, this.server);
      this.connectedUsers.forEach((value, key, index) => {
        this.server.to(key).emit('inGame', {});
        this.myMap.set(key, objBallClass);

        this.server.to(key).emit('playersinfo', { player1: player1Id, player2: player2Id });
      });

      this.gameTimeout = setTimeout(() => {
        if (objBallClass.score.player1 != objBallClass.score.player2) {
          this.server.to(player1).emit('stopGame', {});
          this.server.to(player2).emit('stopGame', {});
        }
        else {
          setInterval(() => {
            if (objBallClass.score.player1 != objBallClass.score.player2) {
              this.server.to(player1).emit('stopGame', {});
              this.server.to(player2).emit('stopGame', {});
            }

          }, 16.5);

        }
      }, 60000);

      delete this.connectedUsers[player1];
      this.connectedUsers.delete(player1);
      delete this.connectedUsers[player2];
      this.connectedUsers.delete(player2);
    }
  }

  handleDisconnect(client: Socket) {

    this.connectedUsers.clear();


    this.connectedprivateUsers.forEach((value, key, index) => {
      if (key.id == client.id) {
        delete this.connectedprivateUsers[key];
        this.connectedprivateUsers.delete(key);
      }});

    if (this.myMap.has(client.id)) {

      let val = this.myMap.get(client.id);
      let player1 = val.player1SocketID;
      let player2 = val.player2SocketID;

      this.gameService.saveGame({
        player1Id : val.player1ID,
        player2Id : val.player2ID,
        player1Score: val.score.player1,
        player2Score: val.score.player2,
      });

      if (this.myMap.has(player1)) {
        delete this.myMap[player1];
        this.myMap.delete(player1)
      }
      if (this.myMap.has(player2)) {
        delete this.myMap[player2];
        this.myMap.delete(player2);
      }
      
      if (player1 == client.id)
        this.server.to(player2).emit('stopGame', {});
      else
        this.server.to(player1).emit('stopGame', {});

    }
    clearTimeout(this.gameTimeout);

    clearInterval(this.gameInterval);
  }



  @SubscribeMessage('gameball')
  handleGameBall(client: Socket, data: { player1: number, player2: number }) {
    if (this.myMap.has(client.id)) {
      this.myMap.get(client.id).handleGameLogic();
    }
  }

  @SubscribeMessage('gamepaddle')
  handleGamePaddle(client: Socket, data: { y: number }) {

    let val = this.myMap.get(client.id);
    if (client.id === val.player1SocketID)
      val.player1 = data.y;
    else
      val.player2 = data.y;

    this.server.to(val.player1SocketID).emit('paddlesPosition', { player1: val.player1, player2: val.player2 });
    this.server.to(val.player2SocketID).emit('paddlesPosition', { player1: val.player1, player2: val.player2 });
  }


}

function map(value: number, start1: number, stop1: number, start2: number, stop2: number): number {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

function radians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
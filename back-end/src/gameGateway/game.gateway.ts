import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

class ballClass {
  constructor(player2ID, player1ID, server) {
    this.player1ID = player1ID;
    this.player2ID = player2ID;
    this.server = server;

    this.ball = {
      diameter : this.diameter,
      height : this.canva.height - this.diameter,
      width : this.canva.width / 2
    };
    this.score = {player1:0, player2:0}

    this.sign = 1
    this.derection = {
      height : -this.speed ,
      width : 9
    };
  }
  private server;
  public player1ID;
  public player2ID;
  private canva = { width: 1080, height: 600 };
  private player1: number = 300;
  private player2: number = 300;
  private diameter = 25;
  private ball: any;
  private score:any
  private derection: any;
  private speed: number = 9;
  private sign: number;
  private paddleHeight = 140;
  private paddelWidth = 18;

  private handleGameLogic() {
    if (this.ball.height <= this.ball.diameter / 2 || this.ball.height >= this.canva.height - this.ball.diameter /2)
    this.derection.height *= -1;
  
    this.restIsGoal();
  
    // //calculate green paddle 
    this.ballInPlayer1();
    
    // //calculate blue paddle 
    this.ballInPlayer2();


    this.ball.height += this.derection.height;
    this.ball.width += this.derection.width * this.sign;

    this.server.emit('ballPosition', {ball:this.ball});
  }

  private restIsGoal()
  {
    if(this.ball.width < 0 || this.ball.width >= this.canva.width)
    {
        if (this.ball.width < 0)
            this.score.player2++;
        else
            this.score.player1++;
        this.ball.height = this.canva.height - this.diameter;
        this.ball.width = this.canva.width  / 2;
        this.server.emit('score', {score:this.score});
    }
  }

  private ballInPlayer1()
  {
    let sizeH = this.paddleHeight / 2 + this.ball.diameter / 2;
    let sizeW = this.paddelWidth + 5 + this.ball.diameter / 2;
    if ((this.player1 + sizeH >= this.ball.height) && (this.player1 - sizeH <= this.ball.height)
      && (sizeW >= this.ball.width))
    {
      this.sign *= -1;
      this.derection.height = 9;
      this.derection.height = this.derectionY(this.ball.height - this.player1, this.derection.height);
    }
  }

  private ballInPlayer2()
  {
    let sizeH = this.paddleHeight / 2 + this.ball.diameter / 2;
    let sizeW = this.canva.width - this.paddelWidth - 5 - this.ball.diameter / 2;
    if ((this.player2 + sizeH >= this.ball.height) && (this.player2 - sizeH <= this.ball.height)
      && (sizeW <= this.ball.width))
    {
      this.sign *= -1;
      this.derection.height = 9;
      this.derection.height = this.derectionY(this.ball.height - this.player2, this.derection.height);
    }
  }

  private derectionY(val: number, x: number): number {
    // console.log(val, x);
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
@WebSocketGateway({ namespace: '/game', cors: true }) // Added namespace here
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private gameTimeout: NodeJS.Timeout;
  private gameInterval: NodeJS.Timeout;
  private myMap = new Map();

  @WebSocketServer() server: Server;

  private connectedUsers: Set<string> = new Set();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.connectedUsers.add(client.id);

    // this.gameTimeout = setTimeout(() => {
    // this.server.to(this.person1.player1ID).emit('stopGame', {});
    // }, 60000);
    this.startGame()
  }
  
  startGame() {
    if (this.connectedUsers.size > 1) {
      let player1, player2;
      this.connectedUsers.forEach((element) => {
        if (!player1)
          player1 = element;
        else player2 = element;
      })

      let i = 0;
      let objBallClass = new ballClass(player1, player2, this.server);
      this.connectedUsers.forEach((element, index) => {
        this.server.to(element).emit('inGame', {});
        this.myMap.set( element, {obj:objBallClass,plyer:i++});
      });
      this.connectedUsers.clear();

    } 
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    
    this.connectedUsers.clear();
    clearTimeout(this.gameTimeout);
    
    clearInterval(this.gameInterval);
  }

  @SubscribeMessage('gameball')
  handleGameBall(client: Socket, data: { player1: number, player2: number }) { 
    if (this.myMap.has(client.id)) {
      this.myMap.get(client.id).obj.handleGameLogic();
    }
  }

  @SubscribeMessage('gamepaddle')
  handleGamePaddle(client: Socket, data: { player1: number, player2: number }) {
    if (this.myMap.has(client.id)) {
      this.myMap.get(client.id).obj.player1 = data.player1;
      this.myMap.get(client.id).obj.player2 = data.player2;
    }
  }
  
  
}

function map(value: number, start1: number, stop1: number, start2: number, stop2: number): number {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

function radians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
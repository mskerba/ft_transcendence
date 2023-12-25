import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/game', cors: true }) // Added namespace here
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private gameTimeout: NodeJS.Timeout;
  private gameInterval: NodeJS.Timeout;

  @WebSocketServer() server: Server;

  private canva = { width: 1080, height: 600 };
  private player1: number;
  private player2: number;
  private diameter = 25;
  private ball: any;
  private derection: any;
  private speed: number = 5;
  private sign: number;
  private paddleHeight = 140;
  private paddelWidth = 18;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);


    this.ball = {
      diameter : this.diameter,
      height : this.canva.height - this.diameter,
      width : this.canva.width / 2
    };

    this.sign = 1
    // const randomValue = 0.1 + Math.random() * (this.canva.height * 10 / 600 - 0.1);
    this.derection = {
      height : -this.speed ,
      width : 9
    };

    this.gameTimeout = setTimeout(() => {
      console.log('stopped game back');
      this.server.emit('stopGame', {});
    }, 60000);

    this.gameTimeout = setTimeout(() => { this.gameInterval = setInterval(() => {
      this.handleGameLogic();
      this.server.emit('ballPosition', {ball:this.ball});
    }, 20);
  }, 0);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    
    clearTimeout(this.gameTimeout);

    clearInterval(this.gameInterval);
  }

  @SubscribeMessage('gamepaddle')
  handleGamePaddle(client: Socket, data: { player1: number, player2: number }) {
    this.player1 = data.player1;
    this.player2 = data.player2;
    // console.log(`Received gamepaddle event from ${client.id}: ${data.player1} & ${data.player2}`);
    // this.server.emit('gamepaddleResponse', { message: `Received ${data.player1} & ${data.player2} from ${client.id}` });
  }
  
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

  }

  private restIsGoal()
  {
    if(this.ball.width < 0 || this.ball.width >= this.canva.width)
    {
      // console.log(this.canva.width,'->>>',this.ball)
      // const randomValue = 0.1 + Math.random() * (this.canva.height * 10 / 600 - 0.1);
      // this.derection.y = -randomValue;
      this.ball.height = this.canva.height - this.diameter;
      this.ball.width = this.canva.width  / 2;
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
      // this.derection.height = this.derectionY(this.ball.width - this.player2, this.derection.x);
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
      // this.derection.height = this.derectionY(this.ball.width - this.player2, this.derection.x);
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
    return y * (val / Math.abs(val));
  }
  
  
}

function map(value: number, start1: number, stop1: number, start2: number, stop2: number): number {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

function radians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
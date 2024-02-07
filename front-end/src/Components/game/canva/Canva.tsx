// @ts-ignore
import React, { useEffect, useRef, useState } from 'react';
import p5, { Color } from 'p5';
import io from 'socket.io-client';
import '../Game.css';
import { Socket } from 'socket.io-client/debug';
import { Height } from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';


let p5Instance: any;
let canva:any;
let player1:any;
let player2:any;
let diam:any = 35;
let ball:any;
let derection:any;
let speed:any = 9;
let sign:any;
let paddleHeight:any;
let paddelWidth:any;
let y:any;
let PowerUpApp :typePowerUpApp;
let showPowerUp :typeShowPowerUp;
let minimizeImg:any;
let augmentImg:any;
let freezOppImg:any;

type typeShowPowerUp = {
  show: boolean;
  x: number;
  y: number;
  type: string;
};

type typePowerUpApp = {
  show: boolean;
  playerId: number;
  player: string;
  type: string;
};

const P5Component = (props: any) => {
  let canvas: any;
  const {authUser} :any= useAuth();
  
  const times = useRef(props.time);
  
  useEffect(() => {
    times.current = props.time;
  }, [props.time]);


  useEffect(() => {    const sketch = (p: any) => {

    p.preload = () => {
      minimizeImg = p.loadImage('src/assets/minimize.svg');
      augmentImg = p.loadImage('src/assets/augment.svg');
      freezOppImg = p.loadImage('src/assets/freezOpp.svg');
    }

    p.setup = () => {
      const container = document.querySelector('.canva');


      canva= {x : props.size.width, y : props.size.width / 1.8}
      canvas = p.createCanvas(canva.x, canva.y);
      canvas.parent(container);
      player1 = canva.y / 2;
      player2 = canva.y / 2;

      let diameter = canva.x * diam /600;
      if (!ball)
      {
        ball = {
          diameter : diameter,
          x : canva.x / 2,
          y : canva.y  - diameter//ball.diameter 
        };
        showPowerUp  = {
          show: false,
          x: 0,
          y: 0,
          type: ""
        };
        
        PowerUpApp = {
          show: false,
          playerId: 0,
          player: "",
          type: "",
        };
      }
      paddleHeight = canva.y * 70 /300;
      paddelWidth = canva.x * 10 /600;
    };

    p.draw = () => {
      if ((p.mouseY > paddleHeight / 2) && (p.mouseY < canva.y - paddleHeight / 2))
        y = p.mouseY;
      else if (p.mouseY < paddleHeight / 2)
        y = paddleHeight / 2;
      else
        y = canva.y - paddleHeight / 2;
      shapesDraw()
      props.socket.current.emit('gameball',{'time': times});
    };

    function shapesDraw()
    {
      p.background(44, 43, 43);

      p.rectMode(p.CENTER);

      p.fill('rgb(160,160,46)')
      
      p.circle(ball.width * canva.x/1080, ball.height * canva.y / 600, ball.diameter * canva.y / 600)

      p.noStroke()

      p.fill('red');
      if (PowerUpApp.show && PowerUpApp.player == "player2" && PowerUpApp.type == 'minimizePaddle')
        p.rect(paddelWidth/2 + 5, player1, paddelWidth, paddleHeight*0.7, 5, 5);
      else if (PowerUpApp.show && PowerUpApp.player == "player1" && PowerUpApp.type == 'augmentPaddle')
        p.rect(paddelWidth/2 + 5, player1, paddelWidth, paddleHeight*1.3, 5, 5);
      else
        p.rect(paddelWidth/2 + 5, player1, paddelWidth, paddleHeight, 5, 5);

      p.fill('green');
      if (PowerUpApp.show && PowerUpApp.player == "player1" && PowerUpApp.type == 'minimizePaddle')
        p.rect(canva.x - paddelWidth/2 - 5, player2, paddelWidth, paddleHeight*0.7, 5, 5);
      else if (PowerUpApp.show && PowerUpApp.player == "player2" && PowerUpApp.type == 'augmentPaddle')
          p.rect(canva.x - paddelWidth/2 - 5, player2, paddelWidth, paddleHeight*1.3, 5, 5);
      else
        p.rect(canva.x - paddelWidth/2 - 5, player2, paddelWidth, paddleHeight, 5, 5);

      if (showPowerUp.show == true)
        powerUpDrawe(); 
    }

    function powerUpDrawe() {
      p.rectMode(p.CENTER);
      
      const circleX = showPowerUp.x * canva?.x / 1080;
      const circleY = showPowerUp.y * canva?.y / 600;
      const circleSize = 60 * canva?.y / 600;
      
      // Draw the circle
      
      // Load your icon image
      const iconSize = 40 * canva?.y / 600; // Adjust the size of the icon
      const iconX = circleX - iconSize / 2;
      const iconY = circleY - iconSize / 2;
      try {
        
        if (showPowerUp.type === "minimizePaddle") {
          p.image(minimizeImg, iconX, iconY, iconSize, iconSize);
          p.fill('aqua');
        }
        else if (showPowerUp.type === "freezOpp"){
          p.image(freezOppImg, iconX, iconY, iconSize, iconSize);
          p.fill('turquoise');
        }
        else if (showPowerUp.type === "augmentPaddle"){
          p.image(augmentImg, iconX, iconY, iconSize, iconSize);
          p.fill('blue');
        }
      } catch(error)
      {
        // console.log("!Error", error)
      }
      p.circle(circleX, circleY, circleSize);
    }
    
    
  };
  
  function handleWindowMouseMove(event:any) {
    if (PowerUpApp?.show == true && PowerUpApp?.playerId != authUser?.userId && PowerUpApp?.type == 'freezOpp')
      return ;

    props?.socket?.current?.emit('gamepaddle', {'y': y * 600 / canva?.y});
  }  

  
  if (!p5Instance) {
    p5Instance = new p5(sketch);
  }


  const ballPositionListener = (data:any) => {
    ball = data.ball;
    PowerUpApp = data.PowerUpApp;
    showPowerUp = data.showPowerUp;
    if (PowerUpApp.show)
      console.log("PowerUpApp===>>>", PowerUpApp);
  }
  
  const paddlesPositionListener = (data:any) => {
    player1 = data.player1 * canva?.y / 600;
    player2 = data.player2 * canva?.y / 600;
  }

  setTimeout(()=>{
    if (props.socket && props.socket.current) {
      props.socket.current.on('ballPosition', ballPositionListener);
      props.socket.current.on('paddlesPosition', paddlesPositionListener);
  }}, 0);

  window.addEventListener('mousemove', handleWindowMouseMove);

  return () => {
    p5Instance.remove();
    p5Instance = null;
    window.removeEventListener('mousemove', handleWindowMouseMove,);
    if (props.socket.current)
      props.socket.current.off('ballPosition', ballPositionListener);

  };

  }, [props.size, props.socket]);

  return null;
};


const Canva = (props: any) => {
  let [style, setStyle] = useState({
    width: `${props.size.width - 20}`,
    height: `${(props.size.width - 20) / 1.8}`,
  });
  let [canvaSize, setCanvaSize] = useState({
    width: props.size.width - 20,
    height: (props.size.width - 20) / 1.8,
  });

  useEffect(() => {
    setStyle((prev: any) => {
      return {
        ...prev,
        width: `${props.size.width - 20}px`,
        height: `${(props.size.width - 20) / 1.8}px`,
      };
    });
    setCanvaSize((prev: any) => {
      return {
        ...prev,
        width: props.size.width - 20,
        height: (props.size.width - 20) / 1.8,
      };
    });
  }, [props.size]);

  return (
    <div className={`${props.className} grow`} style={style}>
      <P5Component size={canvaSize} socket={props.socket}  time={props.time}/>
    </div>
  );
};

export default Canva;

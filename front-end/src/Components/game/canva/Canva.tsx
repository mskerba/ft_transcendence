import React, { useEffect, useState } from 'react';
import p5, { Color } from 'p5';
import io from 'socket.io-client';
import '../Game.css';
import { Socket } from 'socket.io-client/debug';
import { Height } from '@mui/icons-material';

let p5Instance: any;
let canva:any;
let player1:any;
let player2:any;
let diam:any = 25;
let ball:any;
let derection:any;
let speed:any = 9;
let sign:any;
let paddleHeight:any;
let paddelWidth:any;
let y:any;

const P5Component = (props: any) => {
  let canvas: any;

  useEffect(() => {    const sketch = (p: any) => {
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
      props.socket.current.emit('gameball');
    };

    
    function shapesDraw()
    {
      p.background(44, 43, 43);

      p.rectMode(p.CENTER);

      p.fill('rgb(160,160,46)')
      
      p.circle(ball.width * canva.x/1080, ball.height * canva.y / 600, ball.diameter * canva.y / 600)

      p.noStroke()

      p.fill('red');
      p.rect(paddelWidth/2 + 5, player1, paddelWidth, paddleHeight, 5, 5);

      p.fill('green');
      p.rect(canva.x - paddelWidth/2 - 5, player2, paddelWidth, paddleHeight, 5, 5);  
    }

    
    
  };
  
  function handleWindowMouseMove(event:any) {
    props.socket.current.emit('gamepaddle', {'y': y * 600 / canva.y});
  }  

  
  if (!p5Instance) {
    p5Instance = new p5(sketch);
  }


  const ballPositionListener = (data:any) => {
    ball = data.ball;
  }
  
  const paddlesPositionListener = (data:any) => {
    player1 = data.player1 * canva.y / 600;
    player2 = data.player2 * canva.y / 600;
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
      <P5Component size={canvaSize} socket={props.socket} />
    </div>
  );
};

export default Canva;

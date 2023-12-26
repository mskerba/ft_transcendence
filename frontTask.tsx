import React, { useEffect, useState, useCallback } from 'react';
import p5 from 'p5';
import '../Game.css';

const P5Component = ({ size, socket }) => {
  let canva:any;
  let player1:any;
  let player2:any;
  let derection:any;
  let speed:any = 15;
  let sign:any;
  let paddelWidth:any;
        const playerRefs = {
    player1: size.height / 2,
    player2: size.height / 2,
  };

  let ball;
  const paddleHeight:any = size.height * 70 / 300;
  const paddleWidth:any = size.width * 10 / 600;
  const diam = 25;

  useEffect(() => {
    const paddleControl = (event) => {
      const paddeleMv = size.height * 10 / 300;
      // Use the refs for storing player positions
      if (playerRefs.player1 > paddleHeight / 2 + paddeleMv && event.keyCode === 87) {
        playerRefs.player1 -= paddeleMv;
      } else if (playerRefs.player1 < size.height - paddeleMv - paddleHeight / 2 && event.keyCode === 83) {
        playerRefs.player1 += paddeleMv;
      }
      if (playerRefs.player2 > paddleHeight / 2 + paddeleMv && event.keyCode === 38) {
        playerRefs.player2 -= paddeleMv;
      } else if (playerRefs.player2 < size.height - paddeleMv - paddleHeight / 2 && event.keyCode === 40) {
        playerRefs.player2 += paddeleMv;
      }

      socket.current.emit('gamepaddle', {
        'player1': playerRefs.player1 * 1080 / size.width,
        'player2': playerRefs.player2 * 600 / size.height
      });
    };

    const handleKeyDown = (event) => {
      paddleControl(event);
    };

    // Add the event listener on mount
    window.addEventListener('keydown', handleKeyDown);

    // Create p5 canvas instance
    let canvas = new p5((p) => {
      p.setup = () => {
        p.createCanvas(size.width, size.height).parent('.canva');
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
        p.background(44, 43, 43);
  
        p.rectMode(p.CENTER);
  
        p.fill('rgb(160,160,46)')
        
        p.circle(ball.width * canva.x/1080, ball.height * canva.y / 600, ball.diameter )
  
        p.noStroke()
  
        p.fill('blue');
        p.rect(paddelWidth/2 + 5, player1, paddelWidth, paddleHeight, 5, 5);
  
        p.fill('green');
        p.rect(canva.x - paddelWidth/2 - 5, player2, paddelWidth, paddleHeight, 5, 5);
      };
    });

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.remove(); // Assuming that this will clean up the p5 instance
    };

  }, [size, socket]);

  return null; 
};

const Canva = ({ size, className, socket }) => {
  const [style, setStyle] = useState({
    width: size.width - 20,
    height: (size.width - 20) / 1.8,
  });

  useEffect(() => {
    setStyle({
      width: size.width - 20,
      height: (size.width - 20) / 1.8,
    });
  }, [size]);

  return (
    <div className={`${className} grow`} style={style}>
      <P5Component size={size} socket={socket} />
    </div>
  );
};

export default Canva;
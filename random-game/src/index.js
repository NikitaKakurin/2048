import './style/normalize.css';
import './style/style.scss'; 
import './style/header.scss'
import './style/game2048.scss';
import './statistic/statistic.scss';
import './ads/ads.scss';
import './style/buttons.scss';
import './style/footer.scss';

import { Game2048 } from './Script2048/g2048';
import Statistic from './statistic/statistic'
let log = (param)=> console.log(param);

const btnNewGame = document.querySelector('game__new-game-btn');

const statistic = new Statistic('.game__statistic')
const g2048 = new Game2048('.game__2048-container');

document.addEventListener('click', handleClick);
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('keydown', handleKeyDown);

// window.addEventListener('beforeunload', handleUnload);

// function handleUnload(event){
//     g2048.copyPreviousBoard();
//     g2048.setLocalStorageLastPosition();
// }

function handleKeyDown(event){
    if(event.code==="KeyW" || event.code==="ArrowUp"){
        g2048.moveUp()
    }
    if(event.code==="KeyS" || event.code==="ArrowDown"){
        g2048.moveDown()
    }
    if(event.code==="KeyA" || event.code==="ArrowLeft"){
        g2048.moveLeft()
    }
    if(event.code==="KeyD" || event.code==="ArrowRight"){
        g2048.moveRight()
    }
}

function handleMouseDown(event){
    const target =  event.target

    if(target.closest('.game__2048-container')){
        getStartSwipe(event);
    }
}


function handleClick(event){
    const target =  event.target
    if(target.classList.contains('game__new-game-btn')){
        g2048.initGame();
    }

    if(target.classList.contains('up')){
        g2048.moveUp();
         return;
    }
    if(target.classList.contains('down')){
        g2048.moveDown();
        return;
    }
    if(target.classList.contains('left')){
        g2048.moveLeft();
        return;
    }
    if(target.classList.contains('right')){
        g2048.moveRight();
        g2048.initGameOver();
        return;
    }

    if(target.classList.contains('game__statistic-close-btn')){
        statistic.hideStatistic();
    }

    if(target.classList.contains('game-container__show-stat-btn')){
        g2048.setPropertyGame();
        statistic.renderStatistic();
        statistic.showStatistic();
    }

    if(target.classList.contains('game-container__step-back')){
        g2048.renderPreviousBoard();
    }

    
}

function getStartSwipe(event){
  const initX = event.clientX;
  const initY = event.clientY;

  document.addEventListener("mouseup",handleEndSwipe);

  function handleEndSwipe(event){
    const endX = event.clientX;
    const endY = event.clientY;
    const shiftX = endX - initX;
    const shiftY = endY - initY;

    if(Math.abs(shiftX)>Math.abs(shiftY)){
        getHorizontalDirection()
    }else if(Math.abs(shiftX)<Math.abs(shiftY)){
        getVerticalDirection()
    }

    function getHorizontalDirection(){
        if(shiftX>30){
            g2048.moveRight();
        }else if(shiftX<-30){
            g2048.moveLeft();
        }
    }

    function getVerticalDirection(){
        if(shiftY>30){
            g2048.moveDown();
        }else if(shiftY<-30){
            g2048.moveUp();
        }
    }
    document.removeEventListener("mouseup",handleEndSwipe);
  }
}

export {statistic, g2048};

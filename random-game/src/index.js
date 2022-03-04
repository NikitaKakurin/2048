import './style/normalize.css';
import './style/style.scss'; 
import './style/header.scss';
import './style/select.scss';
import './style/game2048.scss';
import './statistic/statistic.scss';
import './style/rules.scss';
import './ads/ads.scss';
import './style/buttons.scss';
import './style/footer.scss';
import './style/confirm.scss';
import './style/media.scss';

// document.addEventListener('load',)


import { Game2048 } from './script2048/g2048';
import Statistic from './statistic/statistic';
let log = (param)=> console.log(param);



    function handleTouchStart(event){
        event.preventDefault()
        getStartSwipe(event);
    }


    function handleUnload(event){
        g2048.copyPreviousBoard();
        g2048.setLocalStorageLastPosition();
    }

    function handleKeyDown(event){
        if(event.code==='KeyW' || event.code==='ArrowUp'){
            g2048.moveUp()
        }
        if(event.code==='KeyS' || event.code==='ArrowDown'){
            g2048.moveDown()
        }
        if(event.code==='KeyA' || event.code==='ArrowLeft'){
            g2048.moveLeft()
        }
        if(event.code==='KeyD' || event.code==='ArrowRight'){
            g2048.moveRight()
        }
    }

    function handleMouseDown(event){
        const target =  event.target

        if(target.closest('.game__2048-container')){
            getStartSwipe(event);
        }
    }


    // function getStartTouch(event){
        
    //     const initX = event.touches[0].clientX;
    //     const initY = event.touches[0].clientY;

    //     document.addEventListener("touchend",handleEndSwipe);
 
    //     function handleEndSwipe(event){
    //       const endX = event.changedTouches[0].clientX;
    //       const endY = event.changedTouches[0].clientY;
    //       const shiftX = endX - initX;
    //       const shiftY = endY - initY;
  
    //       if(Math.abs(shiftX)>Math.abs(shiftY)){
    //           getHorizontalDirection()
    //       }else if(Math.abs(shiftX)<Math.abs(shiftY)){
    //           getVerticalDirection()
    //       }
  
    //       function getHorizontalDirection(){
    //           if(shiftX>30){
    //               g2048.moveRight();
    //           }else if(shiftX<-30){
    //               g2048.moveLeft();
    //           }
    //       }
  
    //       function getVerticalDirection(){
    //           if(shiftY>30){
    //               g2048.moveDown();
    //           }else if(shiftY<-30){
    //               g2048.moveUp();
    //           }
    //       }
    //           document.removeEventListener('touchend',handleEndSwipe);
    //     }
    //   }

    function handleClick(event){
        const target =  event.target
        if(target.classList.contains('game__new-game-btn')){
            newConfirm.classList.add('game__new-game-confirm--show')
            return;
        }

        if(target.classList.contains('game__new-game-hard-btn')){
            g2048.mode = 'hard';
            g2048.levelTheBoard();
            newConfirm.classList.remove('game__new-game-confirm--show');
            return;
        }
        if(target.classList.contains('game__new-game-normal-btn')){
            g2048.mode = 'normal';
            g2048.levelTheBoard();
            newConfirm.classList.remove('game__new-game-confirm--show');
            return;
        }
        if(target.classList.contains('game__new-game-confirm-close-btn')){
            newConfirm.classList.remove('game__new-game-confirm--show')
            return;
        }
        // if(target.classList.contains('up')){
        //     g2048.moveUp();
        //      return;
        // }
        // if(target.classList.contains('down')){
        //     g2048.moveDown();
        //     return;
        // }
        // if(target.classList.contains('left')){
        //     g2048.moveLeft();
        //     return;
        // }
        // if(target.classList.contains('right')){
        //     g2048.moveRight();
        //     g2048.initGameOver();
        //     return;
        // }

        if(target.classList.contains('game__statistic-close-btn')){
            statistic.hideStatistic();
            return;
        }

        if(target.classList.contains('game-container__show-stat-btn')){
            g2048.setPropertyGame();
            statistic.renderStatistic();
            statistic.showStatistic();
            return;
        }

        if(target.classList.contains('game-container__step-back')){
            g2048.renderPreviousBoard();
            return;
        }
        if(target.classList.contains('game-container__show-rules')){
            rules.classList.add('game__rules--show');
            return;
        }
        if(target.classList.contains('game__rules-close-btn')){
            rules.classList.remove('game__rules--show');
            return;
        }
    }

    function getStartSwipe(event){
      let initX = event.clientX;
      let initY = event.clientY;
        if(event.type==='mousedown'){
            initX = event.clientX;
            initY = event.clientY;
            document.addEventListener("mouseup",handleEndSwipe);
        }else if(event.type==='touchstart'){
            initX = event.touches[0].clientX;
            initY = event.touches[0].clientY;
            document.addEventListener("touchend",handleEndSwipe);
        }

        function handleEndSwipe(event){
        let endX;
        let endY;
        if(event.type==='mouseup'){
            endX = event.clientX;
            endY = event.clientY;
            document.removeEventListener("mouseup", handleEndSwipe);
        }else if(event.type==='touchend'){
            endX = event.changedTouches[0].clientX;
            endY = event.changedTouches[0].clientY;
            document.removeEventListener("touchend", handleEndSwipe);
        }

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
      }
    }

const newConfirm = document.querySelector('.game__new-game-confirm');
const containerSquares = document.querySelector('.game__2048-container');
const rules = document.querySelector('.game__rules');
let statistic;
let g2048;

function init(){
    statistic = new Statistic('.game__statistic');
    g2048 = new Game2048('.game__2048-container');
    document.addEventListener('click', handleClick);
    document.addEventListener('mousedown', handleMouseDown, false);
    document.addEventListener('keydown', handleKeyDown);
    containerSquares.addEventListener('touchstart', handleTouchStart,{'passive':false})
    window.addEventListener('beforeunload', handleUnload);
}


function ready(){
    if(document.readyState !='loading'){
        init();
    }else{
        document.addEventListener('DOMContentLoaded',()=>{
            init();
        })
    }
}
setTimeout(()=>{
    ready();
},500)






export {statistic, g2048};
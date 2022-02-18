import {g2048}  from '../index.js';

class Statistic{
    constructor(selector){
        this.container = document.querySelector(selector);
        this.ads = this.container.querySelector('.game-ads');
        this.currentGame = this.container.querySelector('.game-statistic-current');
        this.maxGame = this.container.querySelector('.game-statistic-maximum');
        this.history = this.container.querySelector('.game-statistic-history');
        this.currAndMax = this.container.querySelector('.game-statistic-current-and-max');
        this.gameAds = this.container.querySelector('.game-ads');
    }

    showStatistic(){
        this.container.classList.add('game-statistic--show');
    }

    hideStatistic(){
        this.container.classList.remove('game-statistic--show');
    }

    renderAds(value){
        this.gameAds.innerHTML=value;
    }

    renderStatistic(){
        this.history.innerHTML = "";
        this.currAndMax.innerHTML = "";

        console.log(g2048.propertyGame)
        console.log(g2048.statisticObj)
    
    let currAndMaxFrag = document.createDocumentFragment();
    currAndMaxFrag.append(this.renderOneRow("Current", 
                            g2048.propertyGame.score,
                            g2048.propertyGame.value,
                            g2048.propertyGame.steps,
                            g2048.propertyGame.time))
    
    currAndMaxFrag.append(this.renderOneRow("Max", 
                            g2048.statisticObj.maximum.score,
                            g2048.statisticObj.maximum.value,
                            g2048.statisticObj.maximum.steps,
                            g2048.statisticObj.maximum.time))
    
    this.currAndMax.append(currAndMaxFrag);

    let fragment = document.createDocumentFragment();
    
    g2048.statisticObj.history.forEach((game, index) => {
        fragment.append(this.renderOneRow(index+1, game.score, game.value, game.steps, game.time))
    });

    this.history.append(fragment);
    }

    renderOneRow(number, score, value, steps, time){
debugger
        const statisticItem = createOneElement('div','game-statistic-item');
        const statisticNumber = createOneElement('div','game-statistic-number',number);
        const statisticScore = createOneElement('div','game-statistic-score',score);
        const statisticValue = createOneElement('div','game-statistic-value',value);
        const statisticSteps = createOneElement('div','game-statistic-steps',steps);
        const statisticTime = createOneElement('div','game-statistic-time',time);

        statisticItem.append(statisticNumber,
                            statisticScore, 
                            statisticValue,
                            statisticSteps,
                            statisticTime)
        return statisticItem;
    }

   
}
function createOneElement(tag, className, value){
    const elem = document.createElement(tag);
    elem.classList.add(className);
    elem.innerHTML = value||"";
    return elem;
}


export default Statistic;
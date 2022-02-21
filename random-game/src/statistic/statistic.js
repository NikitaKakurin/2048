import {g2048}  from '../index.js';

class Statistic{
    constructor(selector){
        this.container = document.querySelector(selector);
        this.ads = this.container.querySelector('.game__ads');
        this.currentGame = this.container.querySelector('.game__statistic-current');
        this.maxGame = this.container.querySelector('.game__statistic-maximum');
        this.history = this.container.querySelector('.game__statistic-history');
        this.currAndMax = this.container.querySelector('.game__statistic-current-and-max');
        this.gameAds = this.container.querySelector('.game__ads');
    }

    showStatistic(){
        this.container.classList.add('game__statistic--show');
    }

    hideStatistic(){
        this.container.classList.remove('game__statistic--show');
        this.renderAds("");
    }

    renderAds(value, data){
        this.gameAds.innerHTML=value;
        this.gameAds.dataset.ads = data;
    }

    renderStatistic(){
        this.history.innerHTML = "";
        this.currAndMax.innerHTML = "";

    this.statisticObj = localStorage.getItem('statisticObj')?JSON.parse(localStorage.getItem('statisticObj')):
        {"maximum":{'steps':0,'score':0, 'time':'00:00', 'value':0,'mode':'normal'},'history':[]};

    
    let currAndMaxFrag = document.createDocumentFragment();
    currAndMaxFrag.append(this.renderOneRow("Current", 
                            g2048.propertyGame.score,
                            g2048.propertyGame.value,
                            g2048.propertyGame.steps,
                            g2048.propertyGame.time,
                            g2048.propertyGame.mode))
    
    currAndMaxFrag.append(this.renderOneRow("Max", 
                            this.statisticObj.maximum.score,
                            this.statisticObj.maximum.value,
                            this.statisticObj.maximum.steps,
                            this.statisticObj.maximum.time,
                            this.statisticObj.maximum.mode))
    
    this.currAndMax.append(currAndMaxFrag);

    let fragment = document.createDocumentFragment();
    
    this.statisticObj.history.forEach((game, index) => {
        fragment.append(this.renderOneRow(index+1, game.score, game.value, game.steps, game.time, game.mode))
    });

    this.history.append(fragment);
    }

    renderOneRow(number, score, value, steps, time, mode){
debugger
        const statisticItem = createOneElement('div','game__statistic-item');
        const statisticNumber = createOneElement('div','game__statistic-number',number);
        const statisticScore = createOneElement('div','game__statistic-score',score);
        const statisticValue = createOneElement('div','game__statistic-value',value);
        const statisticSteps = createOneElement('div','game__statistic-steps',steps);
        const statisticTime = createOneElement('div','game__statistic-time',time);
        const statisticMode = createOneElement('div','game__statistic-time',mode);

        statisticItem.append(statisticNumber,
                            statisticScore, 
                            statisticValue,
                            statisticSteps,
                            statisticTime,
                            statisticMode)
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
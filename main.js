(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

var Decimal = require("break_infinity.js");

$(document).ready(function(){

//Variables
//Main currency
let fish = {
    count : 1,
    value : 1,
    multi : 1,
    perSecond: 0,
    lifetime: 0
};
let gamestage = 0;
let fishUpgrade = [
    {
        desc: "Fish Collection +1",
        cost : 10,
        costMulti : 1.2,
        countIncrease : 1,
        level : 0,
        displaying: true
    },
    {
        desc: "Fish Collection +10",
        cost : 100,
        costMulti : 1.25,
        countIncrease : 10,
        level : 0,
        displaying: true
    },
    {
        desc: "Fish Collection +1k",
        cost : 5000,
        costMulti : 1.25,
        countIncrease : 1000,
        level : 0,
        displaying: false
    },
    {
        desc: "Fish Collection +50k",
        cost : 100000,
        costMulti : 1.25,
        countIncrease : 50000,
        level : 0,
        displaying: false
    }
];
let automationUpgrade = [
    {
        desc: "Auto Fishing + 10/s",
        cost : 100,
        costMulti : 1.25,
        countIncrease : 10,
        level : 0,
        displaying: false
    },
    {
        desc: "Auto Fishing + 1k/s",
        cost : 10000,
        costMulti : 1.15,
        countIncrease : 1000,
        level : 0,
        displaying: false
    },
    {
        desc: "Auto Fishing + 10k/s",
        cost : 100000,
        costMulti : 1.15,
        countIncrease : 10000,
        level : 0,
        displaying: false
    },
    {
        desc: "Auto Fishing + 1m/s",
        cost : 900000,
        costMulti : 1.15,
        countIncrease : 1000000,
        level : 0,
        displaying: false
    }
];
let shopUpgrades = [
    {
        desc : "Unlock Auto Fishing",
        name : "autoFishUnlock",
        cost : 2500, //2.5k
        bought: false,
    },
    {
        desc : "Unlock Fish Multi",
        name : "multiUnlock",
        cost : 1000000000, //1b
        bought: false,
    },
    {
        desc : "Unlock Buy Max for Fish/Click",
        name : "maxBuyUnlockClick",
        cost : 10000, //10k
        bought: false,
    },
    {
        desc : "Unlock Buy Max for Auto Fish",
        name : "maxBuyUnlockAuto",
        cost : 50000, //50k
        bought: false,
    }
];
let gameStages = [
    { threshold: 1000, action: unlockStage1 },
    { threshold: 5000, action: unlockStage2 },//5k
    { threshold: 20000, action: unlockNewBttn, vars: {type:"fish", index:2} },//20k
    { threshold: 500000, action: unlockNewBttn, vars: {type:"auto", index:2} },//500k
    { threshold: 2000000, action: unlockNewBttn, vars: {type:"fish", index:3} },//2m
    { threshold: 100000000, action: unlockNewBttn, vars: {type:"fish", index:3} },//100m
    { threshold: 500000000, action: unlockStage3, vars: {type:"feature", index:1} }//500m
];
let upgradesList = [{type:"fish", data:fishUpgrade, class:"upgradeButton"},
                    {type:"auto", data:automationUpgrade, class:"upgradeButton"},
                    {type:"feature", data:shopUpgrades, class:"featureButton"}];

var gameData = {fish, upgradesList, gamestage};

//GAME PROGRESSION Functions
//-------------------------------
//gameStage == 0 in first check
function unlockStage1 (){
     $("#shopBttn").prop("disabled", false);
     $("#shopBttn").css("background-color", "blue");
     addUpgrade(0, "feature", "#shopUpgrades");
     const intervalId = setInterval(autoCollect, 500);
     gameData.gamestage++;
    }
function unlockStage2 (){
    if (gameData.upgradesList[getUpgradeListIndex("feature")].data[0].bought){
        addUpgrade(1,"auto","#autoUpgrades");
        gameData.gamestage++;
    }
    }
function unlockNewBttn (index,type){
    addUpgrade(index,type,`#${type}Upgrades`);
    gameData.gamestage++;
    }    
function unlockStage3 (){
    addUpgrade(1, "feature", "#shopUpgrades");
    gameData.gamestage++;
    } 
function unlockStage5 (){
    addUpgrade(3,"fish","#fishUpgrades");
    gameData.gamestage++;
    } 
function unlockStage6 (){
    addUpgrade(3,"auto","#autoUpgrades");
    gameData.gamestage++;
    } 
//-------------------------------

//Button handling --------------
// Function to collect fish
$("#collectFish").click(function() {
    gameData.fish.count += gameData.fish.value * gameData.fish.multi;
    gameData.fish.lifetime += gameData.fish.value * gameData.fish.multi
    updateDisplay();
});
$("#upgrades").on('click','.upgradeButton',function() {
    upgradeBought(this);
});
$("#automation").on('click','.upgradeButton',function() {
    upgradeBought(this);
});
$("#homeBttn").click(function(){
    switchMenu(".home");
});
$("#ResetBttn").click(function(){
    if (confirm("Warning! You are about to Reset all progress and start from 0.\nAre you sure you wish to continue?")){
        fetch("./initData.json")
        .then(response => response.json())
        .then(json => gameData = json);
        setTimeout(() => updateDisplay(), 500);
        }    
});
const modal = document.getElementById("mainModal");
$("#shopBttn").click(function(){
    //switchMenu("#shopUpgrades");
    $("#shopBttn").css("background-color", "");
    modal.style.display = "block";
});

$("#closeBttn").click(function(){
    //switchMenu("#shopUpgrades");
    modal.style.display = "none";
    $("#shopBttn").css("background-color", "");
});

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

$("#debugBttn").click(function(){
    gameData.fish.value += 1000;
});

//Feature Unlock Buttons ---------------
$("#shopUpgrades").on('click', ".featureButton", function(){
    //Take money away and stuff
    let index = this.getAttribute("index");
    let upgrade = gameData.upgradesList[getUpgradeListIndex(this.getAttribute("type"))].data[index];
    if (gameData.fish.count > upgrade.cost && !upgrade.bought){
        $(this).prop("disabled", true);
        $(this).css("background-color", "#00FF33");
        $(this).css("color", "black");
        gameData.fish.count -= upgrade.cost;
        upgrade.bought = true;
        switch (upgrade.name){
            case "autoFishUnlock":
                addUpgrade(0,"auto","#autoUpgrades");
                break;;
            case "maxBuyUnlockClick":
                addBuyMax(0,"fish");
                break;;
            case "maxBuyUnlockAuto":
                addBuyMax(1,"auto");
                break;;
            default:
                alert("Couldn't find handler");
        }
    }
    updateDisplay();
});

//WORKING ON THESE FUNCTIONS
function addBuyMax(index,type){
    document.querySelectorAll(`#${type}Upgrades`).forEach(function (button){
        let newUpgrade = `<button type="${type}" index="${index}" class="buyMaxBttn">`
        newUpgrade += `</button>`
        button.append(newUpgrade);
    });
}
//Calculate how many upgradescan be bought
function calcBuyMax(upgrade){
    //t = total cost, c = cost, m = Max upgrades
    let [t,m,c] = [0,0,upgrade.cost];
    while (t + c <= gameData.fish.count) {
        t += c;
        c *= upgrade.costMulti;
        m++;
    }
    return (m,t);
}


function addUpgrade(index,type,id){
    let upgrade = gameData.upgradesList[getUpgradeListIndex(type)].data[index];
    let newUpgrade =`<div class="${type}Block">`
    newUpgrade += `${upgrade.desc}`
    newUpgrade += `<button type='${type}' index='${index}' class='${upgradesList[getUpgradeListIndex(type)].class}'>`
    newUpgrade += `Buy`
    if (type == "fish" || type == "auto"){ newUpgrade += `<p>Owned: <span class="owned">0</span></p>`}
    newUpgrade += `<p>Cost: <span class="cost">${formatNumber(upgrade.cost)}</span></p>`
    $(id).append( newUpgrade );
}


function fishUpgradeHandler(upgrade){
    gameData.fish.value += upgrade.countIncrease;
}


// Function to process the purchase of an upgrade
function upgradeBought(data){
    // Get the index and type of the clicked button
    let index = data.getAttribute('index');
    let upgrade = gameData.upgradesList[getUpgradeListIndex(data.getAttribute('type'))].data[index];
    // Check if the player has enough fish to purchase the upgrade
    if (gameData.fish.count >= upgrade.cost) {
        gameData.fish.count -= upgrade.cost;
        upgrade.level += 1;
        // Update the cost of the upgrade and display it in the button
        upgrade.cost *= upgrade.costMulti;
        data.querySelector(".owned").innerHTML = formatNumber(upgrade.level);
        data.querySelector(".cost").innerHTML = formatNumber(upgrade.cost);
        //Handle the function of the button
        switch(data.getAttribute('type')){
            case "fish":
                fishUpgradeHandler(upgrade);
                break;;
            case "auto":
                gameData.fish.perSecond += upgrade.countIncrease;
                break;;
            default:
                console.log("No handler for upgrade type");
        }
    }
    //Update buttons and stats on the page
    updateDisplay();
}

function autoCollect(){
    gameData.fish.count += gameData.fish.perSecond / 2;
    gameData.fish.lifetime += gameData.fish.perSecond / 2;
    updateDisplay();
}

//Function to return the index of the upgrade types
function getUpgradeListIndex(type){
    for (i in gameData.upgradesList){
        if (gameData.upgradesList[i].type == type){
            return (i)
        }
    }
}

//Disable/Enable buttons based on cost
function buttonCheck(button){
    document.querySelectorAll('.upgradeButton').forEach(function (button){
        // Disable the button if the player doesn't have enough fish to buy the upgrade
            let listIndex = getUpgradeListIndex(button.getAttribute("type"));
            let cost = gameData.upgradesList[listIndex].data[button.getAttribute("index")].cost;
                if (gameData.fish.count < cost) {
                    button.disabled = true;
                  } else {
                    button.disabled = false;
                  }
    });
    document.querySelectorAll('.featureButton').forEach(function (button){
       // Disable the button if the player doesn't have enough fish to buy the upgrade
       let listIndex = getUpgradeListIndex(button.getAttribute("type"));
       let cost = gameData.upgradesList[listIndex].data[button.getAttribute("index")].cost;
           if (gameData.fish.count < cost) {
               button.disabled = true;
             } else {
               button.disabled = false;
             }
    });
}

//Format the number as 1k, 1m then 1eX
//ADD A SWITCH 
function formatNumber(number) {
    if (number < 1000) {
        return number.toFixed(2).toString(); // No formatting needed for numbers less than 1000
    } else if (number < 1000000) {
        return (number / 1000).toFixed(2) + 'k'; // Format as 'X.XXk' for thousands
    } else if (number < 1000000000){
        return (number / 1000000).toFixed(2) + 'm'; // Format as 'X.XXm' for millions
    } else if (number < 1000000000000){
        return (number / 1000000000).toFixed(2) + 'b'; // Format as 'X.XXb' for billion
    } else {
        return new Decimal(number).toStringWithDecimalPlaces(2);
    }
}

//Hide all the irrelevant pages
function switchMenu(menu){
    $("#pageDisplay").children().css("display", "none");
    $(menu).css("display", "table");
}

// Function to update the display
function updateDisplay() {
    $("#fishCount").html(formatNumber(gameData.fish.count));
    $("#fishValue").html(formatNumber(gameData.fish.value));
    $("#fishPerSec").html(formatNumber(gameData.fish.perSecond));
    $("#fishlifetime").html(formatNumber(gameData.fish.lifetime));
    checkUnlocks();
    buttonCheck();
}

//Progressive unlocks.
function checkUnlocks(){
        for (let stage of gameStages) { 
            const index = gameStages.findIndex((s) => s === stage);
            if (gameData.fish.lifetime > stage.threshold && gameData.gamestage === index) {
                if (stage.vars){ stage.action(stage.vars.index,stage.vars.type);}
                else { stage.action(); }
            }
        }
    }
function checkSaveFile(){
    if (localStorage.getItem("idleFishingData-IProHarper")){
        let data = JSON.parse(localStorage.getItem("idleFishingData-IProHarper"));
        loadSaveFile(data);
    }
}

function loadSaveFile(data){
    gameData = data;
    gameData.gamestage = 0;
    updateDisplay();
}

var saveGameLoop = window.setInterval(function() {
    localStorage.setItem("idleFishingData-IProHarper", JSON.stringify(gameData))
  }, 15000);


// Function to initialize the game
function initializeGame() {
    checkSaveFile();
    addUpgrade(0,"fish","#fishUpgrades");
    addUpgrade(1,"fish","#fishUpgrades");
    updateDisplay();
    $("#pageDisplay").css("display", "block");
    //var time = Date.now();
}

// Initialize the game
initializeGame();




});



},{"break_infinity.js":2}],2:[function(require,module,exports){
"use strict";var t,n=(t=require("pad-end"))&&"object"==typeof t&&"default"in t?t.default:t,e=9e15,r=function(){for(var t=[],n=-323;n<=308;n++)t.push(Number("1e"+n));return function(n){return t[n+323]}}(),i=function(t){return t instanceof h?t:new h(t)},o=function(t,n){return(new h).fromMantissaExponent(t,n)},u=function(t,n){return(new h).fromMantissaExponent_noNormalize(t,n)};function s(t,n,e,r){var i=n.mul(e.pow(r));return h.floor(t.div(i).mul(e.sub(1)).add(1).log10()/e.log10())}function a(t,n,e,r){return n.mul(e.pow(r)).mul(h.sub(1,e.pow(t))).div(h.sub(1,e))}var h=function(){function t(n){this.mantissa=NaN,this.exponent=NaN,void 0===n?(this.m=0,this.e=0):n instanceof t?this.fromDecimal(n):"number"==typeof n?this.fromNumber(n):this.fromString(n)}return Object.defineProperty(t.prototype,"m",{get:function(){return this.mantissa},set:function(t){this.mantissa=t},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"e",{get:function(){return this.exponent},set:function(t){this.exponent=t},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"s",{get:function(){return this.sign()},set:function(t){if(0===t)return this.e=0,void(this.m=0);this.sgn()!==t&&(this.m=-this.m)},enumerable:!1,configurable:!0}),t.fromMantissaExponent=function(n,e){return(new t).fromMantissaExponent(n,e)},t.fromMantissaExponent_noNormalize=function(n,e){return(new t).fromMantissaExponent_noNormalize(n,e)},t.fromDecimal=function(n){return(new t).fromDecimal(n)},t.fromNumber=function(n){return(new t).fromNumber(n)},t.fromString=function(n){return(new t).fromString(n)},t.fromValue=function(n){return(new t).fromValue(n)},t.fromValue_noAlloc=function(n){return n instanceof t?n:new t(n)},t.abs=function(t){return i(t).abs()},t.neg=function(t){return i(t).neg()},t.negate=function(t){return i(t).neg()},t.negated=function(t){return i(t).neg()},t.sign=function(t){return i(t).sign()},t.sgn=function(t){return i(t).sign()},t.round=function(t){return i(t).round()},t.floor=function(t){return i(t).floor()},t.ceil=function(t){return i(t).ceil()},t.trunc=function(t){return i(t).trunc()},t.add=function(t,n){return i(t).add(n)},t.plus=function(t,n){return i(t).add(n)},t.sub=function(t,n){return i(t).sub(n)},t.subtract=function(t,n){return i(t).sub(n)},t.minus=function(t,n){return i(t).sub(n)},t.mul=function(t,n){return i(t).mul(n)},t.multiply=function(t,n){return i(t).mul(n)},t.times=function(t,n){return i(t).mul(n)},t.div=function(t,n){return i(t).div(n)},t.divide=function(t,n){return i(t).div(n)},t.recip=function(t){return i(t).recip()},t.reciprocal=function(t){return i(t).recip()},t.reciprocate=function(t){return i(t).reciprocate()},t.cmp=function(t,n){return i(t).cmp(n)},t.compare=function(t,n){return i(t).cmp(n)},t.eq=function(t,n){return i(t).eq(n)},t.equals=function(t,n){return i(t).eq(n)},t.neq=function(t,n){return i(t).neq(n)},t.notEquals=function(t,n){return i(t).notEquals(n)},t.lt=function(t,n){return i(t).lt(n)},t.lte=function(t,n){return i(t).lte(n)},t.gt=function(t,n){return i(t).gt(n)},t.gte=function(t,n){return i(t).gte(n)},t.max=function(t,n){return i(t).max(n)},t.min=function(t,n){return i(t).min(n)},t.clamp=function(t,n,e){return i(t).clamp(n,e)},t.clampMin=function(t,n){return i(t).clampMin(n)},t.clampMax=function(t,n){return i(t).clampMax(n)},t.cmp_tolerance=function(t,n,e){return i(t).cmp_tolerance(n,e)},t.compare_tolerance=function(t,n,e){return i(t).cmp_tolerance(n,e)},t.eq_tolerance=function(t,n,e){return i(t).eq_tolerance(n,e)},t.equals_tolerance=function(t,n,e){return i(t).eq_tolerance(n,e)},t.neq_tolerance=function(t,n,e){return i(t).neq_tolerance(n,e)},t.notEquals_tolerance=function(t,n,e){return i(t).notEquals_tolerance(n,e)},t.lt_tolerance=function(t,n,e){return i(t).lt_tolerance(n,e)},t.lte_tolerance=function(t,n,e){return i(t).lte_tolerance(n,e)},t.gt_tolerance=function(t,n,e){return i(t).gt_tolerance(n,e)},t.gte_tolerance=function(t,n,e){return i(t).gte_tolerance(n,e)},t.log10=function(t){return i(t).log10()},t.absLog10=function(t){return i(t).absLog10()},t.pLog10=function(t){return i(t).pLog10()},t.log=function(t,n){return i(t).log(n)},t.log2=function(t){return i(t).log2()},t.ln=function(t){return i(t).ln()},t.logarithm=function(t,n){return i(t).logarithm(n)},t.pow10=function(t){return Number.isInteger(t)?u(1,t):o(Math.pow(10,t%1),Math.trunc(t))},t.pow=function(t,n){return"number"==typeof t&&10===t&&"number"==typeof n&&Number.isInteger(n)?u(1,n):i(t).pow(n)},t.exp=function(t){return i(t).exp()},t.sqr=function(t){return i(t).sqr()},t.sqrt=function(t){return i(t).sqrt()},t.cube=function(t){return i(t).cube()},t.cbrt=function(t){return i(t).cbrt()},t.dp=function(t){return i(t).dp()},t.decimalPlaces=function(t){return i(t).dp()},t.affordGeometricSeries=function(t,n,e,r){return s(i(t),i(n),i(e),r)},t.sumGeometricSeries=function(t,n,e,r){return a(t,i(n),i(e),r)},t.affordArithmeticSeries=function(t,n,e,r){return function(t,n,e,r){var i=n.add(r.mul(e)).sub(e.div(2)),o=i.pow(2);return i.neg().add(o.add(e.mul(t).mul(2)).sqrt()).div(e).floor()}(i(t),i(n),i(e),i(r))},t.sumArithmeticSeries=function(t,n,e,r){return function(t,n,e,r){var i=n.add(r.mul(e));return t.div(2).mul(i.mul(2).plus(t.sub(1).mul(e)))}(i(t),i(n),i(e),i(r))},t.efficiencyOfPurchase=function(t,n,e){return function(t,n,e){return t.div(n).add(t.div(e))}(i(t),i(n),i(e))},t.randomDecimalForTesting=function(t){if(20*Math.random()<1)return u(0,0);var n=10*Math.random();10*Math.random()<1&&(n=Math.round(n)),n*=Math.sign(2*Math.random()-1);var e=Math.floor(Math.random()*t*2)-t;return o(n,e)},t.prototype.normalize=function(){if(this.m>=1&&this.m<10)return this;if(0===this.m)return this.m=0,this.e=0,this;var t=Math.floor(Math.log10(Math.abs(this.m)));return this.m=-324===t?10*this.m/1e-323:this.m/r(t),this.e+=t,this},t.prototype.fromMantissaExponent=function(t,n){return isFinite(t)&&isFinite(n)?(this.m=t,this.e=n,this.normalize(),this):(t=Number.NaN,n=Number.NaN,this)},t.prototype.fromMantissaExponent_noNormalize=function(t,n){return this.m=t,this.e=n,this},t.prototype.fromDecimal=function(t){return this.m=t.m,this.e=t.e,this},t.prototype.fromNumber=function(t){return isNaN(t)?(this.m=Number.NaN,this.e=Number.NaN):t===Number.POSITIVE_INFINITY?(this.m=1,this.e=e):t===Number.NEGATIVE_INFINITY?(this.m=-1,this.e=e):0===t?(this.m=0,this.e=0):(this.e=Math.floor(Math.log10(Math.abs(t))),this.m=-324===this.e?10*t/1e-323:t/r(this.e),this.normalize()),this},t.prototype.fromString=function(t){if(-1!==t.indexOf("e")){var n=t.split("e");this.m=parseFloat(n[0]),this.e=parseFloat(n[1]),this.normalize()}else if("NaN"===t)this.m=Number.NaN,this.e=Number.NaN;else if(this.fromNumber(parseFloat(t)),isNaN(this.m))throw Error("[DecimalError] Invalid argument: "+t);return this},t.prototype.fromValue=function(n){return n instanceof t?this.fromDecimal(n):"number"==typeof n?this.fromNumber(n):"string"==typeof n?this.fromString(n):(this.m=0,this.e=0,this)},t.prototype.toNumber=function(){if(!isFinite(this.e))return Number.NaN;if(this.e>308)return this.m>0?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(this.e<-324)return 0;if(-324===this.e)return this.m>0?5e-324:-5e-324;var t=this.m*r(this.e);if(!isFinite(t)||this.e<0)return t;var n=Math.round(t);return Math.abs(n-t)<1e-10?n:t},t.prototype.mantissaWithDecimalPlaces=function(t){if(isNaN(this.m)||isNaN(this.e))return Number.NaN;if(0===this.m)return 0;var n=t+1,e=Math.ceil(Math.log10(Math.abs(this.m))),r=Math.round(this.m*Math.pow(10,n-e))*Math.pow(10,e-n);return parseFloat(r.toFixed(Math.max(n-e,0)))},t.prototype.toString=function(){return isNaN(this.m)||isNaN(this.e)?"NaN":this.e>=e?this.m>0?"Infinity":"-Infinity":this.e<=-e||0===this.m?"0":this.e<21&&this.e>-7?this.toNumber().toString():this.m+"e"+(this.e>=0?"+":"")+this.e},t.prototype.toExponential=function(t){if(isNaN(this.m)||isNaN(this.e))return"NaN";if(this.e>=e)return this.m>0?"Infinity":"-Infinity";if(this.e<=-e||0===this.m)return"0"+(t>0?n(".",t+1,"0"):"")+"e+0";if(this.e>-324&&this.e<308)return this.toNumber().toExponential(t);isFinite(t)||(t=17);var r=t+1,i=Math.max(1,Math.ceil(Math.log10(Math.abs(this.m))));return(Math.round(this.m*Math.pow(10,r-i))*Math.pow(10,i-r)).toFixed(Math.max(r-i,0))+"e"+(this.e>=0?"+":"")+this.e},t.prototype.toFixed=function(t){return isNaN(this.m)||isNaN(this.e)?"NaN":this.e>=e?this.m>0?"Infinity":"-Infinity":this.e<=-e||0===this.m?"0"+(t>0?n(".",t+1,"0"):""):this.e>=17?this.m.toString().replace(".","").padEnd(this.e+1,"0")+(t>0?n(".",t+1,"0"):""):this.toNumber().toFixed(t)},t.prototype.toPrecision=function(t){return this.e<=-7?this.toExponential(t-1):t>this.e?this.toFixed(t-this.e-1):this.toExponential(t-1)},t.prototype.valueOf=function(){return this.toString()},t.prototype.toJSON=function(){return this.toString()},t.prototype.toStringWithDecimalPlaces=function(t){return this.toExponential(t)},t.prototype.abs=function(){return u(Math.abs(this.m),this.e)},t.prototype.neg=function(){return u(-this.m,this.e)},t.prototype.negate=function(){return this.neg()},t.prototype.negated=function(){return this.neg()},t.prototype.sign=function(){return Math.sign(this.m)},t.prototype.sgn=function(){return this.sign()},t.prototype.round=function(){return this.e<-1?new t(0):this.e<17?new t(Math.round(this.toNumber())):this},t.prototype.floor=function(){return this.e<-1?Math.sign(this.m)>=0?new t(0):new t(-1):this.e<17?new t(Math.floor(this.toNumber())):this},t.prototype.ceil=function(){return this.e<-1?Math.sign(this.m)>0?new t(1):new t(0):this.e<17?new t(Math.ceil(this.toNumber())):this},t.prototype.trunc=function(){return this.e<0?new t(0):this.e<17?new t(Math.trunc(this.toNumber())):this},t.prototype.add=function(t){var n,e,u=i(t);if(0===this.m)return u;if(0===u.m)return this;if(this.e>=u.e?(n=this,e=u):(n=u,e=this),n.e-e.e>17)return n;var s=Math.round(1e14*n.m+1e14*e.m*r(e.e-n.e));return o(s,n.e-14)},t.prototype.plus=function(t){return this.add(t)},t.prototype.sub=function(t){return this.add(i(t).neg())},t.prototype.subtract=function(t){return this.sub(t)},t.prototype.minus=function(t){return this.sub(t)},t.prototype.mul=function(n){if("number"==typeof n)return n<1e307&&n>-1e307?o(this.m*n,this.e):o(1e-307*this.m*n,this.e+307);var e="string"==typeof n?new t(n):n;return o(this.m*e.m,this.e+e.e)},t.prototype.multiply=function(t){return this.mul(t)},t.prototype.times=function(t){return this.mul(t)},t.prototype.div=function(t){return this.mul(i(t).recip())},t.prototype.divide=function(t){return this.div(t)},t.prototype.divideBy=function(t){return this.div(t)},t.prototype.dividedBy=function(t){return this.div(t)},t.prototype.recip=function(){return o(1/this.m,-this.e)},t.prototype.reciprocal=function(){return this.recip()},t.prototype.reciprocate=function(){return this.recip()},t.prototype.cmp=function(t){var n=i(t);if(0===this.m){if(0===n.m)return 0;if(n.m<0)return 1;if(n.m>0)return-1}if(0===n.m){if(this.m<0)return-1;if(this.m>0)return 1}if(this.m>0)return n.m<0||this.e>n.e?1:this.e<n.e?-1:this.m>n.m?1:this.m<n.m?-1:0;if(this.m<0)return n.m>0||this.e>n.e?-1:this.e<n.e||this.m>n.m?1:this.m<n.m?-1:0;throw Error("Unreachable code")},t.prototype.compare=function(t){return this.cmp(t)},t.prototype.eq=function(t){var n=i(t);return this.e===n.e&&this.m===n.m},t.prototype.equals=function(t){return this.eq(t)},t.prototype.neq=function(t){return!this.eq(t)},t.prototype.notEquals=function(t){return this.neq(t)},t.prototype.lt=function(t){var n=i(t);return 0===this.m?n.m>0:0===n.m?this.m<=0:this.e===n.e?this.m<n.m:this.m>0?n.m>0&&this.e<n.e:n.m>0||this.e>n.e},t.prototype.lte=function(t){return!this.gt(t)},t.prototype.gt=function(t){var n=i(t);return 0===this.m?n.m<0:0===n.m?this.m>0:this.e===n.e?this.m>n.m:this.m>0?n.m<0||this.e>n.e:n.m<0&&this.e<n.e},t.prototype.gte=function(t){return!this.lt(t)},t.prototype.max=function(t){var n=i(t);return this.lt(n)?n:this},t.prototype.min=function(t){var n=i(t);return this.gt(n)?n:this},t.prototype.clamp=function(t,n){return this.max(t).min(n)},t.prototype.clampMin=function(t){return this.max(t)},t.prototype.clampMax=function(t){return this.min(t)},t.prototype.cmp_tolerance=function(t,n){var e=i(t);return this.eq_tolerance(e,n)?0:this.cmp(e)},t.prototype.compare_tolerance=function(t,n){return this.cmp_tolerance(t,n)},t.prototype.eq_tolerance=function(n,e){var r=i(n);return t.lte(this.sub(r).abs(),t.max(this.abs(),r.abs()).mul(e))},t.prototype.equals_tolerance=function(t,n){return this.eq_tolerance(t,n)},t.prototype.neq_tolerance=function(t,n){return!this.eq_tolerance(t,n)},t.prototype.notEquals_tolerance=function(t,n){return this.neq_tolerance(t,n)},t.prototype.lt_tolerance=function(t,n){var e=i(t);return!this.eq_tolerance(e,n)&&this.lt(e)},t.prototype.lte_tolerance=function(t,n){var e=i(t);return this.eq_tolerance(e,n)||this.lt(e)},t.prototype.gt_tolerance=function(t,n){var e=i(t);return!this.eq_tolerance(e,n)&&this.gt(e)},t.prototype.gte_tolerance=function(t,n){var e=i(t);return this.eq_tolerance(e,n)||this.gt(e)},t.prototype.log10=function(){return this.e+Math.log10(this.m)},t.prototype.absLog10=function(){return this.e+Math.log10(Math.abs(this.m))},t.prototype.pLog10=function(){return this.m<=0||this.e<0?0:this.log10()},t.prototype.log=function(t){return Math.LN10/Math.log(t)*this.log10()},t.prototype.log2=function(){return 3.321928094887362*this.log10()},t.prototype.ln=function(){return 2.302585092994045*this.log10()},t.prototype.logarithm=function(t){return this.log(t)},t.prototype.pow=function(n){var e,r=n instanceof t?n.toNumber():n,i=this.e*r;if(Number.isSafeInteger(i)&&(e=Math.pow(this.m,r),isFinite(e)&&0!==e))return o(e,i);var u=Math.trunc(i),s=i-u;if(e=Math.pow(10,r*Math.log10(this.m)+s),isFinite(e)&&0!==e)return o(e,u);var a=t.pow10(r*this.absLog10());return-1===this.sign()?1===Math.abs(r%2)?a.neg():0===Math.abs(r%2)?a:new t(Number.NaN):a},t.prototype.pow_base=function(t){return i(t).pow(this)},t.prototype.factorial=function(){var n=this.toNumber()+1;return t.pow(n/Math.E*Math.sqrt(n*Math.sinh(1/n)+1/(810*Math.pow(n,6))),n).mul(Math.sqrt(2*Math.PI/n))},t.prototype.exp=function(){var n=this.toNumber();return-706<n&&n<709?t.fromNumber(Math.exp(n)):t.pow(Math.E,n)},t.prototype.sqr=function(){return o(Math.pow(this.m,2),2*this.e)},t.prototype.sqrt=function(){return this.m<0?new t(Number.NaN):this.e%2!=0?o(3.16227766016838*Math.sqrt(this.m),Math.floor(this.e/2)):o(Math.sqrt(this.m),Math.floor(this.e/2))},t.prototype.cube=function(){return o(Math.pow(this.m,3),3*this.e)},t.prototype.cbrt=function(){var t=1,n=this.m;n<0&&(t=-1,n=-n);var e=t*Math.pow(n,1/3),r=this.e%3;return o(1===r||-1===r?2.154434690031883*e:0!==r?4.641588833612778*e:e,Math.floor(this.e/3))},t.prototype.sinh=function(){return this.exp().sub(this.negate().exp()).div(2)},t.prototype.cosh=function(){return this.exp().add(this.negate().exp()).div(2)},t.prototype.tanh=function(){return this.sinh().div(this.cosh())},t.prototype.asinh=function(){return t.ln(this.add(this.sqr().add(1).sqrt()))},t.prototype.acosh=function(){return t.ln(this.add(this.sqr().sub(1).sqrt()))},t.prototype.atanh=function(){return this.abs().gte(1)?Number.NaN:t.ln(this.add(1).div(new t(1).sub(this)))/2},t.prototype.ascensionPenalty=function(t){return 0===t?this:this.pow(Math.pow(10,-t))},t.prototype.egg=function(){return this.add(9)},t.prototype.lessThanOrEqualTo=function(t){return this.cmp(t)<1},t.prototype.lessThan=function(t){return this.cmp(t)<0},t.prototype.greaterThanOrEqualTo=function(t){return this.cmp(t)>-1},t.prototype.greaterThan=function(t){return this.cmp(t)>0},t.prototype.decimalPlaces=function(){return this.dp()},t.prototype.dp=function(){if(!isFinite(this.mantissa))return NaN;if(this.exponent>=17)return 0;for(var t=this.mantissa,n=-this.exponent,e=1;Math.abs(Math.round(t*e)/e-t)>1e-10;)e*=10,n++;return n>0?n:0},Object.defineProperty(t,"MAX_VALUE",{get:function(){return c},enumerable:!1,configurable:!0}),Object.defineProperty(t,"MIN_VALUE",{get:function(){return p},enumerable:!1,configurable:!0}),Object.defineProperty(t,"NUMBER_MAX_VALUE",{get:function(){return f},enumerable:!1,configurable:!0}),Object.defineProperty(t,"NUMBER_MIN_VALUE",{get:function(){return m},enumerable:!1,configurable:!0}),t}(),c=u(1,e),p=u(1,-e),f=i(Number.MAX_VALUE),m=i(Number.MIN_VALUE);module.exports=h;

},{"pad-end":3}],3:[function(require,module,exports){
'use strict';

module.exports = function (string, maxLength, fillString) {

  if (string == null || maxLength == null) {
    return string;
  }

  var result    = String(string);
  var targetLen = typeof maxLength === 'number'
    ? maxLength
    : parseInt(maxLength, 10);

  if (isNaN(targetLen) || !isFinite(targetLen)) {
    return result;
  }


  var length = result.length;
  if (length >= targetLen) {
    return result;
  }


  var filled = fillString == null ? '' : String(fillString);
  if (filled === '') {
    filled = ' ';
  }


  var fillLen = targetLen - length;

  while (filled.length < fillLen) {
    filled += filled;
  }

  var truncated = filled.length > fillLen ? filled.substr(0, fillLen) : filled;

  return result + truncated;
};

},{}]},{},[1]);

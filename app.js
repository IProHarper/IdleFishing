#!/usr/bin/env node
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
    { threshold: 100000000, action: unlockNewBttn, vars: {type:"fish", index:3} }//100m
];
let upgradesList = [{type:"fish", data:fishUpgrade, class:"upgradeButton"},
                    {type:"auto", data:automationUpgrade, class:"upgradeButton"},
                    {type:"feature", data:shopUpgrades, class:"featureButton"}];

var gameData = [fish, upgradesList, gamestage];

//GAME PROGRESSION Functions
//-------------------------------
//gameStage == 0 in first check
function unlockStage1 (){
     $("#shopBttn").prop("disabled", false);
     $("#shopBttn").css("background-color", "blue");
     addUpgrade(0, "feature", "#shopUpgrades");
     const intervalId = setInterval(autoCollect, 500);
     gamestage++;
    }
function unlockStage2 (){
    if (shopUpgrades[0].bought){
        addUpgrade(1,"auto","#autoUpgrades");
        gamestage++;
    }
    }
function unlockNewBttn (index,type){
    addUpgrade(index,type,`#${type}Upgrades`);
    gamestage++;
    }    
function unlockStage4 (){
    addUpgrade(2,"auto","#autoUpgrades");
    gamestage++;
    } 
function unlockStage5 (){
    addUpgrade(3,"fish","#fishUpgrades");
    gamestage++;
    } 
function unlockStage6 (){
    addUpgrade(3,"auto","#autoUpgrades");
    gamestage++;
    } 
//-------------------------------

//Button handling --------------
// Function to collect fish
$("#collectFish").click(function() {
    fish.count += fish.value * fish.multi;
    fish.lifetime += fish.value * fish.multi
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
     fish.value += 1000;
});

//Feature Unlock Buttons ---------------
$("#shopUpgrades").on('click', ".featureButton", function(){
    //Take money away and stuff
    let index = this.getAttribute("index");
    let upgrade = upgradesList[getUpgradeListIndex(this.getAttribute("type"))].data[index];
    if (fish.count > upgrade.cost && !upgrade.bought){
        $(this).prop("disabled", true);
        $(this).css("background-color", "#00FF33");
        $(this).css("color", "black");
        fish.count -= upgrade.cost;
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
    while (t + c <= fish.count) {
        t += c;
        c *= upgrade.costMulti;
        m++;
    }
    return (m,t);
}


//Add Upgrade buttons for automation use
// function addUpgrade(index,type,id){
//     upgrade = upgradesList[getUpgradeListIndex(type)].data[index];
//     newUpgrade = `<button type='${type}' index='${index}' class='${upgradesList[getUpgradeListIndex(type)].class}'>`
//     newUpgrade += `${upgrade.desc}`
//     if (type == "fish" || type == "auto"){ newUpgrade += ` (<span class="owned">0</span>)`}
//     newUpgrade += `<p>Cost: <span class="cost">${formatNumber(upgrade.cost)}</span></p>`
//     $(id).append( newUpgrade );
// }
function addUpgrade(index,type,id){
    let upgrade = upgradesList[getUpgradeListIndex(type)].data[index];
    let newUpgrade =`<div class="${type}Block">`
    newUpgrade += `${upgrade.desc}`
    newUpgrade += `<button type='${type}' index='${index}' class='${upgradesList[getUpgradeListIndex(type)].class}'>`
    newUpgrade += `Buy`
    if (type == "fish" || type == "auto"){ newUpgrade += `<p>Owned: <span class="owned">0</span></p>`}
    newUpgrade += `<p>Cost: <span class="cost">${formatNumber(upgrade.cost)}</span></p>`
    $(id).append( newUpgrade );
}


function fishUpgradeHandler(upgrade){
    fish.value += upgrade.countIncrease;
}


// Function to process the purchase of an upgrade
function upgradeBought(data){
    // Get the index and type of the clicked button
    let index = data.getAttribute('index');
    let upgrade = upgradesList[getUpgradeListIndex(data.getAttribute('type'))].data[index];
    // Check if the player has enough fish to purchase the upgrade
    if (fish.count >= upgrade.cost) {
        fish.count -= upgrade.cost;
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
                fish.perSecond += upgrade.countIncrease;
                break;;
            default:
                console.log("No handler for upgrade type");
        }
    }
    //Update buttons and stats on the page
    updateDisplay();
}

function autoCollect(){
    fish.count += fish.perSecond / 2;
    fish.lifetime += fish.perSecond / 2;
    updateDisplay();
}

//Function to return the index of the upgrade types
function getUpgradeListIndex(type){
    for (let i = 0; i < upgradesList.length; i++){
        if (upgradesList[i].type == type){
            return (i)
        }
    }
}

//Disable/Enable buttons based on cost
function buttonCheck(button){
    document.querySelectorAll('.upgradeButton').forEach(function (button){
        // Disable the button if the player doesn't have enough fish to buy the upgrade
            let listIndex = getUpgradeListIndex(button.getAttribute("type"));
            let cost = upgradesList[listIndex].data[button.getAttribute("index")].cost;
                if (fish.count < cost) {
                    button.disabled = true;
                  } else {
                    button.disabled = false;
                  }
    });
    document.querySelectorAll('.featureButton').forEach(function (button){
       // Disable the button if the player doesn't have enough fish to buy the upgrade
       let listIndex = getUpgradeListIndex(button.getAttribute("type"));
       let cost = upgradesList[listIndex].data[button.getAttribute("index")].cost;
           if (fish.count < cost) {
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
    $("#fishCount").html(formatNumber(fish.count));
    $("#fishValue").html(formatNumber(fish.value));
    $("#fishPerSec").html(formatNumber(fish.perSecond));
    $("#fishlifetime").html(formatNumber(fish.lifetime));
    checkUnlocks();
    buttonCheck();
}

//Progressive unlocks.
function checkUnlocks(){
        for (let stage of gameStages) { 
            const index = gameStages.findIndex((s) => s === stage);
            if (fish.lifetime > stage.threshold && gamestage === index) {
                if (stage.vars){ stage.action(stage.vars.index,stage.vars.type);}
                else { stage.action(); }
            }
        }
    }


var saveGameLoop = window.setInterval(function() {
    localStorage.setItem("idleFishingData-IProHarper", JSON.stringify(gameData))
  }, 15000);


// var savegame = JSON.parse(localStorage.getItem("goldMinerSave"))
// if (savegame !== null) {
//   gameData = savegame
// }

// Function to initialize the game
function initializeGame() {
    //addUpgrade(0,"auto","#autoUpgrades");
    addUpgrade(0,"fish","#fishUpgrades");
    addUpgrade(1,"fish","#fishUpgrades");
    updateDisplay();
    $("#pageDisplay").css("display", "block");
    //var time = Date.now();
}

// Initialize the game
initializeGame();




});



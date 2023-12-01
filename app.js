#!/usr/bin/env node
var Decimal = require("break_infinity.js");
var gameData;

$(document).ready(function(){

    
//Variables
//Main currency
// let fish = {
//     count : 1,
//     value : 1,
//     multi : 1,
//     perSecond: 0,
//     lifetime: 0
// };
// let gamestage = 0;
// let fishUpgrade = [
//     {
//         desc: "Fish Collection +1",
//         cost : 10,
//         costMulti : 1.2,
//         countIncrease : 1,
//         level : 0,
//         displaying: true
//     },
//     {
//         desc: "Fish Collection +10",
//         cost : 100,
//         costMulti : 1.25,
//         countIncrease : 10,
//         level : 0,
//         displaying: true
//     },
//     {
//         desc: "Fish Collection +1k",
//         cost : 5000,
//         costMulti : 1.25,
//         countIncrease : 1000,
//         level : 0,
//         displaying: false
//     },
//     {
//         desc: "Fish Collection +50k",
//         cost : 100000,
//         costMulti : 1.25,
//         countIncrease : 50000,
//         level : 0,
//         displaying: false
//     }
// ];
// let automationUpgrade = [
//     {
//         desc: "Auto Fishing + 10/s",
//         cost : 100,
//         costMulti : 1.25,
//         countIncrease : 10,
//         level : 0,
//         displaying: false
//     },
//     {
//         desc: "Auto Fishing + 1k/s",
//         cost : 10000,
//         costMulti : 1.15,
//         countIncrease : 1000,
//         level : 0,
//         displaying: false
//     },
//     {
//         desc: "Auto Fishing + 10k/s",
//         cost : 100000,
//         costMulti : 1.15,
//         countIncrease : 10000,
//         level : 0,
//         displaying: false
//     },
//     {
//         desc: "Auto Fishing + 1m/s",
//         cost : 900000,
//         costMulti : 1.15,
//         countIncrease : 1000000,
//         level : 0,
//         displaying: false
//     }
// ];
// let shopUpgrades = [
//     {
//         desc : "Unlock Auto Fishing",
//         name : "autoFishUnlock",
//         cost : 2500, //2.5k
//         bought: false,
//     },
//     {
//         desc : "Unlock Fish Multi",
//         name : "multiUnlock",
//         cost : 1000000000, //1b
//         bought: false,
//     },
//     {
//         desc : "Unlock Buy Max for Fish/Click",
//         name : "maxBuyUnlockClick",
//         cost : 10000, //10k
//         bought: false,
//     },
//     {
//         desc : "Unlock Buy Max for Auto Fish",
//         name : "maxBuyUnlockAuto",
//         cost : 50000, //50k
//         bought: false,
//     }
// ];
let gameStages = [
    { threshold: 1000, action: unlockStage1 },
    { threshold: 5000, action: unlockStage2 },//5k
    { threshold: 20000, action: unlockNewBttn, vars: {type:"fish", index:2} },//20k
    { threshold: 500000, action: unlockNewBttn, vars: {type:"auto", index:2} },//500k
    { threshold: 2000000, action: unlockNewBttn, vars: {type:"fish", index:3} },//2m
    { threshold: 100000000, action: unlockNewBttn, vars: {type:"auto", index:3} },//100m
    { threshold: 500000000, action: unlockStage3, vars: {type:"feature", index:1} }//500m
];

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
    upgradeBought(this.closest('div'));
});
$("#automation").on('click','.upgradeButton',function() {
    upgradeBought(this.closest('div'));
});
$("#homeBttn").click(function(){
    switchMenu(".home");
});
$("#ResetBttn").click(function(){
    if (confirm("Warning! You are about to Reset all progress and start from 0.\nAre you sure you wish to continue?")){
        fetch("./initData.json")
        .then(response => response.json())
        .then(json => gameData = json);
        setTimeout(() => updateDisplay(), 250);
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
    //Handle load file
    if (gameData.fish.count > upgrade.cost){
        $(this).prop("disabled", true);
        $(this).css("background-color", "#00FF33");
        $(this).css("color", "black");
        gameData.fish.count -= upgrade.cost;
        upgrade.bought = true;
        shopBttnHandling(upgrade.name);
    }
    updateDisplay();
});

function shopBttnHandling(name){
    switch (name){
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

//Add upgrade buttons from the upgradesList
function addUpgrade(index,type,id){
    let upgrade = gameData.upgradesList[getUpgradeListIndex(type)].data[index];
    let newUpgrade =`<div class="${type}Block">`;
    newUpgrade += `${upgrade.desc}`;
    if (upgrade.countIncrease) { newUpgrade += `${formatNumber(upgrade.countIncrease)}` };
    if (type == "fish" || type == "auto"){ newUpgrade += `: [<span class="owned">0</span>]`}
    newUpgrade += `<button type='${type}' index='${index}' class='${gameData.upgradesList[getUpgradeListIndex(type)].class}'>`
    newUpgrade += `<p>Cost: <span class="cost">${formatNumber(upgrade.cost)}</span></p>`
    $(id).append( newUpgrade );
}

//For Fish upgrades simply increase click value
function fishUpgradeHandler(upgrade){
    gameData.fish.value += upgrade.countIncrease;
}
//For Fish upgrades simply increase click value
function autoUpgradeHandler(upgrade){
    gameData.fish.perSecond += upgrade.countIncrease;
}

// Function to process the purchase of an upgrade
function upgradeBought(element){
    const button = element.querySelector('button');
    // Get the index and type of the clicked button
    const index = button.getAttribute('index');
    const type = button.getAttribute('type');

    let upgrade = gameData.upgradesList[getUpgradeListIndex(type)].data[index];
    // Check if the player has enough fish to purchase the upgrade
    if (gameData.fish.count >= upgrade.cost) {
        gameData.fish.count -= upgrade.cost;
        upgrade.level += 1;
        // Update the cost of the upgrade and display it in the button
        upgrade.cost *= upgrade.costMulti;
        element.querySelector(".owned").innerHTML = formatNumber(upgrade.level);
        button.querySelector(".cost").innerHTML = formatNumber(upgrade.cost);
        //Handle the function of the button
        switch(type){
            case "fish":
                fishUpgradeHandler(upgrade);
                break;;
            case "auto":
                autoUpgradeHandler(upgrade);
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
        return new Decimal(number).toStringWithDecimalPlaces(2); // Format as X.eX for exponential.
    }
}

//Hide all the irrelevant pages
function switchMenu(menu){
    $("#pageDisplay").children().css("display", "none");
    $(menu).css("display", "table");
}

//Check all game buttons and update their status
function buttonCheck(button){
    document.querySelectorAll('.upgradeButton').forEach(function (button){
        // Disable the button if the player doesn't have enough fish to buy the upgrade
        const listIndex = getUpgradeListIndex(button.getAttribute("type"));
        const upgrade = gameData.upgradesList[listIndex].data[button.getAttribute("index")]
        button.closest('div').querySelector(".owned").innerHTML = formatNumber(upgrade.level);
            if (gameData.fish.count < upgrade.cost) {
                button.disabled = true;
                } else {
                button.disabled = false;
                }
    });
    document.querySelectorAll('.featureButton').forEach(function (button){
       // Disable the button if the player doesn't have enough fish to buy the upgrade
       //Handle bought buttons
       const index = button.getAttribute("index");
       const upgrade = gameData.upgradesList[getUpgradeListIndex(button.getAttribute("type"))].data[index];
       const cost = upgrade.cost;
        if (gameData.fish.count < cost && !upgrade.disabled) {
               button.disabled = true;
             } else {
               button.disabled = false;
             }
    });
}

//LOGIC IS SLIGHTLY WRONG. BUTTONS ALL UNLOCK THEN THE SHOP IS CHECKED
function initializeButtons(){
    checkUnlocks();
    document.querySelectorAll('.featureButton').forEach(function (button){
        // Disable the button if the player doesn't have enough fish to buy the upgrade
        //Handle bought buttons
        const index = button.getAttribute("index");
        let upgrade = gameData.upgradesList[getUpgradeListIndex(button.getAttribute("type"))].data[index];
        if (upgrade.bought && !button.disabled) {
            button.disabled = true;
            shopBttnHandling(upgrade.name);
        }
     });
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

// Function to update the display
function updateDisplay() {
    $("#fishCount").html(formatNumber(gameData.fish.count));
    $("#fishValue").html(formatNumber(gameData.fish.value));
    $("#fishPerSec").html(formatNumber(gameData.fish.perSecond));
    $("#fishlifetime").html(formatNumber(gameData.fish.lifetime));
    checkUnlocks();
    buttonCheck();
}

// Function to initialize the game
function initializeGame() {
    fetch("./initData.json")
    .then(response => response.json())
    .then(data => {
      gameData = data;
      checkSaveFile();
      addUpgrade(0,"fish","#fishUpgrades");
      addUpgrade(1,"fish","#fishUpgrades");
      initializeButtons();
      updateDisplay();
    })
    .catch(error => {
      console.error('Error loading game data: ' + error);
    });
    //var time = Date.now();
}

//MAIN CODE LOOP
// Initialize the game
initializeGame();

var saveGameLoop = window.setInterval(function() {
    saveGame();
  }, 15000);


//Save file stufff
function checkSaveFile(){
    if (localStorage.getItem("idleFishingData-IProHarper")){
        let data = JSON.parse(localStorage.getItem("idleFishingData-IProHarper"));
        loadSaveFile(data);
    }
}

function loadSaveFile(data){
    gameData = data;
    gameData.gamestage = 0;
    //updateDisplay();
}

function saveGame(){
    localStorage.setItem("idleFishingData-IProHarper", JSON.stringify(gameData));
    const savePopup = document.getElementById('savePopup');
            savePopup.classList.add('show');
            // Auto disappear after 1 second
            setTimeout(() => {
                savePopup.classList.remove('show');
            }, 2000);
}


});



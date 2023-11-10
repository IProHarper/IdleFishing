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
fishUpgrade = [
    {
        stageReq: 0,
        cost : 10,
        costMulti : 1.2,
        countIncrease : 1,
        level : 0
    },
    {
        stageReq: 1,
        cost : 100,
        costMulti : 1.3,
        countIncrease : 10,
        level : 0
    },
    {
        stageReq: 2,
        cost : 100,
        costMulti : 1.4,
        countIncrease : 10000,
        level : 0
    }
];
automationUpgrade = [
    {
        desc: "Auto Fishing + 10/s",
        index: 0,
        cost : 100,
        costMulti : 1.35,
        countIncrease : 10,
        level : 0
    }
];
let shopUpgrades = [
    {
        desc : "Unlock Auto Fishing",
        name : "autoFishUnlock",
        cost : 5000, //5k
        bought: false,
    },
    {
        desc : "Unlock the Buy Max for Fish Collect",
        name : "maxBuyUnlockClick",
        cost : 10000, //10k
        bought: false,
    },
    {
        desc : "Unlock the Buy Max for Auto Fish",
        name : "maxBuyUnlockAuto",
        cost : 50000, //50k
        bought: false,
    }
];

let upgradesList = [{type:"fish", data:fishUpgrade, class:"upgradeButton"},
                    {type:"auto", data:automationUpgrade, class:"upgradeButton"},
                    {type:"feature",data:shopUpgrades, class:"featureButton"}]



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
$("#shopBttn").click(function(){
    switchMenu("#shopUpgrades");
    $("#shopBttn").innerHTML = `<span class="badge"></span>`;
});
$("#debugBttn").click(function(){
     fish.value += 4000;
     calcBuyMax(fishUpgrade[0]);
    //$("#shopBttn").prop("disabled", false);
});

//Feature Unlock Buttons ---------------
$("#shopUpgrades").on('click', ".featureButton", function(){
    //Take money away and stuff
    let index = this.getAttribute("index");
    upgrade = upgradesList[getUpgradeListIndex(this.getAttribute("type"))].data[index];
    if (fish.count > upgrade.cost && !upgrade.bought){
        $(this).prop("disabled", true);
        $(this).css("background-color", "#ffea00");
        $(this).css("color", "black");
        fish.count -= upgrade.cost;
        upgrade.bought = true;
        switch (upgrade.name){
            case "autoFishUnlock":
                addUpgrade(0,"auto","#autoUpgrades");
                break;;
            case "maxBuyUnlockClick":
                addBuyMax(1);
                break;;
            case "maxBuyUnlockAuto":
                addBuyMax(2);
                break;;
            default:
                console.log("Couldn't find handler");
        }
    }
    updateDisplay();
});

//WORKING ON THESE FUNCTIONS
function addBuyMax(upgrade){
    console.log("Buy max for upgrade ", upgrade);
}
//Calculate how many I can buy of the passed upgrade
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
function addUpgrade(index,type,id){
    upgrade = upgradesList[getUpgradeListIndex(type)].data[index];
    newUpgrade = `<button type='${type}' index='${index}' class='${upgradesList[getUpgradeListIndex(type)].class}'>`
    newUpgrade += `${upgrade.desc}`
    if (type == "fish" || type == "auto"){ newUpgrade += ` (<span class="owned">0</span>)`}
    newUpgrade += `<p>Cost: <span class="cost">${formatNumber(upgrade.cost)}</span></p>`
    $(id).append( newUpgrade );
}



// Function to process the purchase of an upgrade
function upgradeBought(data){
    // Get the index and type of the clicked button
    let index = data.getAttribute('index');
    upgrade = upgradesList[getUpgradeListIndex(data.getAttribute('type'))].data[index];
    // Iterate through the upgradesList to find the matching upgrade
    // Check if the type of the clicked button matches the current upgrade type
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
                fish.value += upgrade.countIncrease;
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
    updateDisplay();
    console.log("Done");
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
function formatNumber(number) {
    if (number < 1000) {
        return number.toFixed(2).toString(); // No formatting needed for numbers less than 1000
    } else if (number < 1000000) {
        return (number / 1000).toFixed(2) + 'k'; // Format as 'X.XXk' for thousands
    } else if (number < 1000000000){
        return (number / 1000000).toFixed(2) + 'm'; // Format as 'X.XXm' for millions
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
    checkUnlocks();
    buttonCheck();
}

function checkUnlocks(){
    if (fish.lifetime > 5000 && gamestage == 0){
        gamestage++;
        $("#shopBttn").prop("disabled", false);
        addUpgrade(gamestage-1,"feature","#shopUpgrades");
        const intervalId = setInterval(autoCollect, 500);
    }
    if (fish.lifetime > 15000 && gamestage == 1){
        gamestage++;
        addUpgrade(gamestage-1,"feature","#shopUpgrades");
    }
    if (fish.lifetime > 50000 && gamestage == 2){
        gamestage++;
        addUpgrade(gamestage-1,"feature","#shopUpgrades");
    }
}

// Function to initialize the game
function initializeGame() {
    updateDisplay();
    $("#pageDisplay").css("display", "block");
    //var time = Date.now();
}

// Initialize the game
initializeGame();




});



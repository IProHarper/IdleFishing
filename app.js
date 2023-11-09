 $(document).ready(function(){

//Variables
//Main currency
let fish = {
    count : 1,
    value : 1,
    multi : 1,
    lifetime: 0
};
let gamestage = 0;
fishUpgrade = [
    {
        stageReq: 0,
        cost : 10,
        costMulti : 2,
        countIncrease : 1,
        level : 0
    },
    {
        stageReq: 1,
        cost : 100,
        costMulti : 2,
        countIncrease : 10,
        level : 0
    },
    {
        stageReq: 2,
        cost : 100,
        costMulti : 20,
        countIncrease : 10000,
        level : 0
    }
];
automationUpgrade = [
    {
        desc: "Auto Fishing + 1/s",
        index: 0,
        cost : 100,
        costMulti : 3,
        countIncrease : 1,
        level : 0
    }
];

let upgradesList = [{type:"fish", data:fishUpgrade},{type:"auto", data:automationUpgrade}]

let shopButtons = [
    {
        desc : "Unlock Auto Fishing",
        name : "autoFishUnlock",
        cost : 5000, //5k
        bought: false
    },
    {
        desc : "Unlock the buy Max button",
        name : "maxBuyUnlock",
        cost : 10000, //10k
        bought: false
    }
]

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
});
$("#debugBttn").click(function(){
     fish.value += 4000;
     calcBuyMax(fishUpgrade[0]);
    //$("#shopBttn").prop("disabled", false);
});

//Feature Unlock Buttons ---------------
$("#shopUpgrades").on('click', "#autoFishUnlock", function(){
    //Take money away and stuff
    let index = this.getAttribute("index");
    if (shopButtons[index].name == 'autoFishUnlock'){
        if (fish.count > shopButtons[index].cost){
            $("#autoFishUnlock").prop("disabled", true);
            $("#autoFishUnlock").css("background-color", "#ffea00");
            $("#autoFishUnlock").css("color", "black");
            fish.count -= shopButtons[index].cost;
            shopButtons[index].bought = true;
        }
    }
    addAutoUpgrade(index,"auto");
    updateDisplay();
});

$("#shopUpgrades").on('click', "#maxBuy", function(){
    //Take money away and stuff
    let index = this.getAttribute("index");
    if (shopButtons[index].name == 'maxBuyUnlock'){
        if (fish.count > shopButtons[index].cost){
            $("#maxBuy").prop("disabled", true);
            $("#maxBuy").css("background-color", "#ffea00");
            $("#maxBuy").css("color", "black");
            fish.count -= shopButtons[index].cost;
            shopButtons[index].bought = true;
        }
    }
    addBuyMax();
    updateDisplay();
});

//WORKING ON THESE FUNCTIONS
function addBuyMax(upgrade){
}
//WORKING ON THESE FUNCTIONS
function calcBuyMax(upgrade){
    let totalCost = 0;
    let maxUpgrades = 0;
    let cost = upgrade.cost
    // Keep buying upgrades until the total cost exceeds the available money
    while (totalCost + cost <= fish.count) {
        totalCost += cost;
        cost *= upgrade.costMulti;
        maxUpgrades++;
    }
    return (maxUpgrades);
}

//End Button handling ----------------------
//Add a new unlockable upgrade in the shop
function addShopUpgrade(index){
    newUpgrade = `<button id="${shopButtons[index].name}"type='shopUpgrade' index='${index}' class='featureButton'>`
    newUpgrade += `${shopButtons[index].desc}`
    newUpgrade += `<p>Cost: <span class="cost">${formatNumber(shopButtons[index].cost)}</span></p>`
    $("#shopUpgrades").append( newUpgrade );
}

//Add Upgrade buttons for automation use
function addAutoUpgrade(index,type){
    upgrade = upgradesList[returnUpgradeListIndex(type)].data[index]
    newUpgrade = `<button type='${type}' index='${index}' class='upgradeButton'>`
    newUpgrade += `${upgrade.desc} (<span class="owned">0</span>)`
    newUpgrade += `<p>Cost: <span class="cost">${formatNumber(upgrade.cost)}</span></p>`
    $("#autoUpgrades").append( newUpgrade );
}



// Function to process the purchase of an upgrade
function upgradeBought(data){
    // Get the index and type of the clicked button
    let index = data.getAttribute('index');
    // Iterate through the upgradesList to find the matching upgrade
        // Check if the type of the clicked button matches the current upgrade type
        if (data.getAttribute('type') == "fish"){
            let fishupgradeBttn = upgradesList[0].data[index];
            // Check if the player has enough fish to purchase the upgrade
            if (fish.count >= fishupgradeBttn.cost) {
                fish.count -= fishupgradeBttn.cost;
                fish.value += fishupgradeBttn.countIncrease;
                fishupgradeBttn.level += 1;
                // Update the cost of the upgrade and display it in the button
                fishupgradeBttn.cost *= fishupgradeBttn.costMulti;
                data.querySelector(".cost").innerHTML = formatNumber(fishupgradeBttn.cost);
                data.querySelector(".owned").innerHTML = formatNumber(fishupgradeBttn.level);
            }
        }
        if (data.getAttribute('type') == "auto"){
            console.log("+1 per second");
            let fishupgradeBttn = upgradesList[1].data[index];
            // Check if the player has enough fish to purchase the upgrade
            if (fish.count >= fishupgradeBttn.cost) {
                fish.count -= fishupgradeBttn.cost;
                //HANDLE THE FISH PER SECOND!
                fish.value += fishupgradeBttn.countIncrease;
                fishupgradeBttn.level += 1;
                // Update the cost of the upgrade and display it in the button
                fishupgradeBttn.cost *= fishupgradeBttn.costMulti;
                data.querySelector(".cost").innerHTML = formatNumber(fishupgradeBttn.cost);
                data.querySelector(".owned").innerHTML = formatNumber(fishupgradeBttn.level);
            }
        }
    //Update buttons and stats on the page
    updateDisplay();
}

//Function to return the index of the upgrade types
function returnUpgradeListIndex(type){
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
            let listIndex = returnUpgradeListIndex(button.getAttribute("type"));
            let cost = upgradesList[listIndex].data[button.getAttribute("index")].cost;
                if (fish.count < cost) {
                    button.disabled = true;
                  } else {
                    button.disabled = false;
                  }
    });
    document.querySelectorAll('.featureButton').forEach(function (button){
        if (button.getAttribute("type") == "shopUpgrade"){
            var i = 0, len = shopButtons.length;
            while (i < len){
                if (button.id == shopButtons[i].name){
                    if (!shopButtons[i].bought){
                        let cost = shopButtons[i].cost;
                        if (fish.count < cost) {
                            button.disabled = true;
                        } else {
                         button.disabled = false;
                        }
                    }
                }
                i++;
            }
        }
    });
}

//Format the number as 1k, 1m then 1eX
function formatNumber(number) {
    if (number < 1000) {
        return number.toString(); // No formatting needed for numbers less than 1000
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
    buttonCheck();
    checkUnlocks();
}

function checkUnlocks(){
    if (fish.lifetime > 5000){
        if (gamestage == 0){
            gamestage += 1;
            $("#shopBttn").prop("disabled", false);
            addShopUpgrade(0);
        }
    }
}

// Function to initialize the game
function initializeGame() {
    updateDisplay();
    $("#pageDisplay").css("display", "block");
}

// Initialize the game
initializeGame();




});



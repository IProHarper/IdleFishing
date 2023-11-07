$(document).ready(function(){
//Variables
let fish = {
    count : 0,
    value : 1,
    multi : 1,
    lifetime: 0
};
let gameStage = 0;
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
        countIncrease : 100,
        level : 0
    },
    {
        stageReq: 2,
        cost : 10000,
        costMulti : 20,
        countIncrease : 10000,
        level : 0
    }
]

let upgradesList = [{type:"fish", data:fishUpgrade}]

// Function to collect fish
$("#collectFish").click(function() {
    fish.count += fish.value * fish.multi;
    fish.lifetime += fish.value * fish.multi
    updateDisplay();
});

$(".upgradeButton").click(function() {
    upgradeBought(this);
});

$("#homeBttn").click(function(){
    switchMenu("#upgrades");
});
$("#shopBttn").click(function(){
    switchMenu("#automation");
});

// Function to handle upgrade button clicks
$(".upgradeButton").click(function() {
    upgradeBought(this);
});

function addFishUpgradeButton(index,upgrade){
    // Select the parent element where you want to add the new button
    const parentElement = document.getElementById("fishUpgrades");

    // Create a new button element
    const newButton = document.createElement("button");

    // Set attributes and content for the button
    newButton.type = "fish";
    newButton.setAttribute("index", index);
    newButton.className = "upgradeButton";
    newButton.textContent = "Increase Fish Collection (",upgrade.countIncrease,")";

    // Create a paragraph element for the cost information
    const costParagraph = document.createElement("p");
    costParagraph.textContent = "Cost: ";

    // Create a span element for the cost value
    const costSpan = document.createElement("span");
    costSpan.className = "cost";
    costSpan.textContent = upgrade.cost;

    // Append the span element to the paragraph element
    costParagraph.appendChild(costSpan);

    // Append the paragraph element to the button element
    newButton.appendChild(costParagraph);

    // Append the new button to the parent element
    parentElement.appendChild(newButton);
}

function gameStageCheck(){

}

// Function to process the purchase of an upgrade
function upgradeBought(data){
    // Get the index and type of the clicked button
    let index = data.getAttribute('index');

    // Iterate through the upgradesList to find the matching upgrade
    for (let i=0; i < upgradesList.length; i++){
        // Check if the type of the clicked button matches the current upgrade type
        if (data.getAttribute('type') == upgradesList[i].type){
            // Check if the player has enough fish to purchase the upgrade
            if (fish.count >= upgradesList[i].data[index].cost) {
                fish.count -= upgradesList[i].data[index].cost;
                fish.value += upgradesList[i].data[index].countIncrease;
                upgradesList[i].data[index].level += 1;
                // Update the cost of the upgrade and display it in the button
                upgradesList[i].data[index].cost *= upgradesList[i].data[index].costMulti;
                data.querySelector(".cost").innerHTML = formatNumber(upgradesList[i].data[index].cost);
            }
        }
    }
    //Update buttons and stats on the page
    updateDisplay();
}

//Disable/Enable cost buttons
function buttonCheck(button){
    document.querySelectorAll('.upgradeButton').forEach(function (button){
        // Disable the button if the player doesn't have enough fish to buy the upgrade
            if (fish.count < button.querySelector(".cost").innerHTML) {
                button.disabled = true;
              } else {
                button.disabled = false;
              }
    });
}

//Hide all the irrelevant pages
function switchMenu(menu){
    $("#menus").children().css("display", "none");
    $(menu).css("display", "inline");
}

// Function to update the display
function updateDisplay() {
    $("#fishCount").html(formatNumber(fish.count));
    $("#fishValue").html(formatNumber(fish.value));
    buttonCheck();
    gameStageCheck();
}

// Function to initialize the game
function initializeGame() {
    updateDisplay();
    $("#upgrades").css("display", "block");
}

// Initialize the game
initializeGame();




function formatNumber(number) {
    if (number < 1000) {
        return number.toString(); // No formatting needed for numbers less than 1000
    } else if (number < 1000000) {
        return (number / 1000).toFixed(2) + 'k'; // Format as 'X.XXk' for thousands
    } else {
        return (number / 1000000).toFixed(2) + 'm'; // Format as 'X.XXm' for millions
    }
}

});



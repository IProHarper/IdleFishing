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
        countIncrease : 100,
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
featureUpgrade = [
    {
        desc: 0,
        cost : 10,
        costMulti : 2,
        countIncrease : 1,
        level : 0
    }
];

let upgradesList = [{type:"fish", data:fishUpgrade},{type:"feature", data:featureUpgrade}]

let shopButtons = [
    {
        desc : "Unlock the buy Max button",
        name : "maxBuy",
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
$("#homeBttn").click(function(){
    switchMenu("#upgrades");
});
$("#shopBttn").click(function(){
    switchMenu("#shopUpgrades");
});
$("#debugBttn").click(function(){
    $("#shopBttn").prop("disabled", false);
});

//Feature Unlock Buttons ---------------
$("#shopUpgrades").on('click', "#maxBuy", function(){
    //Take money away and stuff
    for (let i=0; i < shopButtons.length; i++){
        if (shopButtons[i].name == 'maxBuy'){
            if (fish.count > shopButtons[i].cost){
                $("#maxBuy").prop("disabled", true);
                console.log(fish.count, shopButtons[i].cost);
                fish.count -= shopButtons[i].cost;
            }
        }
    }

    updateDisplay();
});


//End Button handling ----------------------
function addShopUpgrade(index){
    newUpgrade = `<button id="${shopButtons[index].name}"type='shopUpgrade' index='${index}' class='featureButton'>`
    newUpgrade += `${shopButtons[index].desc}`
    newUpgrade += `<p>Cost: <span class="cost">${formatNumber(shopButtons[index].cost)}</span></p>`
    $("#shopUpgrades").append( newUpgrade );
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
    //Update buttons and stats on the page
    updateDisplay();
}


//Disable/Enable cost buttons
function buttonCheck(button){
    document.querySelectorAll('.upgradeButton').forEach(function (button){
        // Disable the button if the player doesn't have enough fish to buy the upgrade
            if (button.getAttribute("type") == "fish"){
                let cost = upgradesList[0].data[button.getAttribute("index")].cost;
                if (fish.count < cost) {
                    button.disabled = true;
                  } else {
                    button.disabled = false;
                  }
            }
            
    });
}

//Hide all the irrelevant pages
function switchMenu(menu){
    $("#pageDisplay").children().css("display", "none");
    $(menu).css("display", "inline");
}

// Function to update the display
function updateDisplay() {
    $("#fishCount").html(formatNumber(fish.count));
    $("#fishValue").html(formatNumber(fish.value));
    buttonCheck();
    checkUnlocks();
}

function checkUnlocks(){
    if (fish.lifetime > 10000){
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
    $("#upgrades").css("display", "block");
}

// Initialize the game
initializeGame();



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
 });



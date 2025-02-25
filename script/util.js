export function calcBuyMax(upgrade){
 //Calculate how many upgradescan be bought
 //t = total cost, c = cost, m = Max upgrades
 let [t,m,c] = [0,0,upgrade.cost];
 while (t + c <= gameData.fish.count) {
     t += c;
     c *= upgrade.costMulti;
     m++;
 }
 return (m,t);
}
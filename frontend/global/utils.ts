

const calculateStatsFormularForHp = (baseHp : number, level : number, hpIV : number, hpEV : number) : number => {
    const val = ((((2 * baseHp) + hpIV + (hpEV / 4))* level)/100) + level + 10;
    return Math.floor(val);
}

const calculateStatsFormularForOtherStats = (baseStat : number, level : number, statIv : number
    , statEV : number, natureChange : number) => {

    const val = ((((2 * baseStat) + statIv + Math.floor(statEV / 4)) * level) / 100 + 5) * natureChange;
    return Math.floor(val);
}

export { calculateStatsFormularForHp, calculateStatsFormularForOtherStats };
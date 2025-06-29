

const calculateStatsFormularForHp = (baseHp : number, level : number, hpIV : number, hpEV : number) : number => {
    return Math.floor((((2 * baseHp) + hpIV + ((hpEV / 4) * level))/100) + level + 10)
}

const calculateStatsFormularForOtherStats = (baseStat : number, level : number, statIv : number
    , statEV : number, natureChange : number) => {

    const val = ((((2 * baseStat) + statIv + ((statEV/4) * level)) / 100) + 5) * natureChange
    return Math.floor(val);
}

export { calculateStatsFormularForHp, calculateStatsFormularForOtherStats };
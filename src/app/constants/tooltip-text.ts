export const TOOLTIP = {
    positionHeader: 'Position Value',
    positionText:
        'This is your current position value based on how the market changed.',
    suppliedHeader: 'Supplied Asset',
    suppliedText: 'This is the value you’ve initially supplied.',
    suppliedLong:
        'This is the asset you are supplying and also the asset you are long on. In case this asset increases in value, your profits will increase, in case it looses in value you will experience looses. In case it looses too much in value you can get liquidated.',

    suppliedShort:
        'This is the asset you are supplying and also the asset you are short on. In case this asset increases in value, your profits will increase, in case it looses in value you will experience looses. In case it looses too much in value you can get liquidated.',
    suppliedFarm:
        'This is the asset you are supplying and also the asset you are farming on. In case this asset increases in value, your profits will increase, in case it looses in value you will experience looses. In case it looses too much in value you can get liquidated.',
    borrowedText: 'This is the borrowed value.',
    borrowedHeader: 'Borrowed Asset',
    borrowedLong:
        'This is the asset you are borrowing and also the asset you are long on. In case this asset decreases in value, your profits will increase, in case it gains in value you will experience looses. In case it gains too much in value you can get liquidated. ',
    borrowedShort:
        'This is the asset you are borrowing and also the asset you are short on. In case this asset decreases in value, your profits will increase, in case it gains in value you will experience looses. In case it gains too much in value you can get liquidated. ',
    borrowedFarm:
        'This is the asset you are borrowing and also the asset you are farming on. In case this asset decreases in value, your profits will increase, in case it gains in value you will experience looses. In case it gains too much in value you can get liquidated. ',
    currentPriceHeader: 'Current Price',
    currentPriceText: 'Current Price is the 1 Supply token Borrow token.',
    liquidationHeader: 'Liquidation Event',
    liquidationText:
        'In case your asset drops below this price, your position will be liquidated.',
    supplyAPRHeader: 'Supply APR',
    supplyAPRText: 'This is the APR that you make for supplying.',
    borrowAPRHeader: 'Borrowed APR',
    borrowAPRText:
        'FODL uses your supplied APR and lends it therefore maximizes your returns.',
    totalHeader: 'Total APR',
    totalText: 'This is your total APR for this position.',
    leverageTooltipHeader: 'Leverage',
    leverageText:
        'This is your current leverage for this strategy. A higher leverage means that you have more exposure in case the market fluctuates. ',
    leverageTooltipText:
        'This is the leverage percentage for this strategy. This means that you can increase your exposure to the asset. Increasing your exposure will bring you more profit if your strategy performs well, you can loose more if it doesn’t.',
    assumingHeader: 'Assuming Market Grows by',
    assumingText:
        'You can increase your leverage, assuming the market grows by a certaing percentage. You will also have more exposure in case the market will decrease.',
    stopLossHeader: 'Stop Loss Price',
    stopLossText:
        'In case the market goes below this price, the bot will initiate the stop/loss.',
};

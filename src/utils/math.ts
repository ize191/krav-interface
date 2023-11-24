import BigNumber from 'bignumber.js'
import { BASE_ONE_HOUR_BLOCK, LIQ_THRESHOLD_P, MAX_GAIN_P, OPEN_FEES } from '../constant/math'
import { getBigNumberStr } from './index'
import { OverviewData } from '../hook/hookV8/useGetTotalMarketOverview'

export const eXDecimals = (value: BigNumber | string, decimals: number) => {
  return new BigNumber(value).div(new BigNumber(10).pow(decimals))
}

export const addDecimals = (value: BigNumber | string, decimals: number) => {
  return new BigNumber(value).times(new BigNumber(10).pow(decimals))
}

//TODO: fix After docking the factory contract
export const getLongOrShortUSD = (
  leverage: number,
  inputAmount: BigNumber,
  fees: BigNumber,
  targetPrice: BigNumber,
  tokenToBTC: number
) => {
  return inputAmount.minus(fees).times(leverage).div(tokenToBTC)
}

export const getLiqPrice = (
  openPrice: BigNumber,
  collateral: BigNumber,
  isLong: boolean,
  leverage: number,
  rolloverFee: BigNumber | number = 0,
  fundingFee: BigNumber | number = 0
) => {
  const collateralImpact = collateral.times(LIQ_THRESHOLD_P).div(100).minus(rolloverFee).minus(fundingFee)
  const liqPriceDistance = openPrice.times(collateralImpact).div(collateral).div(leverage)
  const liqPrice = isLong ? openPrice.minus(liqPriceDistance) : openPrice.plus(liqPriceDistance)
  return liqPrice.isGreaterThan(0) ? liqPrice : new BigNumber(0)
}

export const getFees = (positionDAI: BigNumber, leverage: number) => {
  return positionDAI.times(leverage).times(OPEN_FEES).times(2)
}

export const getReachPrice = (leverage: number, isBuy: boolean, percentProfit: number, openPrice: BigNumber) => {
  if (isBuy) {
    const index = openPrice.times(percentProfit).div(100 * leverage)
    return index.plus(openPrice)
  } else {
    const index = openPrice.times(percentProfit).div(100 * leverage)
    return openPrice.minus(index)
  }
}

export const getTakeProfit = (
  openPrice: BigNumber,
  currentPrice: BigNumber,
  isBuy: boolean,
  leverage: number,
  isSl: boolean
) => {
  const diff = isBuy ? currentPrice.minus(openPrice) : openPrice.minus(currentPrice)
  const p = diff.times(100 * leverage).div(openPrice)
  if (p.isGreaterThan(MAX_GAIN_P)) {
    return new BigNumber(MAX_GAIN_P)
  } else {
    if (isSl) {
      if (p.isLessThan(-100)) return new BigNumber(-100)
      else return p
    } else return p
  }
}

export const getBorrowFees = (fundingFeePerBlockP?: BigNumber) => {
  if (fundingFeePerBlockP) {
    return getBigNumberStr(eXDecimals(fundingFeePerBlockP, 10).div(100).times(BASE_ONE_HOUR_BLOCK), 6)
  } else return 0
}

export const getBooster = (
  userLiquidityProvided: number | BigNumber,
  overviewData: OverviewData,
  userVeKravAmount: BigNumber,
  totalVeKravAmount: BigNumber
) => {
  //lpBalance (mining)
  //lpBalanceTotal  (overview)
  //workingLPSupply （overview）
  //workinglpBalance = min(0.4 * lpBalance + 0.6 * (lpBalanceTotal + lpBalance) * (veBalance/ veSupply), lpBalance)
  //Booster = (workinglpBalance / (workingLPSupply + workinglpBalance)) / (0.4 * lpBalance / (workingLPSupply + 0.4*lpBalance))
  if (userVeKravAmount && totalVeKravAmount && userLiquidityProvided && Object.keys(overviewData).length > 0) {
    const lpAmount = new BigNumber(userLiquidityProvided)
    const params1 = lpAmount
      .times(0.4)
      .plus(lpAmount.plus(overviewData.liquiditySupply).times(0.6).times(userVeKravAmount.div(totalVeKravAmount)))
    const workingLpBalance = params1.isGreaterThan(lpAmount) ? lpAmount : params1
    const booster = new BigNumber(workingLpBalance)
      .div(overviewData.workingLPSupply.plus(workingLpBalance))
      .div(lpAmount.times(0.4).div(overviewData.workingLPSupply.plus(lpAmount.times(0.4))))
    // console.log('booster', booster.toFixed(4))
    return booster
  } else return new BigNumber(0)
}

export const getTradeBooster = (
  userVolume: number | BigNumber,
  overviewData: OverviewData,
  userVeKravAmount: BigNumber,
  totalVeKravAmount: BigNumber
) => {
  console.log('OverviewData', overviewData)
  if (userVeKravAmount && totalVeKravAmount && userVolume && Object.keys(overviewData).length > 0) {
    const volumeAmount = new BigNumber(userVolume)
    const params1 = volumeAmount
      .times(0.4)
      .plus(volumeAmount.plus(overviewData.tradingVolume).times(0.6).times(userVeKravAmount.div(totalVeKravAmount)))
    const workingTradeBalance = params1.isGreaterThan(volumeAmount) ? volumeAmount : params1
    const booster = new BigNumber(workingTradeBalance)
      .div(overviewData.workingTraderVolume.plus(workingTradeBalance))
      .div(volumeAmount.times(0.4).div(overviewData.workingTraderVolume.plus(volumeAmount.times(0.4))))
    // console.log('booster', booster.toFixed(4))
    return booster
  } else return new BigNumber(0)
}

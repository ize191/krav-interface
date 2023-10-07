/** @jsxImportSource @emotion/react */
import { PairInfo } from './TradeLeft/PairInfo'
import { chart, tradeLeft } from './style'
import { MyTrade } from './TradeLeft/MyTrade'
import TradingViewWidget from './TradeLeft/newTradingView'
import { SelectToken } from '../Dialog/SelectToken'
import BigNumber from 'bignumber.js'
import { BasicModel } from './TradeLeft/BasicModel'
import { useRootStore } from '../../store/root'
import { css, useMediaQuery, useTheme } from '@mui/material'
import { SecondChart } from './TradeLeft/SecondChart'
import { TradeMode } from '../../store/TradeSlice'

type TradeLeftProps = {
  positionSizeDai: BigNumber
  leverage: number
  isBuy: boolean
  limitPrice: string | BigNumber
  tradeType: number
}

export const TradeLeft = ({ positionSizeDai, leverage, isBuy, limitPrice, tradeType }: TradeLeftProps) => {
  const { tradeModel, setTradeModel, isOpenSelectToken, setIsOpenSelectToken } = useRootStore((state) => ({
    tradeModel: state.tradeModel,
    setTradeModel: state.setTradeModel,
    isOpenSelectToken: state.isOpenSelectToken,
    setIsOpenSelectToken: state.setIsOpenSelectToken,
  }))
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <>
      <SelectToken isOpen={isOpenSelectToken} setIsOpen={setIsOpenSelectToken} />
      <div
        css={[
          tradeLeft,
          css`
            padding-right: ${isMobile ? 0 : '18px'};
          `,
        ]}
      >
        <PairInfo tradeModel={tradeModel} setIsOpenSelectToken={setIsOpenSelectToken} setTradeModel={setTradeModel} />
        {tradeModel === TradeMode.PRO && (
          <div
            css={[
              chart,
              css`
                background: ${theme.background.primary};
              `,
            ]}
          >
            <TradingViewWidget />
          </div>
        )}
        {tradeModel === TradeMode.BASIC && (
          <BasicModel
            positionSizeDai={positionSizeDai}
            isBuy={isBuy}
            leverage={leverage}
            limitPrice={limitPrice}
            tradeType={tradeType}
          />
        )}
        {tradeModel === TradeMode.DEGEN && <SecondChart />}
        {!isMobile && <MyTrade />}
      </div>
    </>
  )
}

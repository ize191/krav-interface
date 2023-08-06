/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { bottomCard } from '../style'
import { useRootStore } from '../../../store/root'
import { ReactComponent as ExchangeIcon } from '../../../assets/imgs/exchange.svg'
import { useState } from 'react'
import BigNumber from 'bignumber.js'

type PositionOverViewProps = {
  isBuy: boolean
}

export const PositionOverView = ({ isBuy }: PositionOverViewProps) => {
  const BTCPrice = useRootStore((state) => state.BTCPrice)
  const tradePool = useRootStore((state) => state.tradePool)
  const [isExchange, setIsExchange] = useState(false)
  return (
    <div css={bottomCard}>
      <div> {isBuy ? 'long' : 'short'} btc</div>
      <div
        css={css`
          padding-top: 12px;
        `}
      >
        {BTCPrice.isGreaterThan(0) ? (
          <p
            css={css`
              padding: 0 24px 16px 24px;
            `}
          >
            <span
              css={css`
                color: #757575;
              `}
            >
              Per Ticket Size
            </span>
            {!isExchange && (
              <span>
                : {tradePool?.proportionBTC} {tradePool?.symbol} = 1 BTC
              </span>
            )}
            {isExchange && (
              <span>
                : 1 BTC = {new BigNumber(1).div(tradePool?.proportionBTC).toFixed(6)} {tradePool?.symbol}{' '}
              </span>
            )}

            <ExchangeIcon
              css={css`
                cursor: pointer;
                margin-left: 6px;
              `}
              onClick={() => setIsExchange(!isExchange)}
            />
          </p>
        ) : (
          <p
            css={css`
              padding-bottom: 8px;
            `}
          >
            -
          </p>
        )}
        <p className="card-details">
          <span>Available Liquidity:&nbsp;</span>
          <span>
            {tradePool?.poolCurrentBalance?.toFixed(2)} {tradePool?.symbol}
          </span>
        </p>
      </div>
    </div>
  )
}

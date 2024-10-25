import { createGlobalStyle } from 'styled-components'
import { PancakeTheme } from '@pancakeswap/uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Titillium Web', sans-serif;
  }
  body {
    // background-color: #f1f3f4;
    // background-image: url(https://i.ibb.co.com/kQnwWDg/core-Bull12.png);
    // background-size: cover;
    // background-repeat: no-repeat;
    // background-position: center;

    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle

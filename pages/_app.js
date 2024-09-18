import '../styles/globals.css'
import {
  ChainId,ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  trustWallet,

} from "@thirdweb-dev/react";


const activeChain = ChainId.Mainnet;
function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider activeChain={activeChain}
    clientId='999839f165ef72616f5f333ddee737ad'
    >
  <Component {...pageProps} />
    </ThirdwebProvider>
)
}

export default MyApp

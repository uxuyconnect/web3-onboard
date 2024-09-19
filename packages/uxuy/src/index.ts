import type { WalletInit, WalletInterface } from '@web3-onboard/common'

function uxuyWallet({
  supportedWalletType = 'all',
  darkMode = false,
  enableMobileWalletLink = false,
  reloadOnDisconnect = true
}: {
  /** @deprecated Deprecated after version 2.2.7 of @web3-onboard/coinbase Use dark theme */
  darkMode?: boolean
  /** @deprecated Deprecated after version 2.2.7 of @web3-onboard/coinbase whether to connect mobile web app via WalletLink, defaults to false */
  enableMobileWalletLink?: boolean
  /** @deprecated Deprecated after version 2.2.7 of @web3-onboard/coinbase whether or not to reload dapp automatically after disconnect, defaults to true */
  reloadOnDisconnect?: boolean
  /** Type of Coinbase wallets to support - options : 'all' | 'smartWalletOnly' | 'eoaOnly' - Default to `all` */
  supportedWalletType?: 'all' | 'smartWalletOnly' | 'eoaOnly'
} = {}): WalletInit {
  return () => {
    return {
      label: 'UXUY Wallet',
      getIcon: async () => (await import('./icon.js')).default,
      getInterface: async ({
        chains,
        appMetadata
      }): Promise<WalletInterface> => {
        if (enableMobileWalletLink || reloadOnDisconnect || darkMode) {
          console.warn(
            'darkMode, enableMobileWalletLink and reloadOnDisconnect init props are deprecated after version 2.2.7 of @web3-onboard/coinbase'
          )
        }
        const { name, icon } = appMetadata || {}

        // according to https://github.com/wagmi-dev/wagmi/issues/383
        // @coinbase/wallet-sdk export double default fields
        // so we need to detect it to get the real constructor
        const { default: UXUYWalletSDK } = await import(
          '@uxuycom/web3-tg-sdk'
        )
        const UXUYWalletSDKConstructor = (
          (UXUYWalletSDK as any).default
            ? (UXUYWalletSDK as any).default
            : UXUYWalletSDK
        ) as typeof UXUYWalletSDK
        const { isHex, toHex, createEIP1193Provider, fromHex } = await import(
          '@web3-onboard/common'
        )

        const base64 = window.btoa(icon || '')
        const appLogoUrl = `data:image/svg+xml;base64,${base64}`

        const appChainIds = chains.map(({ id }) =>
          fromHex(id as `0x${string}`, 'number')
        )

        const instance = new UXUYWalletSDKConstructor({
          appName: name || '',
          appLogoUrl,
          appChainIds
        })

        const uxuyWalletProvider = instance.ethereum

        // patch the chainChanged event
        const on = uxuyWalletProvider.on.bind(uxuyWalletProvider)

        uxuyWalletProvider.on = (event, listener) => {
          // @ts-ignore
          on(event, val => {
            if (event === 'chainChanged') {
              let hexVal: string
              if (isHex(val)) {
                hexVal = val
              } else {
                hexVal = toHex(val)
              }

              // @ts-ignore
              listener(hexVal)
              return
            }

            listener(val)
          })

          return uxuyWalletProvider
        }
        const provider = createEIP1193Provider(uxuyWalletProvider)
        provider.removeListener = (event, func) => {}

        return {
          provider,
          instance
        }
      }
    }
  }
}

export default uxuyWallet

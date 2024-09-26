# @web3-onboard/Uxuy

## Wallet module for connecting Uxuy Wallet SDK to web3-onboard

See [Uxuy Wallet Developer Docs](https://docs.uxuy.com/uxuy-connect/guide/)

### Install

`npm i @web3-onboard/uxuy`

## Options

```typescript
interface UxuyWalletParameters {
  debug?: boolean
  bridge?: string
  connect?: string
  connect_direct_link?: string
  injected?: boolean
  request_timeout?: number
  metaData?: {
    hostname: string
    icon?: string
    name?: string
    url?: string //
    description?: string
    direct_link?: string
  }
}
```


## Usage

```typescript
import Onboard from '@web3-onboard/core'
import UxuyWalletModule from '@uxuyalpha/web3-onboard-uxuy'

// initialize the module with options
const UxuyWalletSdk = UxuyWalletModule()

// can also initialize with no options...
// const UxuyWalletSdk = UxuyWalletModule()

const onboard = Onboard({
  // ... other Onboard options
  wallets: [
    UxuyWalletSdk
    //... other wallets
  ]
})

const connectedWallets = await onboard.connectWallet()
console.log(connectedWallets)
```

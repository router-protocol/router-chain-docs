---
title: Nitro Widget
sidebar_position: 1
description: Widget to integrate cross-chain swaps on your website
---

We have developed a widget that can be used by other projects to give their users an option to perform cross-chain transactions directly from their UI.

## Usage/Example
Nitro's widget can easily be integrated as an iframe. An example of the same is given below:
```jsx
const baseUrl = "https://testnet.routernitro.com/";

const configuration = {
isWidget: true,
partnerId: "0", // get your unique partner id - https://app.routernitro.com/partnerId
fromChain: "17000",
toChain: "43113",
fromToken: "0x5c2c6ab36a6e4e160fb9c529e164b7781f7d255f",
toToken: "0x69dc97bb33e9030533ca2006ab4cef67f4db4125",
ctaColor: "#E8425A",
textColor: "#1A1B1C",
backgroundColor: "#3fb043",
logoURI: "ipfs://QmaznB5PRhMC696u8yZuzN6Uwrnp7Zmfa5CydVUMvLJc9i/aDAI.svg",
display: "vertical",
isFromSelLocked: "1",
isToSelLocked: "0",
};

const paramString = new URLSearchParams(configuration).toString();
document.getElementById("widget__iframe").src = `${baseUrl}?${paramString}`;
```

:::note
1. You can use [Nitro's Widget Builder Tool]( https://testnet.routernitro.com/widget) to automatically generate the widget paramaters.
2. In case you want source / destination token to be native token, then the following value should be used for token address - 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
3. To integrate the widget on your UI, you will be assigned a unique partner ID. To get your partner ID, please use the link [here](https://testnet.routernitro.com/partnerId).
:::

```jsx
<iframe id="widget__iframe" height="610px" width="420px" 
src="https://testnet.routernitro.com/swap?isWidget=true&partnerId=widget-0101&fromChain=17000&toChain=43113&fromToken=0x5c2c6ab36a6e4e160fb9c529e164b7781f7d255f&toToken=0x69dc97bb33e9030533ca2006ab4cef67f4db4125"
style="border: none; border-radius: 11px; box-shadow: 3px 3px 10px 4px rgba(0, 0, 0, 0.05);">
</iframe>
```

Generate the paramString (as given in the example above) and attach it to the src of the iframe. Except for the isWidget parameter, all of the query params in the URL can be customized based on your requirement -

| **Parameter** | **Description** |
| -------- | -------- |
| isWidget | true (Required) |
| partnerId | Unique for each partner (Required) |
| fromChain | ChainId of the chain that needs to be shown as the default source chain. By default, the source chain will be chosen as the chain to which the user's wallet is connected. In case the user's wallet is not connected, Polygon is shown as the default source chain. |
| toChain |	ChainId of the chain that needs to be shown as the default destination chain. By default, BSC is shown as the destination chain. |
| fromToken | Address of the token that needs to be shown as the selected token on the source chain. By default, USDT will be shown as the source token. |
| toToken |	Address of the token that needs to be shown as the selected token on the destination chain. By default, USDT will be shown as the destination token. |
| ctaColor | Color of the "Call to Action" buttons |
| textColor	| Color of all the text in the widget |
| backgroundColor |	Background color of the widget |
| logoURI |	Circular logo URL - if not given, the original Router logo will be shown |
| slippageTolerance |	Default slippage tolerance for cross-chain swaps |
| display |	Display can be vertical/horizontal |
| isFromSelLocked |	If the value is 1 it will lock the source side selection |
| isToSelLocked |	If the value is 1 it will lock the destination side selection |

### Restricting chains/tokens
There might also be a few cases in which a platform wants to show a selected list of chains or tokens for its users. With Router's widget, partners can do this by adding a few parameters. An example with restricted parameters -

```jsx 
<iframe height="610px" width="420px" 
src="https://testnet.routernitro.com/swap?isWidget=true&partnerId=widget-0101&fromChain=17000&toChain=43113&fromToken=0x5c2c6ab36a6e4e160fb9c529e164b7781f7d255f&toToken=0x69dc97bb33e9030533ca2006ab4cef67f4db4125"
style="border: none;border-radius: 11px;box-shadow: 3px 3px 10px 4px rgba(0, 0, 0, 0.05);">
</iframe>
```

Restriction parameters are optional and can be added along with the aforementioned parameters as query params in the URL -

| **Parameter** | **Description** |
| -------- | -------- |
| srcChains |	List of chainIds separated by a comma that needs to be shown in the source chain selection menu. |
| dstChains |	List of chainIds separated by a comma that needs to be shown in the destination chain selection menu. |
| srcTokens |	List of token addresses belonging to the list of srcChains separated by a comma that needs to be shown in the source token selection menu. |
| dstTokens |	List of token addresses belonging to the list of dstChains separated by a comma that needs to be shown in the destination token selection menu. |

:::note
1. `height` and `width` are customizable, but we recommend keeping the aspect ratio close to the default.
2. In the case of using restricted tokens along with the restricted chain parameter, at least one token address for each restricted chain should be provided. For example, if restricted chains on the source are chosen to be Polygon and BSC, and there is a restriction on tokens as well, then a minimum of 2 token addresses need to be specified in the restricted token parameter. One address for Polygon and another one for BSC. This will make sure that only one token is shown for Polygon and one for BSC for users to select.
:::

import { EthereumProvider } from "@walletconnect/ethereum-provider"

const switch_add_btn_el = document.querySelector('#switch-add-btn')
if(!switch_add_btn_el) throw new Error('MRE Test - Chain button is undefined')

const switch_btn_el = document.querySelector('#switch-btn')
if(!switch_btn_el) throw new Error('MRE Test - Chain button is undefined')

const connect_btn_el = document.querySelector('#connect-btn')
if(!connect_btn_el) throw new Error('MRE Test - Connect button is undefined')

const provider = await EthereumProvider.init({
  projectId: 'cdbd18f9f96172be74c3e351ce99b908',
  optionalChains: [2021, 1, 5, 56, 137],
  showQrModal: true
})

provider.on('disconnect', ()=>{(connect_btn_el as HTMLElement).innerHTML = "Connect"})

if(provider.session){
  connect_btn_el.innerHTML = "Disconnect"
}

async function connect(){
  if(!provider) throw new Error('MRE Test - Provider is undefined')

  if(provider.session){
    console.log("disconnecting")
    await provider.disconnect();
    (connect_btn_el as HTMLElement).innerHTML = "Connect"
    return
  }

  console.log("connecting")
  const accounts = await provider.enable();
  if(accounts.length){
    (connect_btn_el as HTMLElement).innerHTML = "Disconnect"
    console.log(accounts)
  }
}

async function add_switch_chain(){
  if(!provider) throw new Error('MRE Test - Provider is undefined')

  console.log("Add chain starts")
  const add_chain_res = await provider.request<number|string>({
    "method": "wallet_addEthereumChain",
    "params": [
      {
        "chainId": "0x64",
        "chainName": "Gnosis",
        "rpcUrls": [
          "https://rpc.ankr.com/gnosis"
        ],
        "iconUrls": [
          "https://xdaichain.com/fake/example/url/xdai.svg",
          "https://xdaichain.com/fake/example/url/xdai.png"
        ],
        "nativeCurrency": {
          "name": "xDAI",
          "symbol": "xDAI",
          "decimals": 18
        },
        "blockExplorerUrls": [
          "https://blockscout.com/poa/xdai/"
        ]
      }
    ]
  })
  console.log("Add chain finished", add_chain_res)
  console.log("-------------------")
  console.log("Switch chain starts")
  const switch_chain_res = await provider.request<number|string>({
    method:'wallet_switchEthereumChain', params:[{ chainId:'0x64' }]
  })
  console.log("Switch chain finished", switch_chain_res)
}

async function switch_chain(){
  console.log("Switch chain starts")
  const switch_chain_res = await provider.request<number|string>({
    method:'wallet_switchEthereumChain', params:[{ chainId:'0x64' }]
  })
  console.log("Switch chain finished", switch_chain_res)
}

switch_add_btn_el.addEventListener('click', ()=>add_switch_chain())
switch_btn_el.addEventListener('click', ()=>switch_chain())
connect_btn_el.addEventListener('click', ()=>connect())
console.log('MRE Test - App running')
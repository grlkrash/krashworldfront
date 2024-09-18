import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState, useRef } from "react";
import { createThirdwebClient } from "thirdweb";
import { useConnect,metamaskWallet,useActiveWallet,useActiveAccount    } from "thirdweb/react";
const {ethers} = require("ethers")
const alchKey = 'https://eth-mainnet.g.alchemy.com/v2/E1S2goh_AuJhx2AK8vjrr7hDW2gVjRgy' 
import {
  ThirdwebProvider,
  ConnectButton,
  darkTheme,
} from "thirdweb/react";
import {
  createWallet,
} from "thirdweb/wallets";
const provider = new ethers.providers.JsonRpcProvider(alchKey);


export default function Home() {
  const [address, setAddress] = useState();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showEmailField, setShowEmailField] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [names, setNames] = useState([]);
  const [searchWallet, setSearchWallet] = useState('')
  const [showShare, setShowShare] = useState(false)
  const [nftCheck, setNftCheck] = useState([])

  const [email, setEmail] = useState();
  const activeAccount = useActiveAccount();


  if(activeAccount&&!address){
    setAddress(activeAccount.address)
  }

  useEffect(() => {
    if (address) {
      let load = toast.loading("Loading...")
      try {
        fetch(`/api/find-user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'address':address,
          }
        })
        .then(data => {
          data.json().then( res =>{
            toast.dismiss(load)
            toast.success(res.success ? "Success connection!" : null)
            console.log(res)

            if(res.success&&res.user.email=='temp'){
              setShowEmailField(true)
            }

            if(!res.success){
              fetch(`/api/user`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'address':address,
                  'timestamp':0.01
                }
              })
              .then(data => {
                data.json().then( res =>{
                  setShowEmailField(true)
                }
              )
            })
            }
          })
        })
        // setShowEmailField(false);
        fetch(`/api/get-users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(data => {
          data.json().then( res =>{
            // let arr = res.users.sort((a, b) => b.timestamp - a.timestamp);
            let arr = []
            res.users.forEach((e,i) => {
              e.timestamp = (100 - Number(e.timestamp)).toString()
              arr.push(e)
            })
             arr = arr.sort((a, b) => a.timestamp - b.timestamp);

            arr.forEach((e,i) => {
              e.place = i+1
            });
            setAllUsers(arr)
            setNftCheck(res.holders)
            setTableData(arr.slice(0, 10))
          })
        })
      } catch (error) {
        console.log(error)
      }
    }
  }, [address]);

const client = createThirdwebClient({
  clientId: "999839f165ef72616f5f333ddee737ad",
});
  const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("com.trustwallet.app"),
    createWallet("com.thirdweb"),
  ];

useEffect(() => {
  if(allUsers){
async function foo(){
    let arr = []
    for (let i = 0; i < allUsers.length; i++) {
      let el = await getFormattedAddress(allUsers[i].address)
      arr.push(el)
    }
    setNames(arr)
  }
  foo()
}
},[allUsers])

  async function getFormattedAddress(addr){
   try {
    let ens = await provider.lookupAddress(addr);
    if(ens){
      return ens
    }
    const url = 'https://api.lens.dev/graphql';
    const response = await fetch(url, {
      method: 'POST', // Используем метод POST
      headers: {
        'Content-Type': 'application/json', // Устанавливаем заголовок Content-Type
      },
      body: JSON.stringify({
        query: `
          query Profile($address: EthereumAddress!) {
            profile(address: $address) {
              handle
            }
          }
        `,
        variables: {
          address: addr // Передаем адрес в переменные запроса
        }
      })
    });

    // Преобразование ответа в JSON
    const result = await response.json();
    if (result.errors) {
      
    } else {
      // Получаем имя пользователя (handle) из ответа
      const handle = result.data.profile.handle;
      return handle
    }
    const url2 = `https://api.opensea.io/api/v1/user/${address}`;
    const response2 = await fetch(url2, {
      method: 'GET', // Используем метод GET
      headers: {
        'Accept': 'application/json', // Устанавливаем заголовок Accept
      }
    });
    const openSea = await response2.json();

    if (openSea && openSea.username) {
      return openSea.username
    } 

    return false

   } catch (error) {
    
   }

  }

  function getTime(timestamp){
    if(timestamp == 0){
      return '99:99'
    }
    console.log(timestamp)
    let seconds = timestamp.split('.')[0]
    let milliseconds = timestamp.split('.')[1]
    return seconds + ':' + milliseconds.substring(0, 2);
  }

  function findMeHandler(){
    let arr = allUsers.filter((user) => user.address == address)
    setTableData(arr)
  }

  function setTopTenHandler(){
    setTableData(allUsers.slice(0, 10))
  }

  function findWalletHandler(addr){
    let arr = allUsers.filter((user) => user.address == addr)
    setTableData(arr)
  }

  function renderTable(){
    return tableData.map((user, i) => {
      const isEven = i % 2 === 0;
      const backgroundColor = isEven ? 'rgba(255, 218, 15, 0.5)' : 'white';
      return(
        <div className="table-el" style={{backgroundColor}}>
          <div className="t-one">{user.place}</div>
          <div className="t-two">
            <img src="/circle.png" alt="" width={30} height={30} />
            {/* <p>{await getFormattedAddress(user.address)}</p> */}
            {/* {user.address.slice(0,6) + '.....' + user.address.slice(-4)} */}
            {/* {user.address} */}
            {names[i] ? (
              <div className="table-address-name">
                <p>
                {nftCheck.find(e => e.address == user.address).haveNft ? <img src="/logo.png" alt="" width={30} height={30} /> : null}
                  {names[i]}</p>
              </div>
            ) : (
              <div className="table-address-name">
                <p>
                {nftCheck.find(e => e.address == user.address).haveNft ? <img src="/logo.png" alt="" width={30} height={30} /> : null}
                  {user.address.slice(0,6) + '.....' + user.address.slice(-4)}</p>
               {/* {user.email !='temp' && user.email !='none' ? <p>{user.email.split('@')[0]}</p> : null} */}
              </div>
            )}
          </div>
          <div className="t-three">
            <p>{getTime(user.timestamp)}</p>
          </div>
        </div>
    )});
  }


async function sendEmailInfo(emailInput){
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput)) {
    toast.error("Please enter a valid email address")
    return;
  }
  fetch(`/api/email`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'address':address,
      'email':emailInput
    }
  })
  .then(data => {
    data.json().then( res =>{
      toast.success(res.success ? "Thanks, email added!" : null)
      setShowEmailField(false)
    })
  })
}

function getUserTime(){
  if(!address) return
  if(!allUsers) return
  let resp = allUsers.filter((user) => user.address == address)
  console.log(resp)
  return getTime(resp[0].timestamp)
}


const handleClick = (addr) => {
  // Redirect to another page
  window.location.href = addr;
};

  if(!address){
    return(
      <div className="login-container">
        <img className='logo' src="/logo.png" alt="" />
<ThirdwebProvider>
     <div className="main-buttons">
     <ConnectButton
      className="main-btn"
        client={client}
        wallets={wallets}
        theme={darkTheme({
          colors: {
            primaryButtonBg: "#FFDA0F",
          },
        })}
        btnTitle="connect wallet" 
        connectModal={{ size: "wide" }}
      />
      <button className="main-btn" 
      onClick={() => window.open("https://wallet.coinbase.com/smart-wallet", "_blank")}
      >
        what's a wallet?</button>
     </div>
    </ThirdwebProvider>
    <ToastContainer />
      </div>
    )
  }

if(showLeaderboard){
  return(
    <div className="leaderboard-container">
      <div className="lb-header">
      <img className='logo' src="/logo.png" alt="" />
      <a href="https://krash.world">Home</a>
      <div className="search-bar">
        <input type="text" placeholder="Search for a wallet..." onChange={(e) => setSearchWallet(e.target.value)} />
        <button onClick={(e)=> findWalletHandler(searchWallet)} >Search</button>
      </div>
      <a href="https://www.krash.world/store">Store</a>
      <a href="https://www.krash.world/account/login">Login</a>
      </div>
      <div className="lb-main">
        <div className="description">
          <h1>YOUR TIME:{getUserTime()}</h1>
        </div>
        
        <div className="buttons">
        <div className="stars-desc">
          <img src="/logo.png" alt="" />
          <p>= Game Pass holder (top 10 holders eligible for rewards)</p>
        </div>
        {/* <button onClick={setTopTenHandler} >top 10</button> */}
      <button onClick={findMeHandler} >
        <div className="share-inner">
        <p>find me</p>
        <img src="/search.png" alt="" width={30} height={30}/>
        </div>
      </button>
      {/* <button className="share-btn" onClick={() => setShowShare(!showShare)}>
        <div className="share-inner">
        <p>share</p>
        <img src="/share.png" alt=""width={30} height={30} />
        </div>
      </button> */}
      {showShare && (
        <div className="">
          <div className="share-darker" onClick={() => setShowShare(false)} ></div>
          <div className="share-overlay" onClick={(e) => e.target !== e.currentTarget && setShowShare(false)}>
          <div className="share-content" onClick={(e) => e.stopPropagation()}>
            <div className="share-inner">
            <p style={{marginRight:'40px'}} >share to Warpcast</p>
            <img src="/warpcast.png" alt="" />
            </div>
            {/* <p>Share an image</p> */}
            <div className="share-inner">
            <p style={{marginRight:'110px'}} > Share to X</p>
            <img src="/twitter.png" alt="" />
            </div>
          </div>
        </div>
        </div>
          
        
      )}
        </div>
        <div className="table">
          <div className="table-header">
            <p className='t-one' >rank</p>
            <p className='t-two'>user</p>
            <p className='t-three'>time</p>
          </div>
          {renderTable()}
        </div>
      </div>
      
              
      <ToastContainer />
    </div>
  )
}

 return(
  <div className="container">
            <img className='logo' src="/logo.png" alt="" />
            <div className="links">
              <a href="https://krash.world">Home</a>
              <a href="https://www.krash.world/store">Store</a>
              <a href="https://www.krash.world/account/login">Login</a>
            </div>
    {showEmailField?(
      <div className="emailZone">
        <div className="darker" onClick={()=>setShowEmailField(false)} >
        </div>
          <div className="email-container glow-border">
            <h2>Please write your email:</h2>
            <input type="email"  onChange={(e)=>setEmail(e.target.value)} />
            <button className="main-btn" onClick={()=>sendEmailInfo(email)} >Submit</button>
            <div className="dontask" onClick={()=>sendEmailInfo('none')}><h3>Don't ask me again</h3></div>
          </div>
      </div>
    ):null}
    <h1>KRASH WORLD: THE GAME</h1>
    <button className='main-btn' onClick={()=> handleClick(`/game/${address}`)}>
      PLAY
    </button>
    <button className='main-btn' onClick={()=>setShowLeaderboard(true)}>
      LEADERBOARD
    </button>
    <ToastContainer />
  </div>
 )
}

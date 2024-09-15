const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const cors = require('cors')
const bodyParser = require('body-parser')
const { ethers } = require('ethers');
// const { zoraCreator1155FactoryImplConfig } = require("@zoralabs/1155-deployments");
// const { addresses, abi } = zoraCreator1155FactoryImplConfig;
const { Network, Alchemy } = require('alchemy-sdk');
const settings = {
    apiKey: process.env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: Network.BASE_MAINNET, // Replace with your network.
  };
const alchemy = new Alchemy(settings);

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors('*'))
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const corsOptions = {
  origin: function (origin, callback) {
    return callback(null, true)
  }
}

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

mongoose.connect(`mongodb+srv://grl:$a5uMo67swtZLqT2r@cluster0.822ss2p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



// User schema
const UserSchema = new mongoose.Schema({
    address : {
      type: String,
      requiured: true,
      unique: true
    },
    timestamp: {
        type: String,
        unique: false
    },
    email: {
        type: String,
        unique: false,
        default:"temp"
    }
});
const User = mongoose.model('User', UserSchema);

async function checkNft(owner){
    try {
    const address = "0x1Bf81236caCD7FD0c630fE0BB36E49CFfda37B4c";
    const response = await alchemy.nft.verifyNftOwnership(owner, address)
    return response
    } catch (error) {
        return false
    }
}



app.get('/find-user', cors(corsOptions), async (req, res) =>{
    const address = req.headers.address
    try {
        let user = await User.findOne({ address: address })
        if (!user) {
            res.json({ success: false, error: 'User not found' })
        } else {
            res.json({ success: true, user: user })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, error: 'Server error' })
    }
})

app.get('/get-users', cors(corsOptions), async (req, res) => {
    try {
        let Users = await User.find({})
        if(!Users){
            res.json({success: false, error: 'User not found'})
        } else {
            let arr = []
            for (let i = 0; i < Users.length; i++) {
                let nft = await checkNft(Users[i].address)
                arr.push({address: Users[i].address, haveNft: nft})
            }

            res.json({success: true, users: Users, holders: arr})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false, error: 'Server error'})
    }
})

app.post('/update-timestamp',jsonParser, async (req, res) =>{
    const address = req.headers.address
    const timestamp = req.headers.timestamp
    try {
        let user = await User.findOneAndUpdate({ address: address }, { timestamp: timestamp })
        if (!user) {
            user = new User({ address: address, timestamp: timestamp })
            await user.save()
            res.json({ success: true, message: 'User created', user:user })
        } else {
            res.json({ success: true, message:"User updated",user: user })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, error: 'Server error' })
    }
})

app.post('/update-email',jsonParser, async (req, res) =>{
    const address = req.headers.address
    const email = req.headers.email
    try {
        let user = await User.findOneAndUpdate({ address: address }, { email: email })
        if (!user) {
            res.json({ success: false, error: 'User not found' })
        } else {
            res.json({ success: true, user: user })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, error: 'Server error' })
    }
})


app.post('/user', async (req, res) =>{
    const address = req.headers.address
    const timestamp = req.headers.timestamp
    try {
        let user = await User.findOne({ address: address })
        if (!user) {
            user = new User({ address: address, timestamp: timestamp })
            console.log(user)
            await user.save()
        } else {
            if (100 - Number(timestamp) < (100 - Number(user.timestamp))) {
                user.timestamp = timestamp
                await user.save()
            }
        }
        res.json({ success: true, user: user })
    } catch (error) {
        console.log(error)
        res.json({ success: false, error: 'Server error' })
    }
})




const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});



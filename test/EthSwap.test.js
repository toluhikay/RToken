const { assert } = require('chai');

const RToken = artifacts.require("RToken");
const EthSwap = artifacts.require("EthSwap");

//configuring chai
require('chai')
    .use(require('chai-as-promised'))
    .should()
//creating an helper to help convert the tokens to human readable language
function tokens(n){
    return web3.utils.toWei(n, 'ether')
}

contract('EthSwap', ([deployer, investor])=>{

    let rtoken, ethswap
    before(async()=>{
        rtoken = await RToken.new()
        ethswap = await EthSwap.new(rtoken.address)
        await rtoken.transfer(ethswap.address, tokens('1000000'))
    })
    describe('RToken a contract deployed', async()=>{
        it('Rtoken contract has a name', async()=>{
            // let rtoken = await RToken.new()
            const name = await rtoken.name()
            assert.equal(name, 'RToken')
        })
    })

    describe("EthSwap contract is deployed", async()=>{
        it('contract has a name', async()=>{
            // let ethsawp = await EthSwap.new()
            const name = await ethswap.name()
            assert.equal(name, "Eth Swap Practice")
        })

        it('EthSwap has tokens', async()=>{
            // let rtoken = await RToken.new()
            // let ethswap = await EthSwap.new()
            const name = await ethswap.name()
            const balance = await rtoken.balanceOf(ethswap.address)
            assert.equal(balance, tokens('1000000'))
        })
    })
    describe("buyTokens()", async() =>{
        let result
        before(async()=>{
            //purchase token before each example
            result =  await ethswap.buyTokens({from: investor, value: tokens('1')})
        })
        it('users can buy tokens from ethswap', async()=>{
           let investorBalance = await rtoken.balanceOf(investor)
           assert.equal(investorBalance.toString(), tokens('100'))

           //check for to make sure token is lost in ethswap
           let ethswapbalance
           ethswapbalance = await rtoken.balanceOf(ethswap.address)
           assert.equal(ethswapbalance.toString(), tokens('999900'))

           //check if ethswap balance went up
           ethswapbalance = await web3.eth.getBalance(ethswap.address)
           assert.equal(ethswapbalance.toString(), web3.utils.toWei('1', 'ether'))

           //test maybe the event emitted is correct
           const event = result.logs[0].args;
           assert.equal(event.account, investor);
           assert.equal(event.rtoken, rtoken.address);
           assert.equal(event.amount.toString(), tokens('100').toString());
           assert.equal(event.rate.toString(), '100')
        })
    })

    describe('sellTokens()', async()=>{
        let result
        before(async()=>{
            await rtoken.approve(ethswap.address, tokens('100'), { from: investor})
            result = await ethswap.sellTokens(tokens('100'), { from: investor})

        })
        it('it allows users to sell token to ethswap for a fixed price', async()=>{
            //check if invextor balance went down
            let investorBalance = await rtoken.balanceOf(investor)
           assert.equal(investorBalance.toString(), tokens('0'))

           //check to make sure token was gained in ethswap
           let ethswapbalance
           ethswapbalance = await rtoken.balanceOf(ethswap.address)
           assert.equal(ethswapbalance.toString(), tokens('1000000'))

           //check if ethswap balance went back to 0
           ethswapbalance = await web3.eth.getBalance(ethswap.address)
           assert.equal(ethswapbalance.toString(), web3.utils.toWei('0', 'ether'))

           //test maybe the event emitted is correct
           const event = result.logs[0].args;
           assert.equal(event.account, investor);
           assert.equal(event.rtoken, rtoken.address);
           assert.equal(event.amount.toString(), tokens('100').toString());
           assert.equal(event.rate.toString(), '100')

           //TEST FOR FAILURE when investor want to send more than they have
           await ethswap.sellTokens(tokens('500'), { from: investor}).should.be.rejected;
        })
    })
})
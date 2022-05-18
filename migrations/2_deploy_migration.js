const RToken = artifacts.require("RToken");
const EthSwap = artifacts.require("EthSwap");

module.exports = async function (deployer) {
    //for deploying token
    await deployer.deploy(RToken);
    const rtoken = await RToken.deployed();
    
    //for deloying ethswap
    await  deployer.deploy(EthSwap, rtoken.address);
    const ethswap = await EthSwap.deployed();

    //transfer tokens
    await rtoken.transfer(ethswap.address, '100000000000000000000000')
};

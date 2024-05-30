const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async({deployments, getNamedAccounts}) => {
  const { deployer } = await getNamedAccounts() //accessed 1st account(deployer) in the config file
  const { deploy, log } = deployments
  const chainId = network.config.chainId
  let priceFeed

  if(developmentChains.includes(network.name)) {
    priceFeed = "0x0000000000000000000000000000000000000000" 
  } else {
    priceFeed = networkConfig[chainId]["ethUsdPriceFeed"]  
  }
  

  console.log(`============ Deploying CarMarketplace on ${network.name}  network ============`)
  
  const marketplace = await deploy("CarMarketplace", {
    from: deployer,
    log: true,
    args: [priceFeed],
    blockConfirmations: developmentChains.includes(network.name) 
    ? 1 
    : VERIFICATION_BLOCK_CONFIRMATIONS
  })
  
  console.log(`============ Successfully deployed! ============`)
  
  if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(marketplace.address, marketplace.args)
  }
}

module.exports.tags = ["all", "marketplace"];
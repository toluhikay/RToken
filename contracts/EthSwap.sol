//SPDX-License-Identifier:MIT
pragma solidity >= 0.5.0 < 0.9.0;
//import the rtoken contract so you can interact with it
import './RToken.sol';
contract EthSwap{
    string public name = "Eth Swap Practice";
    //keep track of the RToken contract by storing it as variable inside the cntract 
    RToken public rtoken;
    uint public rate = 100;

    //creating an event to show tokens were purchased
    //this event shows that the token was purchased by account from rtoken with the amount in ether and the rate at which it was purchased
    event TokensPurchased(address account, address rtoken, uint amount, uint rate);
    event TokensSold(address account, address rtoken, uint amount, uint rate);

    //initialize the constructor  so it could know address of rtoken on blockchain
    constructor(RToken _rtoken) public{
        rtoken = _rtoken;
    }

    //now creating a function to help buy the token
    function buyTokens() public payable{
        //initialize the token amount
        uint tokenAmount = msg.value * rate;
        //require that ethswap has enough tokens to sell
        require(rtoken.balanceOf(address(this)) >= tokenAmount, 'balance not enough to make purchase');
        //transfer tokens to the user
        rtoken.transfer(msg.sender, tokenAmount);
        //to emit the TokenPurchased event we do
        emit TokensPurchased(msg.sender, address(rtoken), tokenAmount, rate);
    }

    //now creating a function that allows investor sell token to us and get ether
    function sellTokens(uint _amount) public{
        //require that token balance of sender is  equal to or more than amount they want to send
        require(rtoken.balanceOf(msg.sender)>= _amount);
        //create etheramount they will redeem in equivalence to tokens they sold
        uint etherAmount = _amount / rate;
        //require that ethswap has enough ether
        require(address(this).balance >= etherAmount);
        //call the transferfrom function that allows the ethswap contract spend ether on our behalf
        rtoken.transferFrom(msg.sender, address(this), _amount);
        //
        msg.sender.transfer(etherAmount);

        emit TokensSold(msg.sender, address(rtoken), _amount, rate);
    }
     
}
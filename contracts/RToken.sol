//SPDX-License-Identifier:MIT
pragma solidity >=0.5.0 <0.9.0;

contract RToken{
    string public name = "RToken";
    string public symbol = "RT";
    uint256 public totalSupply = 1000000000000000000000000; //1million tokens
    uint8 public decimals =18;

    event Transfer(address indexed _from, address indexed _to, uint _value);

    event Approval(address indexed _owner, address indexed _spender, uint _value );

    //map the address of the owner to it's balance
    mapping(address => uint256) public balanceOf;

    //nest a mapping address 
    mapping(address => mapping(address=> uint256)) public allowance;

    //create a constructor to use to initialize the balance of sender to total supply
    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    //create a transfer function as well
    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balanceOf[msg.sender] >= _value, "balance not enough"); //we are setting balance of sender to be greater than the value that is amount we are sending
        balanceOf[msg.sender] -= _value; //we are decrementing the balance of sender by the value of money sent
        balanceOf[_to] += _value; // we are adding the amount we want to send to the balance of receiver

        emit Transfer(msg.sender, _to, _value); //initializing the Transfer event declared up there
        return true;
    }

    //create a function to approve transfer
    function approve(address _spender, uint256 _value) public returns (bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    //create a function that allows transfer of token from sender to receiver

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        require( _value <= balanceOf[_from] );
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

}
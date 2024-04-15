// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./interfaces/IBridgePool.sol";
import "./interfaces/IWETH.sol";
import "./BridgePool.sol";

contract BridgeRouter  is Ownable, AccessControl {
    using SafeERC20 for IERC20;
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    mapping (IERC20 => address) public bridgePools;
    address[] public allBridgePools;
    IERC20 public WETH;
    
    event CreatePool(address indexed token,address indexed poolAddr);
    event AddLiquidity(address indexed sender, address indexed token, uint256 amount);
    event RemoveLiquidity(address indexed sender, address indexed token, uint256 indexed liquidityId, uint256 amount);
    event Deposit(address indexed sender, address indexed token, uint256 amount);
    event Withdraw(address indexed user, address indexed token, uint256 amount);

    constructor(address _WETH) {
        WETH = IERC20(_WETH);
    }
    
    receive() external payable {}
    
    function createBridgePool(address _token) external onlyOwner {
        require(_token != address(0), 'BRIDGE: ZERO_ADDRESS');
        bytes memory bytecode = type(BridgePool).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(_token));
        address bridgePoolAddr;
        assembly {
            bridgePoolAddr := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IBridgePool(bridgePoolAddr).initialize(_token);
        bridgePools[IERC20(_token)] = bridgePoolAddr;
        allBridgePools.push(bridgePoolAddr);
        emit CreatePool(_token, bridgePoolAddr);
    }

    function addLiquidity(address _token, uint256 _amount) external payable {
        (address _bridgePool,bool _isNativeToken) = getBridgePool(_token);
        if (_isNativeToken) {
            require(msg.value == _amount, "BridgeRouter: Amount must be equal to msg.value");
            IWETH(address(WETH)).deposit{value: msg.value}();
        }
        IBridgePool(_bridgePool).addLiquidity(_amount);
        emit AddLiquidity(msg.sender, _token, _amount);
    }

    function removeLiquidity(address _token, uint256 _amount, uint256 _liquidityId) external {
        (address _bridgePool,bool _isNativeToken) = getBridgePool(_token);
        uint256 _amountReceived = IBridgePool(_bridgePool).removeLiquidity(_amount, _liquidityId);
        if (_isNativeToken) {
            IWETH(address(WETH)).withdraw(_amountReceived);
            (bool success, ) = payable(msg.sender).call{value: _amountReceived}("");
            require(success, "Failed to send Ether");
        } else {
            IERC20(_token).transfer(msg.sender, _amount);
        }     
        emit RemoveLiquidity(msg.sender, _token, _liquidityId, _amount);
    }

    function deposit(address _token, uint256 _amount) external payable {
        (address _bridgePool,bool _isNativeToken) = getBridgePool(_token);
        if (_isNativeToken) {
            require(msg.value == _amount, "BridgeRouter: Amount must be equal to msg.value");
            IWETH(address(WETH)).deposit{value: msg.value}();
        }
        IBridgePool(_bridgePool).deposit(_amount);
        emit Deposit(msg.sender, _token, _amount);
    }

    function withdraw(address _token, address _user, uint256 _amount) external onlyRole(ADMIN_ROLE) {
        (address _bridgePool,bool _isNativeToken) = getBridgePool(_token);
        IBridgePool(_bridgePool).withdraw(_amount);
        if (_isNativeToken) {
            IWETH(address(WETH)).withdraw(_amount);
            (bool success, ) = payable(_user).call{value: _amount}("");
            require(success, "BridgeRouter: Failed to send Ether");
        } else {
            IERC20(_token).transfer(_user, _amount);
        }
        emit Withdraw(_user, _token, _amount);
    }

    function grantRole(address _admin) external onlyOwner {
        _grantRole(ADMIN_ROLE, _admin);
    }

    function revokeRole(address _admin) external onlyOwner {
        _revokeRole(ADMIN_ROLE, _admin);
    }

    function getBridgePool(address _token) private view returns(address _bridgePool, bool _isNativeToken) {
        if (_token == address(0)) {
            _bridgePool = bridgePools[WETH];
            _isNativeToken = true;
        } else {
            _bridgePool = bridgePools[IERC20(_token)];
        }

        require(_bridgePool != address(0), "BridgeRouter: ZERO_BRIDGEPOOL_ADDRESS");
    }

    function getAmountTokenInPool(address _token) external view returns(uint256) {
        if (_token == address(0)) {
            _token = address(WETH);
        }
        address bridgePoolAddr = bridgePools[IERC20(_token)];
        return IERC20(_token).balanceOf(bridgePoolAddr);
    }

    function setRate(address _token, uint256[4] calldata _rewardRate) external onlyOwner {
        (address _bridgePool, ) = getBridgePool(_token);
        IBridgePool(_bridgePool).setRate(_rewardRate);
    }
}

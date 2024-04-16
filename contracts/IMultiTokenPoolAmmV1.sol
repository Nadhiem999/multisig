interface IMultiTokenPoolAmmV1 {
    function removeLiquidity(address tokenA, address tokenB, uint256 shares) external returns (uint256, uint256);
}
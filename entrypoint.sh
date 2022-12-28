#!/bin/sh

sed -i -e 's#"build": ".*"#"build": "'$BUILD'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"foldingRegistry": ".*"#"foldingRegistry": "'$FOLDING_REGISTRY'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"lendingPlatformLens": ".*"#"lendingPlatformLens": "'$PLATFORM_LENS'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"simplePositionLens": ".*"#"simplePositionLens": "'$POSITION_LENS'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"rewardsDistributor": ".*"#"rewardsDistributor": "'$REWARDS_DISTRIBUTOR'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"bscFoldingRegistry": ".*"#"bscFoldingRegistry": "'$BSC_FOLDING_REGISTRY'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"bscLendingPlatformLens": ".*"#"bscLendingPlatformLens": "'$BSC_PLATFORM_LENS'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"bscSimplePositionLens": ".*"#"bscSimplePositionLens": "'$BSC_POSITION_LENS'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"bscRewardsDistributor": ".*"#"bscRewardsDistributor": "'$BSC_REWARDS_DISTRIBUTOR'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"polygonFoldingRegistry": ".*"#"polygonFoldingRegistry": "'$POLYGON_FOLDING_REGISTRY'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"polygonLendingPlatformLens": ".*"#"polygonLendingPlatformLens": "'$POLYGON_PLATFORM_LENS'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"polygonSimplePositionLens": ".*"#"polygonSimplePositionLens": "'$POLYGON_POSITION_LENS'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"polygonRewardsDistributor": ".*"#"polygonRewardsDistributor": "'$POLYGON_REWARDS_DISTRIBUTOR'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"fodlStakingUsdc": ".*"#"fodlStakingUsdc": "'$FODL_STAKING_USDC'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"fodlStakingEth": ".*"#"fodlStakingEth": "'$FODL_STAKING_ETH'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"chainId": ".*"#"chainId": "'$CHAIN_ID'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"rpcUrl": ".*"#"rpcUrl": "'$RPC_URL'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"bscChainId": ".*"#"bscChainId": "'$BSC_CHAIN_ID'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"bscRpcUrl": ".*"#"bscRpcUrl": "'$BSC_RPC_URL'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"polygonChainId": ".*"#"polygonChainId": "'$POLYGON_CHAIN_ID'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"polygonRpcUrl": ".*"#"polygonRpcUrl": "'$POLYGON_RPC_URL'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"rewards": ".*"#"rewards": "'$REWARDS'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"singleSidedStaking": ".*"#"singleSidedStaking": "'$SINGLE_SIDED_STAKING'"#g' /usr/share/nginx/html/config.json
sed -i -e 's#"sltp": ".*"#"sltp": '$SLTP'#g' /usr/share/nginx/html/config.json
sed -i -e 's#"stopLoss": ".*"#"stopLoss": '$STOP_LOSS'#g' /usr/share/nginx/html/config.json

/docker-entrypoint.sh

nginx -g "daemon off;"

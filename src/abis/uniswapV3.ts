export const uniswapV3factoryAbi = `[
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint24",
          "name": "fee",
          "type": "uint24"
        },
        {
          "indexed": true,
          "internalType": "int24",
          "name": "tickSpacing",
          "type": "int24"
        }
      ],
      "name": "FeeAmountEnabled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "oldOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnerChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token0",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "token1",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint24",
          "name": "fee",
          "type": "uint24"
        },
        {
          "indexed": false,
          "internalType": "int24",
          "name": "tickSpacing",
          "type": "int24"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "pool",
          "type": "address"
        }
      ],
      "name": "PoolCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenA",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenB",
          "type": "address"
        },
        {
          "internalType": "uint24",
          "name": "fee",
          "type": "uint24"
        }
      ],
      "name": "createPool",
      "outputs": [
        {
          "internalType": "address",
          "name": "pool",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint24",
          "name": "fee",
          "type": "uint24"
        },
        {
          "internalType": "int24",
          "name": "tickSpacing",
          "type": "int24"
        }
      ],
      "name": "enableFeeAmount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint24",
          "name": "",
          "type": "uint24"
        }
      ],
      "name": "feeAmountTickSpacing",
      "outputs": [
        {
          "internalType": "int24",
          "name": "",
          "type": "int24"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint24",
          "name": "",
          "type": "uint24"
        }
      ],
      "name": "getPool",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "parameters",
      "outputs": [
        {
          "internalType": "address",
          "name": "factory",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "token0",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "token1",
          "type": "address"
        },
        {
          "internalType": "uint24",
          "name": "fee",
          "type": "uint24"
        },
        {
          "internalType": "int24",
          "name": "tickSpacing",
          "type": "int24"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "setOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]`;

export const uniswapV3quoterAbi = `[
  {
    "inputs":[
      {
        "internalType":"address",
        "name":"_factory",
        "type":"address"
      },
      {
        "internalType":"address",
        "name":"_WETH9",
        "type":"address"
      }
    ],
    "stateMutability":"nonpayable",
    "type":"constructor"
  },
  {
    "inputs":[
      
    ],
    "name":"WETH9",
    "outputs":[
      {
        "internalType":"address",
        "name":"",
        "type":"address"
      }
    ],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs":[
      
    ],
    "name":"factory",
    "outputs":[
      {
        "internalType":"address",
        "name":"",
        "type":"address"
      }
    ],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs":[
      {
        "internalType":"bytes",
        "name":"path",
        "type":"bytes"
      },
      {
        "internalType":"uint256",
        "name":"amountIn",
        "type":"uint256"
      }
    ],
    "name":"quoteExactInput",
    "outputs":[
      {
        "internalType":"uint256",
        "name":"amountOut",
        "type":"uint256"
      }
    ],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[
      {
        "internalType":"address",
        "name":"tokenIn",
        "type":"address"
      },
      {
        "internalType":"address",
        "name":"tokenOut",
        "type":"address"
      },
      {
        "internalType":"uint24",
        "name":"fee",
        "type":"uint24"
      },
      {
        "internalType":"uint256",
        "name":"amountIn",
        "type":"uint256"
      },
      {
        "internalType":"uint160",
        "name":"sqrtPriceLimitX96",
        "type":"uint160"
      }
    ],
    "name":"quoteExactInputSingle",
    "outputs":[
      {
        "internalType":"uint256",
        "name":"amountOut",
        "type":"uint256"
      }
    ],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[
      {
        "internalType":"bytes",
        "name":"path",
        "type":"bytes"
      },
      {
        "internalType":"uint256",
        "name":"amountOut",
        "type":"uint256"
      }
    ],
    "name":"quoteExactOutput",
    "outputs":[
      {
        "internalType":"uint256",
        "name":"amountIn",
        "type":"uint256"
      }
    ],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[
      {
        "internalType":"address",
        "name":"tokenIn",
        "type":"address"
      },
      {
        "internalType":"address",
        "name":"tokenOut",
        "type":"address"
      },
      {
        "internalType":"uint24",
        "name":"fee",
        "type":"uint24"
      },
      {
        "internalType":"uint256",
        "name":"amountOut",
        "type":"uint256"
      },
      {
        "internalType":"uint160",
        "name":"sqrtPriceLimitX96",
        "type":"uint160"
      }
    ],
    "name":"quoteExactOutputSingle",
    "outputs":[
      {
        "internalType":"uint256",
        "name":"amountIn",
        "type":"uint256"
      }
    ],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[
      {
        "internalType":"int256",
        "name":"amount0Delta",
        "type":"int256"
      },
      {
        "internalType":"int256",
        "name":"amount1Delta",
        "type":"int256"
      },
      {
        "internalType":"bytes",
        "name":"path",
        "type":"bytes"
      }
    ],
    "name":"uniswapV3SwapCallback",
    "outputs":[
      
    ],
    "stateMutability":"view",
    "type":"function"
  }
]`;

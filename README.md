# UTU Coin

This repository has the ERC20 token contract for UTU Coin. 

# Tests

Run tests:

```Bash
$ npx buidler test
```

Generate coverage report:

```Bash
$ npx buidler coverage --network coverage
```

## Tooling

```Bash
$ docker pull mythril/myth
$ docker pull trailofbits/eth-security-toolbox
$ npx buidler flatten > flattened.sol
$ docker run -it -v $PWD:/share trailofbits/eth-security-toolbox
```

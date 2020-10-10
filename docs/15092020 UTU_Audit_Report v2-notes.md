# Notes on 15092020 UTU_Audit_Report v2.pdf

Hacken noted 1 low severity issue:

> Checking for the length of arrays does not guarantee data consistency in constructor input parameters. It is recommended to use an array of data structures instead of two arrays.

We did not change this because we deemed the risk of the deployment script getting it wrong not really different either way — the deployment script could also construct the assignments wrongly when done in the suggested way.

We did add a test case for this however, and in any case the contract is now already deployed at https://etherscan.io/address/0xa58a4f5c4bb043d2cc1e170613b74e767c94189b , with the correct initial token assignments.
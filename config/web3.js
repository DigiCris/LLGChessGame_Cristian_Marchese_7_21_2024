const { web3, Wallet, contractAddress, contractABI } = require("../config/web3.config")
require('dotenv').config()

/**
 * Retrieves the Ether balance of the specified address.
 *
 * @param {string} address - The address to get the balance.
 * @returns {Promise<string>} - The balance in Ether.
 * @throws {Error} - If there's an error while fetching the balance.
 */
async function balanceOf(address) {
    try {
        const balance = await web3.eth.getBalance(address);
        const balanceInEther = web3.utils.fromWei(balance, 'ether');
        return balanceInEther;
    } catch (error) {
        throw error;
    }
}

/**
 * Retrieves the amount the spender can spend on behalf of the owner.
 *
 * @param {string} owner - The address of the token owner.
 * @param {string} spender - The address of the spender.
 * @returns {Promise<string>} - The allowance amount in Ether.
 * @throws {Error} - If there's an error while fetching the allowance.
 */
async function allowanceOf(owner, spender) {
    try {
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const allowance = await contract.methods.allowance(owner, spender).call();
        const allowanceInEther = web3.utils.fromWei(allowance, 'ether');
        return allowanceInEther;
    } catch (error) {
        throw error;
    }
}

/**
 * Approves the specified spender to spend the given value on behalf of the owner.
 *
 * @param {string} spender - The address of the spender.
 * @param {string} value - The amount to approve, expressed in Ether.
 * @param {string} password - The password used to unlock the owner's wallet.
 * @returns {Promise<Object>} - The transaction receipt.
 * @throws {Error} - If there's an error during the approval process.
 *
 * Note: The private key is generated using a deterministic wallet, where the seed is derived from the
 * APP_SEED environment variable and the user's password. This ensures that the server cannot
 * generate the private key and steal the funds, and the user cannot use the private key outside
 * of the application.
 */
async function approve(spender, value, password) {
    try {
        // Creating wallet with the APP_SEED and user password sent by them in the ost
        Wallet.deterministicWallet(password, process.env.APP_SEED);
        const owner = Wallet.account.address;
        const privateKey = Wallet.account.privateKey;

        // Creating contract instance
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        // Convertir el valor a Wei
        const valueInWei = web3.utils.toWei(value.toString(), 'ether');

        // Creating the ABI codification to call the function with the spender a value parameters
        const txData = contract.methods.approve(spender, valueInWei).encodeABI();

        // creating the transaction
        const txParams = {
            to: contractAddress,
            data: txData,
            from: owner,
            gas: await contract.methods.approve(spender, valueInWei).estimateGas({ from: owner }),
            gasPrice: await web3.eth.getGasPrice()
        };

        // Signing transaction with privateKey
        const signedTx = await web3.eth.accounts.signTransaction(txParams, privateKey);

        // Sending transaction to the RPC
        const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log(`Approved ${value} for spender ${spender} and owner ${owner}`);
        return txReceipt;
    } catch (error) {
        throw error;
    }
}

/**
 * Checks if the provided Ethereum address is valid.
 *
 * @param {string} address - Address to validate.
 * @returns {boolean} - `true` if the address is valid, `false` otherwise.
 */
function isValidAddress(address) {
    return address.length === 42 && address.startsWith('0x');
}

/**
 * Checks if the value is a positive number.
 *
 * @param {any} value - The value to validate.
 * @returns {boolean} - `true` if it is a positive number, `false` otherwise.
 */
function isValidValue(value) {
    return typeof value === 'number' && value > 0 ;
}

module.exports = {
approve,
allowanceOf,
balanceOf,
isValidAddress,
isValidValue,
};
//helpers.js
export function validateEthAddress(address) {
    const AddressRegEx = /^0x[a-fA-F0-9]{40}$/
    return AddressRegEx.test(address)
}

export function createNonceGenerator(startValue) {
    let counter = startValue
    function generateNonce() {
        return ++counter
    }
    return generateNonce
}

export function validateAmountETH() {
    //const AmountRegEx = /^(0|\d)\.()?$/
}
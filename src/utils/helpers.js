//helpers.js
export function validateEthAddress(address) {
    const AddressRegEx = /^0x[a-fA-F0-9]{40}$/
    return AddressRegEx.test(address)
}
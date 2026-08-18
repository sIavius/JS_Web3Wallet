//errors.js

export class InsufficientFundsError extends Error {
    constructor(message, amount, balance) {
        super(message)
        this.name = this.constructor.name
        this.amount = amount
        this.balance = balance
    }
}

export class InvalidAmountError extends Error {
    constructor(message, amount, balance) {
        super(message)
        this.name = this.constructor.name
        this.amount = amount
        this.balance = balance
    }
}

export class InvalidAddressError extends Error {
    constructor(message, address) {
        super(message)
        this.name = this.constructor.name
        this.address = address
    }
}

export class ApiNetworkError extends Error {
    constructor(message, statusText, statusCode) {
    super(message)
    this.name = this.constructor.name
    this.statusText = statusText
    this.statusCode = statusCode
    }
}
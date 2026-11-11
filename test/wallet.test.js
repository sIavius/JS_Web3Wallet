import assert from "node:assert/strict";
import test from "node:test";
import { Wallet } from "../src/core/wallet.js";
import {
    InsufficientFundsError,
    InvalidAddressError,
    InvalidAmountError,
} from "../src/utils/errors.js";

const owner = "0x1111111111111111111111111111111111111111";
const recipient = "0x2222222222222222222222222222222222222222";

test("records a deposit and a payment with distinct IDs and the recipient", () => {
    const wallet = new Wallet(owner);
    const deposit = wallet.deposit(10, "Ethereum");
    const payment = wallet.pay(3, "ethereum", recipient);

    assert.equal(wallet.maskedAddress, "0x1111...1111");
    assert.equal(wallet.getTokenBalance("ETHEREUM"), 7);
    assert.equal(wallet.getTokenBalance("bitcoin"), 0);
    assert.equal(wallet.addressBookSize, 1);
    assert.notEqual(deposit.id, payment.id);
    assert.equal(payment.address, recipient);
    assert.equal(wallet.findTransactionById(deposit.id), deposit);
    assert.equal(wallet.findTransactionById(payment.id), payment);
    assert.equal(wallet.findTransactionById(999), undefined);
    assert.deepEqual(wallet.spendings, [payment]);
    assert.deepEqual(wallet.totalVolume, { ethereum: 13 });
});

test("rejected payments leave the balance, address book, and history unchanged", () => {
    const wallet = new Wallet(owner);
    const deposit = wallet.deposit(10, "ethereum");

    assert.throws(() => wallet.pay(11, "ethereum", recipient), InsufficientFundsError);
    assert.throws(() => wallet.pay(1, "ethereum", "not an address"), InvalidAddressError);
    for (const amount of [0, -1, NaN, Infinity, "1", 1n]) {
        assert.throws(() => wallet.pay(amount, "ethereum", recipient), InvalidAmountError);
        assert.throws(() => wallet.deposit(amount, "ethereum"), InvalidAmountError);
    }

    assert.equal(wallet.getTokenBalance("ethereum"), 10);
    assert.equal(wallet.addressBookSize, 0);
    assert.deepEqual([...wallet.getTransactionChunks(2)], [[deposit]]);
});

test("paginates in insertion order and rejects invalid chunk sizes", () => {
    const wallet = new Wallet(owner);
    const first = wallet.deposit(10, "ethereum");
    const second = wallet.deposit(4, "bitcoin");
    const third = wallet.pay(1, "ethereum", recipient);

    assert.deepEqual([...wallet.getTransactionChunks(2)], [[first, second], [third]]);
    for (const size of [0, -1, 1.5, NaN, Infinity]) {
        assert.throws(() => wallet.getTransactionChunks(size).next(), RangeError);
    }
});

test("values a balance using the injected price client", async () => {
    const wallet = new Wallet(owner, {
        async fetchRates(coinId) {
            assert.equal(coinId, "ethereum");
            return { ethereum: { usd: 2500 } };
        },
    });

    wallet.deposit(2, "ethereum");
    assert.equal(await wallet.getTokenValue("Ethereum"), 5000);
});

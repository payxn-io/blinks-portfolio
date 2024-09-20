This is a Solana QR and NFC Tap example app.

### Getting Started

First, clone repo & run the development server:

```bash
git clone https://github.com/payxn-io/sol-pay-app.git
npm run dev
```

### Payxn Solana Pay: Example URLs
Sending 0.69 SOL:
```bash
solana:Ckg9D8BZmeze7Ka19fYJG3pyFGiAgiYSnQGToNbdRz8r?amount=0.69&label=Amazon&message=Thanks%20for%20shopping%20at%20Amazon&memo=ID321
```
Sending 4.20 USDC:
```bash
solana:Ckg9D8BZmeze7Ka19fYJG3pyFGiAgiYSnQGToNbdRz8r?amount=4.20&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

### Parameters
- [x] Recipient: This is the public key of the person you're sending SOL to. For SPL token transfers, specify the token type in the spl-token field, so the wallet can determine the correct account for the transfer.<br><br>

- [x] Amount: The number of SOL or tokens you're sending. If it's less than 1, make sure to include a 0 before the decimal. If the amount is missing, the wallet will prompt you to enter it. When transferring SOL, this value reflects SOL, not lamports.

- [x] SPL Token: An optional field that represents the mint address of a specific SPL Token account. If left out, the transaction will default to a regular SOL transfer.

- [x] Reference: A unique identifier within the transaction, used to locate specific transactions and verify results.

- [x] Label: A brief description of the transfer’s origin, such as a store or an app, displayed by the wallet to inform the user.

- [x] Message: An encoded URL containing details on the reason for the transfer, such as an order ID or a note. Wallets use this to provide context to the user.

- [x] Memo: A note that accompanies the payment transaction, but it shouldn’t contain any private or sensitive information since it’s recorded on-chain.

These fields ensure you have full control over your transaction, facilitating smooth interaction between your wallet and the recipient. For security, apps should only consider the transaction complete after it’s confirmed on-chain.


const SHA256 = require('crypto-js/sha256')


class Transaction
{
    constructor(fromAddress, toAddress, amount)
    {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block
{
    constructor(timestamp, transactions, previousHash = '')
    {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nounce = 0;
    }

    calculateHash()
    {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nounce).toString();
    }

    mineBlock(difficulty)
    {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0"))
        {
            this.hash = this.calculateHash();
            this.nounce++;
        }

        console.log("Block mined: "+ this.hash);
    }
}


class Blockchain
{
    constructor()
    {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock()
    {
        return new Block("6/22/2018", "Genesis Block", "0");
    }

    getLatestBlock()
    {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress)
    {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block mined successfully!");

        this.chain.push(block);

        this.pendingTransactions = [

            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction)
    {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address)
    {
        let balance = 0;

        for(const block of this.chain)
        {
            for(const trans of block.transactions)
            {
                if(trans.fromAddress === address)
                {
                    balance  -= trans.amount;
                }

                if(trans.toAddress === address)
                {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }


    isChainValid()
    {
        for(let count = 1; count < this.chain.length; count++)
        {
            const currentBlock = this.chain[count];
            const previousBlock = this.chain[count - 1];


            if(currentBlock.hash !== currentBlock.calculateHash())
            {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash)
            {
                return false;
            }
        }

        return true;
    }
}


let automata = new Blockchain();

automata.createTransaction(new Transaction('address1', 'address2', 100));
automata.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
automata.minePendingTransactions('ak-address');

console.log('Balance of Ak wallet is: ', automata.getBalanceOfAddress('ak-address'));

console.log('\n Starting the miner again...');
automata.minePendingTransactions('ak-address');

console.log('Balance of Ak wallet is: ', automata.getBalanceOfAddress('ak-address'));

console.log('\n Starting the miner again...');
automata.minePendingTransactions('ak-address');

console.log('Balance of Ak wallet is: ', automata.getBalanceOfAddress('ak-address'));
console.log('Balance of address1 wallet is: ', automata.getBalanceOfAddress('address1'));
console.log('Balance of address2 wallet is: ', automata.getBalanceOfAddress('address2'));

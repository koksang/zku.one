# zku.ONE Background Assignment
## Introduction
This writeup is made fully according to the [assignment](https://zku.one/e95f96225dcc4180bd22b40807437664)

## A. Conceptual Knowledge
1. Smart contract is a ***code program that gets executed automatically when evaluated to True***. It is commonly viewed as a set of self-executing instructions without 3rd party intermediaries involved.
	
    **Prerequisite for deployment:**
    - Code compiler and hasher
    - Some tokens for gas fees
    - Deployment script
    - Node access to mainnet
    
    **To deploy:**
    - Setup mainnet node access
    - Install tools
    - Test your smart contract, ideally in testnet
    - Connect to wallet, and some tokens for deployment using using tools
    - Verify your smart contract using tracker app


2. Gas is a ***unit of computational measure***, normally involved in transactions such as executing smart contracts. 

    **It is important to keep it optimized because**
    - Reduced gas fees leads to
        - More affordable transactions
        - More adoption
    - More efficient transactions leads to
        - Simplicity of transactions, hence more scalable
        - Lower number of transactions, hence less prone to malicious attacks and more secured

3. Hash is a ***unique fixed length of bits*** and it is the output of a hashing algorithm (a function that helps to map data of arbitrary size to an unique output of fixed-size values). 

    People use it to hide information because it is a ***one-way process***, we cannot retrieve the hidden information with just the hash digest. Technically, it is possible but it will require the hash function and heavy brute force computation to solve it for all possibilities which is still impossible with the compute power we have as of today.

4. One easy way to approach this is, I will close my eyes and ask the person to do any swaps in any ways he/she likes. Then, I will open up my eyes and tell what colors are the objects.


## B. You sure you’re solid with Solidity?
1. Refer to [HelloWorld.sol](./HelloWorld.sol)
    ![screenshot](/images/background__b1.png)
2. The contract creates a ballot voting process
    1. It declares variables:
        1. Voter
            - weight - delegation accumulated
            - voted - if has voted
            - delegate - address to delegate to
            - vote - index of voted proposal
        2. Proposal
            - name - proposal name in bytes
            - voteCount - total votes count
        3. chairperson - chairperson address
        4. Voters - mapped each address to a Voter
        5. proposals - array/ list of Proposal
    2. It has functions:
        1. giveRightToVote - It grants voter right to vote based on few conditions:
            - Granter is chairperson
            - Voter has not voted before
            - Voter has 0 weight
        2. delegate - It helps to delegate vote to address
            - It first checks for conditions:
            - Sender address has not voted
            - Sender is not the same with delegate address
            - Then, it makes sure the delegate is a valid address (with known private key)
            - It sets sender delegate address, sender’s voted to True, and checks if delegate has voted.
            - If delegate has voted, it adds delegate voted proposal’s count by sender’s weight, else it add delegate weight by sender’s weight
        3. vote - Cast vote to proposal
            - It first checks for:
                - If sender has non-zero weight (0 indicates no right to vote)
                - If sender has voted
            - Then it sets sender’s vote to True and sender’s vote address to proposal address
            - Finally, it adds proposal cumulative vote count by sender’s weight
        4. winningProposal - Calculates proposal with most votes
            - It starts with a minimum usually 0 in winningVoteCount (can see this as maximum vote count from the pool of proposals)
            - It then loops through all proposals, get the vote count of it and update the variable winningVoteCount if the proposal vote count is higher than winningVoteCount.
            - After the loop, it returns winning proposal address with the most vote count.
        5. winnerName - Retrieve winning proposal name
            - It executes function winningProposal, then retrieve the winning proposal name
3. Refer to [BallotAmended.sol](./BallotAmended.sol)
4. Refer to the screenshot below
    ![screenshot](/images/background__b3.png)

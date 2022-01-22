# IoTLoRaPlatform

Prototyping a data platform to support IoT devices via LoRaWAN. Since in future energy production can happen anywhere not centralized it's useful to have a system which supports decentralized energy production and allows
to use this energy for a network of distributed consumers. There are many solutions already in place but mostly focused on bigger energy production sites. My idea is to make a similar low cost system for small production sites
and allow those owners to share their energy over an already existing grid infrastructure.
The grid owner will be able to distinguish which system produced how much energy and can trade this value on the grid.

# Goals / steps

1. Writing / receiving information from the tangle via message payloads : done
2. Store information via messageId for later retrieval : partially done (simple file solution, could be extended as db)
3. Calculate approximated energy value based on energy production : done
4. Write energy production earnings back to IOTA, referenced by source messageId energy production record : done
5. Signed transaction
6. Send earnings as IOTA token to wallet
7. Get Wallet data
8. Setup / configuration simplification
9. Deployment as IoT Device

# Contribution

Any feedback is appreciated. Just branch and update the code.

# Keywords

solar, energy production, IOTA, decentralied energy, small energy prodction site

# Design Idea
![System Overview](https://github.com/pheeling/IoTLoRaPlatform/blob/master/images/System%20Overview.png "System Overview")



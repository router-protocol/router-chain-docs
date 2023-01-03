# CrossTalkUtils Library
To make it easy to integrate Router CrossTalk in your contracts, we have created a CrossTalkUtils plug-and-play library. It gives you the following functionalities:

1.  Sending a single payload to a contract on the destination chain without an acknowledgement.
2.  Sending a single payload to a contract on the destination chain while also handling an acknowledgement on the source chain.
3.  Sending multiple payloads to different contracts on the destination chain without an acknowledgement.
4.  Sending multiple payloads to different contracts on the destination chain while also handling an acknowledgement on the source chain.
5.  Functions to convert type address to type bytes and vice-versa.
6.  If your calls were atomic, either all the calls will execute or none will execute on the destination chain. In this case, when you receive the acknowledgement, you can use a function (**`getTxStatusForAtomicCall`**) in the library to know whether the calls were executed on the destination chain. If, in case, your calls were not successful, you can call a function (**`getTheIndexOfCallFailure`**) in the library to know the index of call which failed on the destination chain.
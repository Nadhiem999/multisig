import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Put the address of your AA factory
const AA_FACTORY_ADDRESS = "0x0697F2836452F540BF81c65245bfe2fBA19BAF38"; //sepolia

export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider("https://sepolia.era.zksync.dev");
  // Private key of the account used to deploy
  const wallet = new Wallet("WALLET_PRIVATE_KEY").connect(provider);

  const factoryArtifact = await hre.artifacts.readArtifact("AAFactory");

  const aaFactory = new ethers.Contract(AA_FACTORY_ADDRESS, factoryArtifact.abi, wallet);

  // The two owners of the multisig
  // // The two owners of the multisig
  const owner1 = Wallet.createRandom();
//   
  const owner2 = Wallet.createRandom();
  // For the simplicity of the tutorial, we will use zero hash as salt
  const salt = ethers.ZeroHash;

  // deploy account owned by owner1 & owner2
  const tx = await aaFactory.deployAccount(salt, owner1.address, owner2.address);
  await tx.wait();

  // Getting the address of the deployed contract account
  
  const abiCoder = new ethers.AbiCoder();
  
  const multisigAddress = utils.create2Address(
    AA_FACTORY_ADDRESS,
    await aaFactory.aaBytecodeHash(),
    salt,
    abiCoder.encode(["address", "address"], [owner1.address, owner2.address])
  );
  console.log(`Multisig account deployed on address ${multisigAddress}`);

  console.log("Sending funds to multisig account");
  // Send funds to the multisig account we just deployed
  await (
    await wallet.sendTransaction({
      to: multisigAddress,
      // You can increase the amount of ETH sent to the multisig
      value: ethers.parseEther("0.008"),
      nonce: await wallet.getNonce(),
    })
  ).wait();

  let multisigBalance = await provider.getBalance(multisigAddress);

  console.log(`Multisig account balance is ${multisigBalance.toString()}`);
  await (
    await wallet.sendTransaction({
      to: multisigAddress,
      // You can increase the amount of ETH sent to the multisig
      value: ethers.parseEther("0.008"),
      nonce: await wallet.getNonce(),
    })
  ).wait();
//   let aaTx = await aaFactory.deployAccount.populateTransaction(
//     salt,
//     // These are accounts that will own the newly deployed account
//     Wallet.createRandom().address,
//     Wallet.createRandom().address
//   );

//   const gasLimit = await provider.estimateGas({ ...aaTx, from: wallet.address });
//   const gasPrice = await provider.getGasPrice();

//   aaTx = {
//     ...aaTx,
//     // deploy a new account using the multisig
//     from: multisigAddress,
//     gasLimit: gasLimit,
//     gasPrice: gasPrice,
//     chainId: (await provider.getNetwork()).chainId,
//     nonce: await provider.getTransactionCount(multisigAddress),
//     type: 113,
//     customData: {
//       gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
//     } as types.Eip712Meta,
//     value: 0n,
//   };
 

//   const signedTxHash = EIP712Signer.getSignedDigest(aaTx);
// console.log(signedTxHash)
//   // Sign the transaction with both owners
//   const signature = ethers.concat([ethers.Signature.from(owner1.signingKey.sign(signedTxHash)).serialized, ethers.Signature.from(owner2.signingKey.sign(signedTxHash)).serialized]);
//  console.log(signature)
//   aaTx.customData = {
//     ...aaTx.customData,
//     customSignature: signature,
//   };
//   console.log(signature)
//   console.log(aaTx)
  
//   console.log(`The multisig's nonce before the first tx is ${await provider.getTransactionCount(multisigAddress)}`);

//   const sentTx = await provider.broadcastTransaction(types.Transaction.from(aaTx).serialized);
//   console.log(`Transaction sent from multisig with hash ${sentTx.hash}`);

//   await sentTx.wait();

//   // Checking that the nonce for the account has increased
//   console.log(`The multisig's nonce after the first tx is ${await provider.getTransactionCount(multisigAddress)}`);

//   multisigBalance = await provider.getBalance(multisigAddress);

//   console.log(`Multisig account balance is now ${multisigBalance.toString()}`);

const tokenAAddress = "0xeeca81E0B533025d0De99D49557e0b9B1D2129C3";
const tokenBAddress = "0xb315D023589Cd506885339FB89A8CC808a803e95";
// const amountA = ethers.parseEther("0.008"); // Example amount
// const amountB = ethers.parseEther("0.008"); // Example amount
const ammArtifact = await hre.artifacts.readArtifact("MultiTokenPoolAmmV1");
const ammContract = new ethers.Contract("0x2976aA9B7334E65d754B1D88064d0bD4B5F7a456", ammArtifact.abi, wallet);
  let aaTx = await ammContract.getPoolId.populateTransaction(tokenAAddress, tokenBAddress);//amountA, amountB
 console.log(aaTx)
  const gasLimit = await provider.estimateGas({ ...aaTx, from: multisigAddress });
 //const gasLimit= await provider.estimateGas(aaTx);
 // console.log(gasLimit)
  const gasPrice = await provider.getGasPrice();

  aaTx = {
    ...aaTx,
    from: multisigAddress,
    gasLimit: gasLimit,
    gasPrice: gasPrice,
    chainId: (await provider.getNetwork()).chainId,
    nonce: await provider.getTransactionCount(multisigAddress),
    type: 113,
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    } as types.Eip712Meta,
    value: 0n,
  };

  const signedTxHash = EIP712Signer.getSignedDigest(aaTx);

  // Sign the transaction with both owners
  const signature = ethers.concat([ethers.Signature.from(owner1.signingKey.sign(signedTxHash)).serialized, ethers.Signature.from(owner2.signingKey.sign(signedTxHash)).serialized]);

  aaTx.customData = {
    ...aaTx.customData,
    customSignature: signature,
  };
//   const isValidSignature = await aaTx.isValidSignature(signedTxHash, signature)
//     if (isValidSignature == EIP1271_MAGIC_BYTES) {
//         console.info(chalk.green(`Signaure is Valid in MultiSigAccount!`))
//     } else {
//         throw new Error(`Signature is not valid in MultiSigAccount!`)
//     }


  //aaTx.customData.customSignature = signature;
  const sentTx = await provider.broadcastTransaction(types.Transaction.from(aaTx).serialized);
  console.log(`Transaction sent from multisig with hash ${sentTx.hash}`);

 
//   const sentTx = await provider.broadcastTransaction(types.Transaction.from(aaTx).serialized);
//   console.log(`Transaction sent from multisig with hash ${sentTx.hash}`);
  await sentTx.wait();

  console.log(`The multisig's nonce after the first tx is ${await provider.getTransactionCount(multisigAddress)}`);

  



}
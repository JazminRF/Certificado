# Certificado
Permite mediante ICP y Typescript el registro de certificados para alumnos/personas que toman cursos

Welcome to your first Azle project! This example project will help you to deploy your first canister (application) to the Internet Computer (IC) decentralized cloud. It is a simple getter/setter canister. You can always refer to [The Azle Book](https://demergent-labs.github.io/azle/) for more in-depth documentation.

`dfx` is the tool you will use to interact with the IC locally and on mainnet. If you don't already have it installed:

```bash
npm run dfx_install
```

Next you will want to start a replica, which is a local instance of the IC that you can deploy your canisters to:

```bash
npm run certificado
```
Local deployment
Let's deploy to our local replica.

First startup the replica:

```bash
dfx start --background
```
Then deploy the canister:
```bash
dfx deploy
```
Now you can deploy your canister locally:

```bash
npm install
npm run certificado
```

To call the methods on your canister:

```bash
dfx canister call certificado leerCertificados
```



Assuming you have [created a cycles wallet](https://internetcomputer.org/docs/current/developer-docs/quickstart/network-quickstart) and funded it with cycles, you can deploy to mainnet like this:

```bash
npm run canister_deploy_mainnet
```

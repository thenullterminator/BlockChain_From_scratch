import * as  bodyParser from 'body-parser';
import express, { Request, Response } from "express";

import {Block, generateNextBlock, getBlockchain} from './block_chain';
import {connectToPeers, getSockets, initP2PServer} from './p2p';

const httpPort: number = parseInt(process.argv[2]) || 3001;
const p2pPort: number = parseInt(process.argv[3]) || 6001;

const app = express();

app.use(bodyParser.json());

app.get('/blocks', (req:Request, res:Response) => {

    res.send(getBlockchain());
});

app.post('/mineBlock', (req:Request, res:Response) => {

    const newBlock: Block = generateNextBlock(req.body.data);
    res.send(newBlock);
});

app.get('/peers', (req:Request, res:Response) => {

    // console.log(getSockets().map((s: any) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    res.send(getSockets().map((s: any) => s._socket.remoteAddress + ':' + s._socket.remotePort));
});

app.post('/addPeer', (req:Request, res:Response) => {

    connectToPeers(req.body.peer);
    res.send();
});

app.listen(httpPort, () => {
    console.log('Listening http on port: ' + httpPort);
});

initP2PServer(p2pPort);
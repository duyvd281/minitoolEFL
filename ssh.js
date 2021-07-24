const { checkPrime } = require('crypto');
const fs = require('fs');
const { resolve } = require('path');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
const { Client } = require('ssh2');

const connection = new Client();

var timeout = 1000

const config = {
    host: '172.23.53.60',
    user: 'root',
    password: 'JH501x99',
//  privateKey: fs.readFile('key'),
//  passphrase: fs.readFile( 'pasp ')
  }

async function run(){
    try{
        const conn = await connecting().then(resolve => {console.log(resolve)},reject=> {throw reject})
        await connection.exec('cat /sys/class/net/eth0/address', function(err, stream){
            if (err) {
                throw err
            }
                stream.on('data', (data) => {
                console.log("MAC: "+data.toString());
            });
        })
        await check().then(resolve => {
            console.log(resolve)
            }, reject => {
            throw reject
        })

        await runcmd('service mosquitto start').then(resolve => console.log(resolve),reject => { throw reject})
        await runcmd('service mosquitto stop').then(resolve => console.log(resolve),reject => { throw reject})
        await runcmd('service mosquitto status').then(resolve => console.log(resolve),reject => { throw reject})
    }
    catch(Error){
        console.log(Error)
    }
  }

function connecting(){
    return new Promise((resolve,reject)=>{
        connection.connect(config)
        connection.on('error',function(err){
            reject(err)
        })
        connection.on('ready',()=>{
            resolve('Connected')
        })
    })
}
function check(){
    return new Promise((resolve,reject) => {
        readline.question("Type 'Confirm' to confirm this MAC is correct:\n", flag => {
            if ( flag == 'confirm' || flag == 'Confirm' ) {resolve("Confirm Deivce Correct")}
            else reject('Incorrect Device\n');
        })
        })
    }
function runcmd(cmd){
    return new Promise((resolve,reject)=>{
        connection.exec(cmd,function(err,stream){
            if(err){
                reject(err)
            }
            stream.on('data',data => {
                setTimeout(() => {
                    resolve(data.toString())
                }, timeout); 
            })
        })
    })
}
function checkstatus(cmd){
    return new Promise((resolve,reject)=>{
        connection.exec(cmd,function(err,stream){
            if(err){
                reject(err)
            }
            stream.on('data',data => {
                resolve(data.toString())
            })
        })
    })
}

run()
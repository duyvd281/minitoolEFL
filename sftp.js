const { checkPrime } = require('crypto');
const fs = require('fs');
const { resolve } = require('path');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
const { Client } = require('ssh2');
const { setFlagsFromString } = require('v8');
const { runInContext } = require('vm');

const connection = new Client();

const timeout = 1000
const config = {
    host: ip,
    user: 'root',
    password: 'JH501x99',
    // to use with EFL-HC, copy change 'key' by ssh-key path and 
//  privateKey: fs.readFile('key'),
//  passphrase: fs.readFile('pasphr')
  }

function connecting(){
    return new Promise((resolve,reject)=>{
        readline.question('Enter IP:',ip => {
            connection.connect(config)
        })
        
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

function getFile(){
    return new Promise((resolve,reject) => {
        readline.question("Enter localtion of file",locat => {
            connection.sftp(function(err,sftp){
                if(error){
                    reject(error)
                }else console.log("STFP on \n")
                sftp.fastGet(locat,'test/file',function(err){
                    if(err){
                        reject(err)
                    }
                    else resolve("Get file success, file located in 'test' folder")
                })

            })
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

function run(){
    try
    {
    connecting().then(resolve => {console.log(resolve)
        runcmd('cat /sys/class/net/eth0/address').then(resolve => {console.log(resolve)
            check().then(resolve => {console.log(resolve)
                getFile().then(resolve => console.log(resolve)
                ,reject => {throw reject})
            },reject => {throw reject})
        },reject => {throw reject})
    },reject => {throw reject})
    }
    catch(error){
        console.log(error)
    } 
}
run()
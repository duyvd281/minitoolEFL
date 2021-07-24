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
var ip
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
function checkstatus(sername){
    return new Promise((resolve,reject)=>{
        let command = 'service '.concat(sername,' status')
        connection.exec(command,function(err,stream){
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



async function run(){
    try{
        await connecting().then(resolve => {console.log(resolve)},reject=> {throw reject})
        await runcmd('cat /sys/class/net/eth0/address').then(resolve => console.log(resolve),reject => { throw reject})
        /*await connection.exec('cat /sys/class/net/eth0/address', function(err, stream){
            if (err) {
                throw err
            }
                stream.on('data', (data) => {
                console.log("MAC: "+data.toString());
            });
        })*/
        await check().then(resolve => {
            console.log(resolve)
            }, reject => {
            throw reject
        })
//test on wsl 
        await runcmd('service mosquitto start').then(resolve => console.log(resolve),reject => { throw reject})
        await checkstatus('mosquitto').then(resolve => console.log(resolve),reject => { throw reject})
        await runcmd('service mosquitto stop').then(resolve => console.log(resolve),reject => { throw reject})
        await setInterval(function(){
            checkstatus('mosquitto').then(resolve => console.log(resolve),reject => { throw reject})
        },2*1000)
/*//EFL-HC
        await runcmd('systemctl stop process-manager').then(resolve => console.log(resolve),reject => { throw reject})
        await runcmd('systemctl stop hcg1').then(resolve => console.log(resolve),reject => { throw reject})
        await checkstatus('process-manager').then(resolve => console.log(resolve),reject => { throw reject})
        await checkstatus('hcg1').then(resolve => console.log(resolve),reject => { throw reject})
        await runcmd('rm /data/smarthome/hcg1-efl/newhc.db').then(resolve => console.log(resolve),reject => { throw reject})
        await runcmd('rm /tmp/hc/newhc.db').then(resolve => console.log(resolve),reject => { throw reject})
        await setInterval(function(){
            checkstatus('systemctl restart hcg1').then(resolve => console.log(resolve),reject => { throw reject})
        },10*60000)
*/
    }
    catch(Error){
        console.log(Error)
    }
  }



run()
var exec = require('node-ssh-exec')
var fs = require('fs')
var readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
var ip
var options = {
    host: ip,
    username: 'root',
    password: 'JH501x99'
    //privateKey: fs.readFile('id_rsa'),
    //passphrase: 'efl@274'
}
var mac
async function runexec(){

try{
    await exec(options,'cat /sys/class/net/eth0/address',function(err,response){
        if (err){
          throw 'fail in step 1'
        }
        mac = response,
        console.log("Mac of HC is: " + mac)
    })
    
}
catch(error){
    console.log(error)
}
}
readline.question('Enter IP:',ip => {
    runexec()
    readline.close()
})

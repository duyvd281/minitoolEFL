const  scp  = require('node-scp')

//var scp = new node_scp
var remote_server = {
  host: '172.29.75.144', //remote host ip 
  port: 22, //port used for scp 
  username: 'root', //username to authenticate
  password: 'JH501x99', //password to authenticate

  // privateKey: fs.readFileSync('./key.pem'),
  // passphrase: 'your key passphrase', 
}
var local_file_path = './scptest/2.txt';
var detination_file_path = '/mnt/d/minitoolEFL/test/20.txt';

function download_file_using_promise(file_path, destination_path){
    scp.Client(remote_server)
    .then(client => {
        client.downloadFile(file_path, destination_path)
              .then(response => {
                client.close()
              })
              .catch(error => {})
      })
    .catch(e => console.log(e))
}

download_file_using_promise(detination_file_path, local_file_path);
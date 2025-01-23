const socket = require('socket.io-client')
const readline = require('readline')
const chalk = require('chalk').default
// const customChalk = new chalk({level: 2});

const rl = readline.createInterface(process.stdin, process.stdout)

const webSocket = socket.io('http://localhost:8080')



let userInput = ''



webSocket.on('connect', ()=>{
    console.log(chalk.green.underline('Connected to server!'))
    


    webSocket.on('msg', (data)=>{
        // console.log(chalk.blue(data))
        const parsedData = JSON.parse(data)
        rl.write(parsedData.data)
    })


    webSocket.on('data', (data) => {
        const parsedData = JSON.parse(data);
        if (parsedData.type === 'update'){
            rl.write(parsedData.data);
        }
    })


    // Sending the data by clicking enter or going to a new line
    // rl.on('line', (input) => {
    //   const message = {
    //     type: 'update',
    //     data: input
    //   }
      
    //   webSocket.send(JSON.stringify(message))
    // })



    // This section didn't work correctly so dumped it 

    // rl.on('keypress', (str, key) => {
    //     const message = {
    //       type: 'update',
    //       data: str
    //     }
    //     webSocket.send(JSON.stringify(message))
    // })
    

    // yeh stackoverflow ke through kara 
    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
          process.exit()
        }

        else{
            const message = {
                type: 'update',
                data: str
            }
            webSocket.send(JSON.stringify(message))
        }
    });

   

})  
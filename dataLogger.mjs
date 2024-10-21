import readline from 'readline'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
 
function askQuestion(question){
    return new Promise(resolve => {
        rl.question(question, answer=>{
            resolve(answer)
        })
    })
}

async function main() {
    try{
        const name = await askQuestion("jak masz na imie: ")
        const surname = await askQuestion("jak masz na nazwisko: ")
        


        console.log(`Witaj ${name } ${surname} milo mi cie poznac`)
        const age = await askQuestion("ile masz lat: ")
        console.log(`masz ${age} lat`)

    }catch(err){
        console.error(err)
    }finally{
        rl.close()
    }
    
}

main()
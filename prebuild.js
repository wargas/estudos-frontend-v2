const fs = require('fs/promises')

async function main() {
    fs.writeFile('version.json', JSON.stringify({version: 'testando'}))
}

main()
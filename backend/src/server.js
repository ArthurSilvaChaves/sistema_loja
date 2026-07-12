const app = require("./app")

const PORT = 3000

app.listen(PORT, ()=> {
    console.log(`rodando em http://localhost:${PORT}`)
})
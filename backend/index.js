const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())
// app.use(morgan('tiny'))
// 使用morgon打印出post请求的发送数据
morgan.token('postData', function (req, res) {
    if (req.method == 'POST') {
        return JSON.stringify(req.body);
    }

});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))



let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
//  查询资源
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id == id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// 删除资源
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id != id)
    response.json({success:`delete ${id} success`})
})
// 新增资源
app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    let isRepeat = false
    persons.forEach(person => {
        if (person.name == body.name) {
            isRepeat = true
        }
    })
    if (isRepeat) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})
// 递增id
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
    return maxId + 1
}

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)


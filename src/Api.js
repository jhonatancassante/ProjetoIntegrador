import react from 'react'
import axios from 'axios'

export default axios.create({
    baseURL: 'https://c4c4uiddr5.execute-api.sa-east-1.amazonaws.com',
})

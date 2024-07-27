import express from 'express';
export const router = express.Router();
// const cors= require('cors');
import cors from 'cors';


const corsSettings = {
origin:'http://localhost:3000',
methods:['PUT']
};

router.use(cors());

router.get('/', (req, res) => {
    res.send('ok');
})


router.post('/', cors(corsSettings), (req, res) => {
    res.send('ok');
})


router.put('/', (req, res) => {
    res.send('ok');
})



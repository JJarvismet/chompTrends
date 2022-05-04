const express = require('express');
const path = require('path');
const app = express();
const googleTrends = require('google-trends-api');
const cors = require('cors');
const streamlineDates = require('./streamlineDates');
const dotenv = require('dotenv').config();

const port = process.env.PORT || 5000;


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));



app.get('/api/:keyword', (req,res)=>{
    let query = {
        keyword: req.params.keyword,
        startTime: new Date('2021-01-01T00:00:00')
    };
    googleTrends.interestOverTime(query)
    .then(function(results){
        const response = JSON.parse(results).default.timelineData;
        let finalResponse = [];
        for(let point of response){
            finalResponse.push({date:`${new Date(point.formattedAxisTime).getFullYear()}/${new Date(point.formattedAxisTime).getMonth()+1}`,count:point.value[0]});
        }
        res.status(200).json(streamlineDates(finalResponse));
    })
    .catch(function(){
        res.status(200).send();
    });
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, './frontend/build')))
    app.get('*', (req,res) => res.sendFile(path.resolve(__dirname, './', 'frontend', 'build', 'index.html')))
}else{
    app.get('/', (req,res) => res.send('please set to production'))
}



app.listen(port,()=>{
    console.log(`backend live on port ${port}`);
})
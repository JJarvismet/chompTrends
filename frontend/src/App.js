import './App.css';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2'
import Chart from 'chart.js/auto';
import compareData from './compareData';

function App() {
  const [query,setQuery] = useState('');
  const [data, setData] = useState([]);
  const [sharkData, setSharkData] = useState([]);
  const [title, setTitle] = useState('');
  const [score,setScore] = useState();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStart, setIsStart] = useState(true);


  const onSubmit = async(e) => {
    setIsStart(false);
    setIsLoading(true)
    setIsError(false);
    setTitle(query);
    e.preventDefault();
    if(query.length>0){
      let response = await axios.get(`/api/${query}`);
      if(!response || response.data.length<1){
        setIsError(true);
        setIsLoading(false);
        return;
      }
      response = response.data;
      let tempData = []
      for(let point of response){
        tempData.push(point.count);
      }
      setData(tempData);
      let response21 = await axios.get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=global-shark-attack&q=&rows=130&facet=date&refine.date=2021');
      response21 = response21.data.facet_groups[0].facets[0].facets;
      let response22 = await axios.get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=global-shark-attack&q=&rows=130&facet=date&refine.date=2022');
      response22 = response22.data.facet_groups[0].facets[0].facets;
      const fullResponse = response21.concat(response22);
      let tempSharkData = [];
      for(let point of fullResponse){
        tempSharkData.push(point.count);
      }
      setSharkData(tempSharkData);
    }else{
      setIsError(true)
    }
    setIsLoading(false);
  }

  useEffect(()=>{
    if(data.length>0 && sharkData.length>0){
      setScore(compareData(data,sharkData));
    }
  },[data,sharkData])


  const chartData = {
    labels: ['Jan 2021', 'Feb 2021', 'Mar 2021', 'Apr 2021', 'May 2021', 'Jun 2021', 'Jul 2021', 'Aug 2021', 'Sep 2021', 'Oct 2021', 'Nov 2021', 'Dec 2021', 'Jan 2022', 'Feb 2022', 'Mar 2022', 'Apr 2022'],
    datasets: [{
        label: title,
        data: data,
        fill: false,
        borderColor: '#c9364c'
      },
      {
        label: 'Shark Attacks',
        data: sharkData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)'
      }]
  };
  

  return (
    <div className={`App ${isStart ? 'startUp' : ''}`}>
      <form onSubmit={(e)=>{onSubmit(e)}}>
        <input type="text" onChange={(e)=>{setQuery(e.target.value)}} placeholder="Search"/>
        <button type="submit">Ask the Sharks</button>
      </form>
      {score && !isError && !isLoading &&
        <>
          <span className='score-label'>shark rating</span>
          <span className='score'>{score}%</span>
        </>
      }
      {data.length>0 && !isError && !isLoading &&
        <div className='chart-box'>
          <Line
            data={chartData}
          />
        </div>
      }
      {isError &&
        <span className='err'>no data found</span>
      }
      {isLoading &&
        <div className="load-box">
          <div class="spinner-border text-info" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      }
    </div>
  );
}

export default App;

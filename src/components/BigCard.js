import React, { useState, useEffect } from 'react'
import './BigCard.css'
import { Button, Container, Row, Col } from 'react-bootstrap';
import cloudy from '../assets/cloudy.png'
import TodayCard from './TodayCard';
import WeekCard from './WeekCard';
import { prod, dev } from '../api/environment';

export default function BigCard() {

  // Variables
  const [apiKey, setApiKey] = useState(null);
  const [geoLat, setGeoLat] = useState(37.9577016);
  const [geoLon, setGeoLon] = useState(-121.2907796);
  const [weathLat, setWeathLat] = useState(null);
  const [weathLon, setWeathLon] = useState(-121.2907796);
  const [chosenCityData, setChosenCityData] = useState();
  const [weatherNowData, setWeatherNowData] = useState(null);
  const [name, setName] = useState();
  const [state, setState] = useState();

  const [searchTerm, setSearchTerm] = useState();

  function handleClick() {

  }

  // At page load
  useEffect(() => {

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    async function success(position) {
      let newLat = position.coords.latitude;
      let newLon = position.coords.longitude;
      console.log(newLat);
      console.log(newLon);
      setGeoLat(newLat);
      setGeoLon(newLon);
      // await ReverseGeoLookup();
    }

    async function error(err) {
      console.warn(err.message);
    }



    let newApiKey = '';

    if (prod.isLive) {
      newApiKey = prod.apiKey;
    } else {
      newApiKey = dev.apiKey;
    }
    console.log(newApiKey);
    setApiKey(newApiKey);

    navigator.geolocation.getCurrentPosition(success, error, options);


  }, []);

  useEffect(() => {
    async function ReverseGeoLookup() {
      let reverseGeoApi = `https://api.openweathermap.org/geo/1.0/reverse?lat=${geoLat}&lon=${geoLon}&limit=1&appid=${apiKey}`;
      let response = await fetch(reverseGeoApi);
      let data = await response.json();
      let newCCD = data[0];
      console.log(newCCD);
      setChosenCityData(newCCD);
      setWeathLat(newCCD.lat);
      setWeathLon(newCCD.lon);
    }

    if (apiKey !== null) {
      console.log('Looking up location');
      ReverseGeoLookup();
    }

  }, [geoLat]);

  useEffect(() => {
    
    function SetDisplayNameVariables() {
      let newName;
      let newState;
      if (chosenCityData.local_names && chosenCityData.local_names.en) {
        newName = chosenCityData.local_names.en;
      } else {
        newName = chosenCityData.name;
      }
      if (chosenCityData.country === 'US' && chosenCityData.state) {
        newState = chosenCityData.state;
      } else {
        newState = chosenCityData.country;
      }
      setName(newName);
      setState(newState);
    }

    async function GetNowData() {
      let weatherNowApi = `https://api.openweathermap.org/data/2.5/weather?lat=${weathLat}&lon=${weathLon}&appid=${apiKey}&units=imperial`;
      let response = await fetch(weatherNowApi);
      let data = await response.json();
      let newWND = data;
      console.log(newWND);
      setWeatherNowData(newWND);
    }
    
    if (weathLat !== null) {
      console.log('Looking up weather');
      SetDisplayNameVariables();
      GetNowData();
    }


  }, [weathLat]);

  return (
    <div className='bigCard'>

      <Container className='innerCont'>
        <Row className='searchRow'>
          <Col>
            <input className='inp' type='text' value={searchTerm} placeholder='Search' onClick={handleClick} onChange={ (e) => {setSearchTerm(e.target.value)}}></input>
            <Button className='btn'>S</Button>
            <Button className='btn'>F</Button>
          </Col>
        </Row>
        <Row className='nowRow'>
          <Col sm={4}>
            <div className='d-flex'>
              <img className='bigImg align-self-start' src={cloudy} alt='Depicts current weather' />
              <p className='bigTemp'>{weatherNowData !== null ? Math.round(weatherNowData.main.temp) : '--'}°</p>
            </div>
            <p className='cityTxt'>{name}</p>
            <p className='weathTxt'>{weatherNowData !== null ? weatherNowData.weather[0].main : '--'}</p>
          </Col>
          <Col sm={8}>
            <div className='d-flex justify-content-between'>
              <TodayCard />
              <TodayCard />
              <TodayCard />
            </div>
          </Col>
        </Row>
        <Row>
          <div className='weekRow d-flex justify-content-between'>
            <WeekCard />
            <WeekCard />
            <WeekCard />
            <WeekCard />
            <WeekCard />
          </div>
        </Row>
      </Container>

    </div>
  )
}
import React from 'react';
import HomeHeader from './module/HomeHeader';
import HomeContent from './module/HomeContent';

const Home = () => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <HomeHeader />
    <HomeContent />
  </div>
);

export default Home;
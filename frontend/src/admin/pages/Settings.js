import React from 'react';
import AboutUsSection from '../components/AboutUsSection'; 
import OurStorySection from '../components/OurStorySection'; 
import FounderSection from '../components/FounderSection'; 
import SocialMediaSection from '../components/SocialMediaSection';
import WebsiteSettings from '../components/WebsiteSettings';
import { Box } from '@mui/material';


const Settings = () => {
  

  return (
    <Box>
      <WebsiteSettings />
      <SocialMediaSection />
      <AboutUsSection />
      <OurStorySection />
      <FounderSection />
    </Box>
  );
};

export default Settings;

import React from 'react';
import Lanyard from '../ui/lanyard';

const About = () => {
    return (
        <div>
            <h1>About</h1>
           <Lanyard position={[0, 0, 30]} gravity={[0, -40, 0]} fov={20} transparent={true} />  
        </div>
    );
};

export default About;

import React, { useState } from 'react'
import { useSpring, animated as a } from 'react-spring'
import Login from "./Login";
import SignUp from "./SignUp"
import './styles.css'


export default function Flip(){
  const [flipped, set] = useState(false)
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: { mass: 10, tension: 900, friction: 100 }
  })  
  return (
      <div  style={{width: '100%', height: '100%', paddingTop: '10%',paddingRight: '37%', paddingLeft: '37%',alignContent: 'center'}}>
        <a.div class="c back" style={{ opacity: opacity.interpolate(o => 1 - o), transform }} ><SignUp flip = {() => set(state => !state)} /></a.div >
        <a.div class="c front" style={{ opacity, transform: transform.interpolate(t => `${t} rotateX(180deg)`) }} > <Login flip = {() => set(state => !state)} /></a.div>
      </div>
    )
  }



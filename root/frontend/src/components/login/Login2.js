


// import Login from "./Login";
// import SignUp from "./SignUp"
// import './styles.css'


// // export default function Flip(){
// //   const [flipped, set] = useState(false)
// //   const { transform, opacity } = useSpring({
// //     opacity: flipped ? 1 : 0,
// //     transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
// //     config: { mass: 10, tension: 900, friction: 100 }
// //   })  
// //   return (
// //       <div  style={{width: '100%', height: '100%', paddingTop: '10%',paddingRight: '37%', paddingLeft: '37%',alignContent: 'center'}}>
// //         <a.div class="c back" style={{ opacity: opacity.interpolate(o => 1 - o), transform }} ><SignUp flip = {() => set(state => !state)} /></a.div >
// //         <a.div class="c front" style={{ opacity, transform: transform.interpolate(t => `${t} rotateX(180deg)`) }} > <Login flip = {() => set(state => !state)} /></a.div>
// //       </div>
// //     )
// //   }

// import { render } from 'react-dom'
// import React, { useState, useCallback } from 'react'
// import { useTransition, animated } from 'react-spring'
// import './styles.css'
// export default function Flip(){
// const location = useLocation()
// const transitions = useTransition(location, location => location.pathname, { ... })
// return transitions.map(({ item, props, key }) => (
//   <animated.div key={key} style={props}>
//     <Switch location={item}>
//       <Route path="/login" component={A} />
//       <Route path="/signup" component={B} />
//       <Route path="/login" component={C} />
//     </Switch>
//   </animated.div>
// ))
// }





// // const pages = [
// //   ({ style }) => <animated.div style={{ ...style, background: 'lightpink' }}><Login /></animated.div>,
// //   ({ style }) => <animated.div style={{ ...style, background: 'lightblue' }}><SignUp /></animated.div>,
// //   ({ style }) => <animated.div style={{ ...style, background: 'lightpink' }}><Login /></animated.div>,
// // ]

// // export default function Flip() {
// //   const [index, set] = useState(0)
// //   const onClick = useCallback(() => set(state => (state + 1) % 3), [])
// //   const transitions = useTransition(index, p => p, {
// //     from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
// //     enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
// //     leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
// //   })
// //   return (
// //     <div className="simple-trans-main" onClick={onClick}>
// //       {transitions.map(({ item, props, key }) => {
// //         const Page = pages[item]
// //         return <Page key={key} style={props} />
// //       })}
// //     </div>
// //   )
// // }



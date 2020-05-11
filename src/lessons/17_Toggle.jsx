/*
	Lesson 17 Context Provider
*/

import React, { Fragment } from "react";
import { Switch } from "./Switch";

const ToggleContext = React.createContext({
	on: false,  // default values
	toggle: () => {}
})

class Toggle extends React.Component {
	// state = {on: false}

	// hide the consumer from outside
	static Consumer = ToggleContext.Consumer
	toggle = () =>
	  this.setState(
		({on}) => ({on: !on}),
		() => this.props.onToggle(this.state.on),
	  )

	state = {on: false, toggle: this.toggle}
	render() {
		// render prop
		//   return this.props.children({
		// 	on: this.state.on,
		// 	toggle: this.toggle,
		//   })
		return <ToggleContext.Provider value={this.state} {...this.props} />
	}
  }

//   const Layer1 = () => <Layer2 />
//   const Layer1 = ({on, toggle}) => <Layer2 on={on} toggle={toggle} />

  const Layer1 = () => <Layer2 />
  const Layer2 = () => 	
  	<Toggle.Consumer>
		  {({on}) => (
			  <Fragment>
				  {on ? 'The button is on' : 'The button is off'}
				  <Layer3 />
			  </Fragment>
		  )}
  		
	</Toggle.Consumer>

  const Layer3 = () => <Layer4 />

  const Layer4 = () => (
	<Toggle.Consumer>
		{({on, toggle}) => <Switch on={on} onClick={toggle} />}
	</Toggle.Consumer>)
  
//   const Layer2 = ({on, toggle}) => (
// 	<Fragment>
// 		{on ? 'The button is on' : 'The button is off'}
// 		<Layer3 on={on} toggle={toggle} />
// 	</Fragment>
//   )
//   const Layer3 = ({on, toggle}) => <Layer4 on={on} toggle={toggle} />
//   const Layer4 = ({on, toggle}) => <Switch on={on} onClick={toggle} />

  function Usage({
	onToggle = (...args) => console.log('onToggle', ...args),
  }) {
	// return (
	//   <Toggle onToggle={onToggle}>
	// 	{({on, toggle}) => <Layer1 on={on} toggle={toggle} />}
	//   </Toggle>
	// )

	return <Toggle onToggle={onToggle}>
		<Layer1 />
	</Toggle>
  }


export default Usage;

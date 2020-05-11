/*
	Lesson 17 HoC with Provider
*/

import React, { Fragment } from "react";
import { Switch } from "./Switch";
import hoistNonReactStatics from "hoist-non-react-statics"

const ToggleContext = React.createContext({
	on: false,  // default values
	toggle: () => {}
})

class Toggle extends React.Component {
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

  function withToggle(Component) {
	  const Wrapper = (props, ref) => {
		console.log(props)

		return (<Toggle.Consumer>
			{(toggleContext) => (
				<Component toggleContext={toggleContext} ref={ref} {...props} />
			)}
		</Toggle.Consumer>)
	  }

	//   return Wrapper;
	return React.forwardRef(Wrapper)
	//   return hoistNonReactStatics(React.forwardRef(Wrapper), Component)
  }

  const myRef = React.createRef()
  const Layer1 = () => <Layer2 ref={myRef} />
//   const Layer2 = () => 	
//   	<Toggle.Consumer>
// 		  {({on}) => (
// 			  <Fragment>
// 				  {on ? 'The button is on' : 'The button is off'}
// 				  <Layer3 />
// 			  </Fragment>
// 		  )}
  		
// 	</Toggle.Consumer>

// HoC
// pass functional component to HoC
const Layer2 = withToggle(({ toggleContext: {on} }) => (
	<Fragment>
		{on ? 'The button is on' : 'The button is off'}
		<Layer3 />
	</Fragment>
))

  const Layer3 = () => <Layer4 />

//   const Layer4 = () => (
// 	<Toggle.Consumer>
// 		{({on, toggle}) => <Switch on={on} onClick={toggle} />}
// 	</Toggle.Consumer>)


const Layer4 = withToggle(
	({toggleContext: {on, toggle} }) => <Switch on={on} onClick={toggle} />
)
  
  function Usage({
	onToggle = (...args) => console.log('onToggle', ...args),
  }) {
	return (
		<Toggle onToggle={onToggle}>
			<Layer1 />
		</Toggle>
	)
  }


export default Usage;

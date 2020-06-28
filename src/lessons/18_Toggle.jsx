/*
	Lesson 18 HoC
*/

import React, { Fragment } from "react";
import { Switch } from "./Switch";
import hoistNonReactStatics from "hoist-non-react-statics";

const ToggleContext = React.createContext()

class Toggle extends React.Component {
	// hide the consumer from outside
	static Consumer = ToggleContext.Consumer
	toggle = () =>
		this.setState(
			({ on }) => ({ on: !on }),
			() => this.props.onToggle(this.state.on),
		)

	state = { on: false, toggle: this.toggle }
	render() {
		return <ToggleContext.Provider value={this.state} {...this.props} />
	}
}

// HoC - wraps toggle context
function withToggle(Component) {
	const Wrapper = (props, ref) => (
		<Toggle.Consumer>
			{
				toggleContext => (
					<Component toggle={toggleContext} ref={ref} {...props} />
				)
			}
		</Toggle.Consumer>
	)

	// return Wrapper

	// put all static components of Component to Wrapper...
	// so users (Layer2, Layer4) can assume they are interacting with the
	// component, not the wrapper
	// return hoistNonReactStatics(Wrapper, Component)

	// put a better name
	Wrapper.displayName = `withToggle(${Component.displayName || Component.Name})`
	return hoistNonReactStatics(React.forwardRef(Wrapper), Component)
}

// ref
const myRef = React.createRef()

// const Layer1 = () => <Layer2 ref={myRef} />
const Layer1 = () => <Layer2 />
// const Layer2 = () =>
// 	<Toggle.Consumer>
// 		{({ on }) => (
// 			<Fragment>
// 				{on ? 'The button is on' : 'The button is off'}
// 				<Layer3 />
// 			</Fragment>
// 		)}

// 	</Toggle.Consumer>

// HoC - instead of wrapping explicitly in <Toggle.Consumer>
// use withToggle instead

// use better name with a named function
const Layer2 = withToggle(function Layer2({ toggle: { on } }) {
	return (
		<Fragment>
			{on ? 'The button is on' : 'The button is off'}
			<Layer3 />
		</Fragment>
	)
})

const Layer3 = () => <Layer4 />

// const Layer4 = () => (
// 	<Toggle.Consumer>
// 		{({ on, toggle }) => <Switch on={on} onClick={toggle} />}
// 	</Toggle.Consumer>)

const Layer4 = withToggle(function Layer4({ toggle: { on, toggle } }) {
	return <Switch on={on} onClick={toggle} />
})

function Usage({
	onToggle = (...args) => console.log('onToggle', ...args),
}) {
	return <Toggle onToggle={onToggle}>
		<Layer1 />
	</Toggle>
}


export default Usage;

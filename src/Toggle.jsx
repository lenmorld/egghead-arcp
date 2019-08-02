/*
	Lesson 3
*/

import React from "react";
import { Switch } from "./Switch";

// const ToggleOn = ({ on, children }) => (on ? children : null);

class Toggle extends React.Component {
	// <Toggle.On /> === <ToggleOn>
	// it's just a simple way of having a stateless component
	// but inside an existing class as a static function
	static On = ({ on, children }) => (on ? children : null);
	static Off = ({ on, children }) => (on ? null : children);
	static Button = ({ on, toggle, ...props }) => (
		<Switch on={on} onClick={toggle} {...props} />
	);

	state = { on: false };
	toggle = () =>
		this.setState(
			({ on }) => ({ on: !on }),
			() => {
				this.props.onToggle(this.state.on);
			}
		);

	render() {
		// debugger;
		// for every child passed to this component, create a copy and inject the props
		return React.Children.map(this.props.children, childElement =>
			React.cloneElement(childElement, { on: this.state.on, toggle: this.toggle })
		);
		// return <Switch on={this.state.on} onClick={this.toggle} />;
	}
}
function Usage({ onToggle = (...args) => console.log("onToggle", ...args) }) {
	// 3 compound components implicitly accessing the state
	debugger;
	return (
		<Toggle onToggle={onToggle}>
			{/* <ToggleOn>The button is on.</ToggleOn> */}

			{/* Toggle.On and Toggle.Off are like labels */}
			<Toggle.On>The button is on.</Toggle.On>
			<Toggle.Off>The button is off.</Toggle.Off>

			{/* this is the actual switch */}
			<Toggle.Button />
		</Toggle>
	);
}

export default Usage;

/*
Compound Components

Write Compound Components
Compound components give more rendering control to the user. 
The functionality of the component stays intact while how it looks and the order of the children can be changed at will. 
We get this functionality by using the special `React.Children.map` function to map over the children given to our `<Toggle/>` component. 
We map over the children to pass the on state as a prop to its children.
We move the visual pieces of the component out into function components and add them as static properties to `<Toggle/>`.
*/

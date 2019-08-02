/*
	Lesson 4
*/

import React from "react";
import { Switch } from "./Switch";

const ToggleContext = React.createContext();

class Toggle extends React.Component {
	// static On = ({ on, children }) => (on ? children : null);
	// static Off = ({ on, children }) => (on ? null : children);
	// static Button = ({ on, toggle, ...props }) => (
	// 	<Switch on={on} onClick={toggle} {...props} />
	// );

	// consume context values instead of accepting them as props

	// {(contextValue) => (contextValue.on ? children : null)}
	// SAME AS
	// {({ on }) => (on ? children : null)}

	static On = ({ children }) => (
		<ToggleContext.Consumer>
			{contextValue => (contextValue.on ? children : null)}
		</ToggleContext.Consumer>
	);

	static Off = ({ children }) => (
		<ToggleContext.Consumer>
			{contextValue => (contextValue.on ? null : children)}
		</ToggleContext.Consumer>
	);

	static Button = props => (
		<ToggleContext.Consumer>
			{contextValue => (
				<Switch on={contextValue.on} onClick={contextValue.toggle} {...props} />
			)}
		</ToggleContext.Consumer>
	);

	state = { on: false };
	toggle = () =>
		this.setState(
			({ on }) => ({ on: !on }),
			() => {
				this.props.onToggle(this.state.on);
			}
		);

	// render() {
	// 	return React.Children.map(this.props.children, childElement =>
	// 		React.cloneElement(childElement, { on: this.state.on, toggle: this.toggle })
	// 	);
	// }

	render() {
		return (
			<ToggleContext.Provider
				value={{
					on: this.state.on,
					toggle: this.toggle
				}}
			>
				{this.props.children}
			</ToggleContext.Provider>
		);
	}
}
function Usage({ onToggle = (...args) => console.log("onToggle", ...args) }) {
	return (
		<Toggle onToggle={onToggle}>
			<Toggle.On>The button is on.</Toggle.On>
			<Toggle.Off>The button is off.</Toggle.Off>
			<div>
				<Toggle.Button />
			</div>
		</Toggle>
	);
}

export default Usage;

/*
Make Compound React Components Flexible
Our current compound component implementation is great, but it's limited in that users cannot render the structure they need. 
e.g.
		<Toggle onToggle={onToggle}>
			<Toggle.On>The button is on.</Toggle.On>
			<Toggle.Off>The button is off.</Toggle.Off>
			<div>   <------- NOT A REACT CHILDREN
				<Toggle.Button />
			</div>
		</Toggle>

Let's allow the user to have more flexibility by using React context to share the implicit state to our child `<Toggle/>` components. We will walk through using React's official context API with `React.createContext` and use the given `Provider` and `Consumer` components to share state implicitly between our compound components giving our users the flexibility they need out of our component.
*/

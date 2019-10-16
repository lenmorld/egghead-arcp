/*
	Lesson 6
*/

import React from "react";
import { Switch } from "./Switch";

const ToggleContext = React.createContext();

function ToggleConsumer(props) {
	return (
		<ToggleContext.Consumer>
			{context => {
				if (!context) {
					throw new Error('Toggle compound components must be rendered within Toggle component');
				}
				return props.children(context)
			}}
		</ToggleContext.Consumer>
	)
}

class Toggle extends React.Component {
	static On = ({ children }) => (
		<ToggleConsumer>
			{({ on }) => (on ? children : null)}
		</ToggleConsumer>
	);

	static Off = ({ children }) => (
		<ToggleConsumer>
			{({ on }) => (on ? null : children)}
		</ToggleConsumer>
	);

	static Button = props => (
		<ToggleConsumer>
			{contextValue => (
				<Switch on={contextValue.on} onClick={contextValue.toggle} {...props} />
			)}
		</ToggleConsumer>
	);

	toggle = () =>
		this.setState(
			({ on }) => ({ on: !on }),
			() => this.props.onToggle(this.state.on)
		);
	state = { on: false, toggle: this.toggle };

	render() {
		/*
			<ToggleContext.Provider
				value={{
					on: this.state.on,
					toggle: this.toggle
				}}
			>
		*/
		return (
			<ToggleContext.Provider
				value={this.state}
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

import React from "react";
import { Switch } from "./Switch";

class Toggle extends React.Component {
	state = { on: false };
	render() {
		return <Switch on={this.state.on} />;
	}
}

// passing a function prop to a stateless component
function Usage({ onToggle = (...args) => console.log("onToggle", ...args) }) {
	return <Toggle onToggle={onToggle} />;
}

export default Usage;

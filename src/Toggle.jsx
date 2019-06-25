import React from "react";
import { Switch } from "./Switch";

class Toggle extends React.Component {
	render() {
		return <Switch />;
	}
}

// passing a function prop to a stateless component
function Usage({ onToggle = (...args) => console.log("onToggle", ...args) }) {
	return <Toggle onToggle={onToggle} />;
}

export default Usage;

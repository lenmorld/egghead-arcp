import React from "react";
// import Toggle from "./Toggle";
// import Test from "./Test";
import Usage from "./Toggle";

class App extends React.Component {
	render() {
		return <Usage />;
	}
}

export default App;

/*
<Usage onToggle={(...args) => console.log("[LENNY] onToggle", ...args)}
		name="lenny" />
*/

yarn dev

localhost:8080


1, 2 - simple toggle component

3- compound component : sharing state implicitly with child components
each innner compound component (Toggle.On, Toggle.Off, Toggle.Button all implemented as a static stateless component) 
has access to the parent Toggle's state (on) and handler method (toggle) 
- using React.Children.map and React.cloneElement

✅ component users can render in any order, without any render config whatsoever


4 - Context : make compound component more flexible, so it won't break with say, `<div><Toggle.Button></div>`


5 - Validate context consumer : what if a Consumer is rendered outside of a Provider
e.g. replace <Toggle ... with <div...

-> Encapsulate consumer in a function, so we can add validation
this is possible because the child of a context consumer is a function

```javascript
<ToggleContext.Consumer>{(contextValue) => blah}</ToggleContext.Consumer>
```

```javascript
function ToggleConsumer(props) {
	return (
		<ToggleContext.Consumer>
			{context => {
					if (!context) {
					throw new Error('must use consumer inside provider');
				}
				return props.children(context)
			}}
		</ToggleContext.Consumer>
	)
}
...
<ToggleConsumer>{(contextValue) => blah}</ToggleConsumer>
```

6 - reducing re-renders

everytime value exposed by Provider changes, all Consumers are re-rendered
right now, it changes every single render
since value is recreated every render 
```javascript
	<ToggleContext.Provider
		value={{
			on: this.state.on,
			toggle: this.toggle
		}}
	>
```

but for our use case, it should only re-render when `this.state.on` changes

-> put event handler in state, since it shouldn't change
so here we put entire state in provider value

it might be weird to put event handler in state, 
but this is a nice tradeoff when using context

```javascript
state = { on: false, toggle: this.toggle };
...
<ToggleContext.Provider
	value={this.state}
>
```
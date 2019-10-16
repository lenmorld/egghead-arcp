yarn dev

localhost:8080


1, 2 - simple toggle component

3- compound component : sharing state implicitly with child components
each innner compound component (Toggle.On, Toggle.Off, Toggle.Button all implemented as a static stateless component) 
has access to the parent Toggle's state (on) and handler method (toggle) 
- using React.Children.map and React.cloneElement

✅ component users can render in any order, without any render config whatsoever


4 - Context : make compound component more flexible, so it won't break with say, `<div><Toggle.Button></div>`
import { createGlobalStyle } from "styled-components";
const GlobalStyles = createGlobalStyle`
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', 'Arial', sans-serif;
    background-color: #ffffff;
    color: #000000;
    height: 100vh;
    overflow: hidden;
    padding: 20px;
    --webkit-font-smoothing: antialiased;
    -mox-osx-font-smoothing: grayscale;
}

html, body, #__next {
    height: 100%;
}
a {
    color: inherit;
    text-decoration: none;
}

button {
    font-family: inherits;
    cursor: poiner;
}
`
export default GlobalStyles;
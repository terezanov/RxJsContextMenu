import React from 'react';
import { render } from 'react-dom';
import Rx from 'rxjs';
import styled from 'styled-components';

const Menu = styled.div`
  width: 230px;
  background: #2d2f31;
  box-shadow: 0 1px 5px rgba(0,0,0,.3);
  position: absolute;
  transform: rotateY(180deg);
  top: ${props => props.coords.pageY + 'px;'}
  left: ${props => props.coords.pageX + 'px;'}
  -webkit-backface-visibility: visible !important;
  backface-visibility: visible !important;
  animation-name: flipInX;
  animation-duration: .3s;
  animation-fill-mode: both;
  @keyframes flipInX {
  from {
    transform: perspective(1000px) rotate3d(1, 0, 0, 90deg);
    animation-timing-function: ease-in;
    opacity: 0;
  }
  40% {
    transform: perspective(1000px) rotate3d(1, 0, 0, -20deg);
    animation-timing-function: ease-in;
  }
  60% {
    transform: perspective(1000px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }
  80% {
    transform: perspective(1000px) rotate3d(1, 0, 0, -5deg);
  }
  to {
    transform: perspective(1000px);
  }
}
`;

const Item = styled.div`
  display: flex;
  color: #bbb;
  font-size: 15px;
  font-family: 'Saira Condensed', sans-serif;
  padding: .8em 1em;
  line-height: 1.1em;
  cursor: default;
  :hover {
    background-color: #3a3a3a;
    color: #00bfff;
  }
  span {
    flex-basis: 65%;
  }
  em {
    flex-basis: 35%;
    opacity: .7;
    text-align: right;
    font-style: normal;
    font-size: 13px;
  }
`;

const Stripe = styled.div`
  height: 1px;
  background-color: #666768;
  margin: 6px 5%;
`;

function createDataForMenu() {
  return [{
            type: "data",
            title: "Go to Definition",
            keys: "Ctrl+F12"
          },
          {
            type: "data",
            title: "Peek Definition",
            keys: "Alt+F12"
          },
          {
            type: "data",
            title: "Find All References",
            keys: "Shift+F12"
          },
          {
            type: "data",
            title: "Go to Symbol...",
            keys: "Ctrl+Shift+O"
          },
          {
            type: <Stripe/>
          },
          {
            type: "data",
            title: "Change All Occurrences",
            keys: "Ctrl+F2"
          },
          {
            type: "data",
            title: "Format Document",
            keys: "Shift+Alt+F"
          },
          {
            type: <Stripe/>
          },
          {
            type: "data",
            title: "Command Palette",
            keys: "F1"
          }
  ];
}


function MenuItem({title, keys}) {
  return <Item><span>{title}</span><em>{keys}</em></Item>;
}


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isVisibleMenu: false,
      coords: {
        pageX: 0,
        pageY: 0
      }
    };
  }

  componentDidMount() {
    console.log('mounted');

    const ctxMenu$ = Rx.Observable.fromEvent(document, 'contextmenu')
                      .map(e => {
                        const {pageX, pageY} = e;
                        e.preventDefault();
                        return {action: 'right', coords: {pageX, pageY}}
                        });

    const click$ = Rx.Observable.fromEvent(document, 'click')
                      .map(e => {
                        const {pageX, pageY} = e;
                        e.preventDefault();
                        return {action: 'left', coords: {pageX, pageY}}
                        });

    Rx.Observable.merge(ctxMenu$, click$).subscribe({
        next: ({action, coords}) => {
          console.log(action);
          switch(action) {
            case 'right':
              this.setState({ isVisibleMenu: true, coords });
              break;
            case 'left':
              this.setState({ isVisibleMenu: false, coords });
              break;
          }
        }
      });

  }

  render() {
    const {coords, isVisibleMenu} = this.state;
    const items = createDataForMenu().map((item, i) => {
      switch(typeof item.type) {
        case 'string':
          return <MenuItem {...item} key={i}/>;
        default: 
          return item.type;
      }
    });
    return (
      <div>
        {isVisibleMenu && <Menu coords={coords}>{items}</Menu>}
      </div>
    );
  }
} 

render(<App />, document.getElementById('root'));

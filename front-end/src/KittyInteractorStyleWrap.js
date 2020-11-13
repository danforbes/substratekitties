import styled from 'styled-components';
import theme from './theme';

export default styled.div`
  position: fixed;
  z-index: 1;
  bottom: 0;
  left: 0;
  width: 100%;
  max-height: 100vh;

  && {
    &, .ui.segment, .menu, .menu .item {
      border: none;
      border-color: transparent;
      color: ${theme.colors.console.text};
      background: ${theme.colors.console.bg};
    }

    .menu:before {
      content: '';
      display: block;
      position: absolute;
      z-index: 1;
      top: calc(3em - 1px);
      left: 0;
      height: 1px;
      width: 100vw;
      background: ${theme.colors.brand.bg};
      opacity: 0.3;
    }

    .menu .item {
      &, &.active, &:hover {
        color: ${theme.colors.console.text};
        text-transform: lowercase;
      }
      &.active {
        background: ${theme.colors.console.highlight};
      }
      &.close {
        position: absolute;
        right: 0;
        &.active {
          opacity: 0;
        }
      }
    }

    .grid {
      padding: 2rem 0 3rem 0;
    }

    code, input, button {
      font-size: 0.9rem;
      font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    }

    code span {
      display: inline-block;
      input {
        border: none;
        &, &:active, &:focus, ::placeholder {
          background: ${theme.colors.console.input};
          color: ${theme.colors.console.text};
        }
        ::placeholder {
          color: black !important;
        }
      }
      label {
        display: block;
        font-size: 0.9em;
      }
      &:not(:last-child):after {
        content: ', ';
        margin-top: 1em;
        color: ${theme.colors.console.text};
      }
    }

    .ui.buttons .or:before {
      background: ${theme.colors.console.bg};
      border: 1px solid darkgreen;
      color: green;
      line-height: 1.65em;
      font-weight: 100;
    }
  }
`;

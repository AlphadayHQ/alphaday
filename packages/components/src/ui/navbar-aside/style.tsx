/* eslint-disable @typescript-eslint/no-unsafe-return */
import styled, { themeGet, tinycolor, css } from "@alphaday/shared/styled";
import { Anchor } from "../anchor";

export const StyledNavbar = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

type NavItemProps = {
  $hasSubmenu: boolean;
};

export const StyledNavitem = styled.li<NavItemProps>`
  &:not(:first-of-type) {
    margin-top: 25px;
  }
`;

export const StyledNavlink = styled(({ ...rest }) => <Anchor {...rest} />)`
  font-size: 10px;
  font-weight: 700;
  font-family: ${themeGet("fonts.interUi")};
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 5px;
  display: block;
  transition: all 0.25s;
  ${(props) =>
    props.theme.name !== "dark" &&
    css`
      color: ${themeGet("colors.text")};
    `}
  ${(props) =>
    props.theme.name === "dark" &&
    css`
      color: #fff;
    `}
    .aside-navbar-label {
    pointer-events: none;
  }
`;

export const StyledSubmenu = styled.ul`
  &.mega-submenu {
    padding-left: 34px;
    opacity: 0;
    visibility: hidden;
    height: 0;
    &.open {
      padding-bottom: 10px;
      opacity: 1;
      visibility: visible;
      height: auto;
    }
  }
`;

export const StyledSubNavItem = styled.li`
  &.with-sub {
    &.open {
      & > a {
        color: ${themeGet("colors.text2")};
        font-weight: 500;
        svg {
          color: ${themeGet("colors.text2")};
        }
        &:before {
          opacity: 1;
          visibility: visible;
        }
        &:after {
          transform: rotate(45deg);
        }
      }
    }
    & > a {
      &:before {
        content: "";
        position: absolute;
        top: 2px;
        left: -25px;
        bottom: 2px;
        right: -25px;
        border-left: 3px solid ${themeGet("colors.text3")};
        opacity: 0;
        visibility: hidden;
      }
      &:after {
        position: absolute;
        right: 0;
        top: 11px;
        content: "";
        width: 4px;
        height: 4px;
        border-right: 1.5px solid ${themeGet("colors.text3")};
        border-bottom: 1.5px solid ${themeGet("colors.text3")};
        transform: rotate(-45deg);
        transition: all 0.2s ease-in-out;
      }
    }
  }
`;

export const StyledSubNavlink = styled(({ ...rest }) => <Anchor {...rest} />)`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 13px;
  padding: 0;
  height: 30px;

  transition: all 0.25s;
  &:before {
    content: "";
    position: absolute;
    top: 2px;
    left: -25px;
    bottom: 2px;
    right: -25px;
    border-left: 3px solid ${themeGet("colors.text3")};
    opacity: 0;
    visibility: hidden;
  }
  &:focus {
    outline: none;
  }
  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.3px;
    margin-right: 15px;
  }
  ${(props) =>
    props.theme.name !== "dark" &&
    css`
      color: ${tinycolor(themeGet("colors.text2")(props))
        .setAlpha(0.9)
        .toString()};
      svg {
        color: ${tinycolor(themeGet("colors.text2")(props))
          .setAlpha(0.65)
          .toString()};
        fill: ${tinycolor(themeGet("colors.text2")(props))
          .setAlpha(0.06)
          .toString()};
      }
    `}
  ${(props) =>
    props.theme.name === "dark" &&
    css`
      color: ${themeGet("colors.gray500")};
      svg {
        color: ${themeGet("colors.gray500")};
        fill: ${tinycolor(themeGet("colors.white")(props))
          .setAlpha(0.06)
          .toString()};
      }
      &:hover,
      &:focus {
        color: #fff;
        svg {
          color: #fff;
        }
      }
    `}
    &.active {
    opacity: 1;
    color: ${themeGet("colors.primary")};
    font-weight: 500;
    &:before {
      opacity: 1;
      visibility: visible;
      border-left-color: ${themeGet("colors.primary")};
    }
    svg {
      color: ${themeGet("colors.primary")};
      fill: ${(props) =>
        tinycolor(props.theme.colors.primary).setAlpha(0.2).toString()};
    }
  }
`;

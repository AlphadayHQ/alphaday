/* eslint-disable @typescript-eslint/no-explicit-any */
import styled, { SpaceProps, BorderProps } from "@alphaday/shared/styled";
import { IFeedback, TCustomStyle } from "../types";
import {
  InputStyles,
  SuccessInputStyles,
  WarningInputStyles,
  ErrorInputStyles,
  allowedProps,
} from "../style";

interface IInput extends IFeedback, SpaceProps, BorderProps {
  $width?: string | any[];
  $height?: string | any[];
  $customStyle?: TCustomStyle;
  $colors?: { [key: string]: string };
}

export const StyledInput = styled("input").withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) =>
    ![...allowedProps].includes(prop) && defaultValidatorFn(prop),
})<IInput>`
  background-color: ${({ $colors }) => $colors?.white} !important;
  color: ${({ $colors }) => $colors?.brown200} !important;
  border-color: ${({ $colors }) => $colors?.brown100} !important;
  ${InputStyles};
  ${({ $state, $showState, $showErrorOnly }) =>
    $state === "success" &&
    $showState &&
    !$showErrorOnly &&
    SuccessInputStyles};
  ${({ $state, $showState, $showErrorOnly }) =>
    $state === "warning" &&
    $showState &&
    !$showErrorOnly &&
    WarningInputStyles};
  ${({ $state, $showState, $showErrorOnly }) =>
    $state === "error" && $showState && $showErrorOnly && ErrorInputStyles};
`;

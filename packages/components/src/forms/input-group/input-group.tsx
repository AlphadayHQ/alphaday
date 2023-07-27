import { FC } from "react";
import classname from "classnames";
import { SpaceProps } from "@alphaday/shared/styled";
import {
  StyledInputGroup,
  StyledInputGroupWrap,
  StyledInputGroupText,
} from "./style";

interface IProps extends SpaceProps {
  className?: string;
  children?: React.ReactNode;
}

export const InputGroup: FC<IProps> = ({ children, className, ...rest }) => {
  return (
    <StyledInputGroup className={classname(className, "input-group")} {...rest}>
      {children}
    </StyledInputGroup>
  );
};

interface IWrap extends IProps {
  dir?: "append" | "prepend";
  $colors?: { [key: string]: string };
}

export const InputGroupAddon: FC<IWrap> = ({
  children,
  dir = "append",
  className,
  $colors,
  ...rest
}) => {
  return (
    <StyledInputGroupWrap
      className={classname(className, `input-group-${dir}`)}
      $dir={dir}
      $colors={$colors}
      {...rest}
    >
      {children}
    </StyledInputGroupWrap>
  );
};

export const InputGroupText: FC<IWrap> = ({
  children,
  className,
  $colors,
  ...rest
}) => {
  return (
    <StyledInputGroupText
      className={classname(className, `input-group-text`)}
      $colors={$colors}
      {...rest}
    >
      {children}
    </StyledInputGroupText>
  );
};

import { FC, ElementType } from "react";
import {
  SpaceProps,
  ColorProps,
  TypographyProps,
  LayoutProps,
} from "@alphaday/shared/styled";
import { StyledText } from "./style";

interface IProps extends SpaceProps, ColorProps, TypographyProps, LayoutProps {
  as?: ElementType;
  className?: string;
  children?: React.ReactNode;
}

const Text: FC<IProps> = ({ as, className, children, ...restProps }) => {
  return (
    <StyledText as={as} className={className} {...restProps}>
      {children}
    </StyledText>
  );
};

export default Text;

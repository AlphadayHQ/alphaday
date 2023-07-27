import { FC } from "react";
import { TypographyProps } from "@alphaday/shared/styled";
import { StyledTitle, StyledDesc } from "./style";

interface IProps {
  title: string;
  desc?: string;
  descProps?: TypographyProps;
  titleProps?: TypographyProps;
  $color?: string;
}

const SectionTitle: FC<IProps> = ({
  title,
  desc,
  descProps,
  titleProps,
  $color,
}) => {
  return (
    <>
      <StyledTitle $hasDesc={Boolean(desc)} {...titleProps}>
        <span style={{ cursor: "pointer", color: $color }}>{title}</span>
      </StyledTitle>
      {desc && (
        <StyledDesc {...descProps} dangerouslySetInnerHTML={{ __html: desc }} />
      )}
    </>
  );
};

export default SectionTitle;

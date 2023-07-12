import styled, { layout, LayoutProps } from "@alphaday/shared/styled";

export const StyledMap = styled(({ width, height, ...props }) => (
  <div {...props} />
))<LayoutProps>`
  ${layout}
  display: flex;
  align-items: center;
  justify-content: center;
`;

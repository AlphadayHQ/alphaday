import styled, { space, SpaceProps } from "@alphaday/shared/styled";

export const StyledGroup = styled(({ mb, mt, ...rest }) => (
  <div {...rest} />
))<SpaceProps>`
  ${space}
`;

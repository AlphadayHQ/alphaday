/* eslint-disable @typescript-eslint/no-unsafe-return */
import styled from "@alphaday/shared/styled";

export const StyledNav = styled.div`
  padding: 0 28px;
  width: 100%;
  border-top: 1px solid;
  border-color: ${({ theme }) => theme.colors.brown100 || "#485e9029"};

  .right {
    float: right;
  }
  .left {
    float: left;
  }
  span {
    cursor: pointer;
    margin: 6px 0 0px;
  }
  img {
    width: 35px;
    height: 35px;
    color: #eaeaea;
  }
`;

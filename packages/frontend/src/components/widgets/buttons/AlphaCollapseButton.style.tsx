import styled from "@alphaday/shared/styled";

export const StyledCollapseButton = styled(({ ...props }) => (
    <div {...props} />
))`
    justify-self: center;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 18px;
    height: 18px;

    .expand-collapse-icon {
        font-size: 14px;
        width: 1em;
        height: 1em;
        position: relative;
        display: inline-block;
    }

    .expand-collapse-icon::before,
    .expand-collapse-icon::after {
        content: "";
        position: absolute;
        width: 1em;
        height: 0.16em;
        top: calc((1em / 2) - 0.08em);
        background-color: ${(props) => props.theme.colors.primary};
        transition: 0.3s ease-in-out all;
        border-radius: 0.03em;
    }

    .expand-collapse-icon::before {
        transform: rotate(0deg);
    }

    .collapsed.expand-collapse-icon::before {
        transform: rotate(-90deg);
    }
`;

import { styled } from "@stitches/react";

const Button = styled("button", {
  fontWeight: 600,
  borderRadius: 18,
  minWidth: 100,
  color: "#32322c",
  cursor: "pointer",
  "&:disabled": {
    backgroundColor: "#bbb",
    pointerEvents: "none",
  },

  variants: {
    primary: {
      true: {
        color: "white",
        backgroundColor: "#39a0ed",
        border: "none",
        "&:hover": {
          backgroundColor: "#4c6085",
        },
      },
    },
    secondary: {
      true: {
        border: "2px solid #36f1cd",
        "&:hover": {
          borderColor: "#13c4a3",
        },
      },
    },
    big: {
      true: {
        fontSize: 18,
        padding: 6,
        margin: 6,
      }
    },
  },
});

export default Button;

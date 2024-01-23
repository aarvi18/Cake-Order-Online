import { Button } from "@chakra-ui/react";
import React from "react";

const CustomButton = ({ children, ...rest }) => {
  return (
    <Button
      color={"white"}
      bgGradient="linear(to-r, blue.400,red.400)"
      _hover={{
        bgGradient: "linear(to-r, blue.400,red.400)",
        boxShadow: "xl",
      }}
      _focus={{
        bgGradient: "linear(to-r, blue.400,red.400)",
        boxShadow: "xl",
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default CustomButton;

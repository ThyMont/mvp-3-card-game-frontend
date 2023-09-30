import { Box, Spinner } from "@chakra-ui/react";

const LoadingOverlay = () => {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      bg="rgba(0, 0, 0, 0.6)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="999"
      flexDirection="column"
    >
      <Spinner size="xl" color="white" />
    </Box>
  );
};

export default LoadingOverlay;

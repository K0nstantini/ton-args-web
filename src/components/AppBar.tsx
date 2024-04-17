import { AppBar, Box, Button, Container, Divider, Drawer, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { TonConnectButton, useTonConnectModal, useTonConnectUI } from "@tonconnect/ui-react";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import { useTonConnect } from "../hooks/useTonConnect";

export function AppAppBar() {
  const logoStyle = {
    width: '40px',
    height: 'auto',
    cursor: 'pointer',
  };
  const [openDrawer, setOpenDrawer] = useState(false);
  const { connected } = useTonConnect();
  const { open: openConnectModal } = useTonConnectModal();
  const [tonConnectUI] = useTonConnectUI();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDrawer(newOpen);
  };

  const openContract = () => {
    const address = import.meta.env.VITE_MAIN_CONTRACT;
    const net = import.meta.env.VITE_NET;
    const url = net && net == "mainnet" ? "https://tonscan.org" : "https://testnet.tonscan.org";
    window.open(`${url}/address/${address}`, "_blank", "noreferrer");
  };

  const openSource = () => {
    window.open("https://github.com/K0nstantini/ton-args/tree/main/contracts", "_blank", "noreferrer");
  };

  const openTonConnect = async () => {
    setOpenDrawer(false);
    if (connected) {
      tonConnectUI.disconnect();
    } else {
      openConnectModal();
    }
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 2,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            bgcolor:
              theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.4)'
                : 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(24px)',
            maxHeight: 40,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow:
              theme.palette.mode === 'light'
                ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
          })}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              ml: '-12px',
              px: 0,
            }}
          >
            <img
              src={
                'https://K0nstantini.github.io/ton-args-web/ton.svg'
              }
              style={logoStyle}
              alt="logo of sitemark"
            />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <MenuItem
                onClick={openContract}
                sx={{ py: '6px', px: '12px' }} >
                <Typography variant="body2" color="text.primary"> Contract </Typography>
              </MenuItem>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <MenuItem
                onClick={openSource}
                sx={{ py: '6px', px: '12px' }} >
                <Typography variant="body2" color="text.primary"> Source </Typography>
              </MenuItem>
            </Box>
            <Tooltip title="Coming soon">
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <MenuItem
                  onClick={() => { }}
                  sx={{ py: '6px', px: '12px' }} >
                  <Typography variant="body2" color="text.primary"> FAQ </Typography>
                </MenuItem>
              </Box>
            </Tooltip>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 0.5,
              alignItems: 'center',
            }} >
            <TonConnectButton />
          </Box>
          <Box sx={{ display: { sm: '', md: 'none' } }}>
            <Button
              variant="text"
              color="primary"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ minWidth: '30px', p: '4px' }}
            >
              <MenuIcon />
            </Button>
            <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer(false)}>
              <Box
                sx={{
                  minWidth: '60dvw',
                  p: 2,
                  backgroundColor: 'background.paper',
                  flexGrow: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'end',
                    flexGrow: 1,
                  }}
                >
                </Box>
                <MenuItem onClick={openContract}> Contract </MenuItem>
                <MenuItem onClick={openSource}> Source </MenuItem>
                <MenuItem> FAQ </MenuItem>
                <Divider />
                <MenuItem>
                  <Button
                    variant="contained"
                    sx={{ width: '100%' }}
                    onClick={openTonConnect}
                  >
                    {connected ? "Disconnect" : "Connect"}
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

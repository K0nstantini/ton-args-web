import { AppBar, Box, Button, Container, Divider, Drawer, IconButton, MenuItem, Toolbar } from "@mui/material";
import { TonConnectButton, useTonConnectModal, useTonConnectUI } from "@tonconnect/ui-react";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import { useTonConnect } from "../hooks/useTonConnect";

export function AppAppBar() {
  const sourceUrl = "https://github.com/K0nstantini/ton-args/tree/main/contracts";
  const siteUrl = "https://k0nstantini.github.io/ton-args-web/";
  const contractUrl = () => {
    const address = import.meta.env.VITE_MAIN_CONTRACT;
    const net = import.meta.env.VITE_NET;
    const url = net && net == "mainnet" ? "https://tonscan.org" : "https://testnet.tonscan.org";
    return `${url}/address/${address}`;
  };


  const [openDrawer, setOpenDrawer] = useState(false);
  const { connected } = useTonConnect();
  const { open: openConnectModal } = useTonConnectModal();
  const [tonConnectUI] = useTonConnectUI();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDrawer(newOpen);
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
            }}
          >
            <Box sx={{ display: { xs: 'none', md: 'flex', gap: '16px' } }}>
              <IconButton>
                <a href="https://t.me/TonArgsBot" target="_blank" rel="noopener noreferrer">
                  <img
                    src={
                      'https://K0nstantini.github.io/ton-args-web/telegram.svg'
                    }
                    style={{ width: '30px', cursor: 'pointer' }}
                    alt="Telegram"
                  />
                </a>
              </IconButton>
              <IconButton>
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={
                      'https://K0nstantini.github.io/ton-args-web/github.svg'
                    }
                    style={{ width: '30px', cursor: 'pointer' }}
                    alt="Source"
                  />
                </a>
              </IconButton>
              <IconButton>
                <a href={contractUrl()} target="_blank" rel="noopener noreferrer">
                  <img
                    src={
                      'https://K0nstantini.github.io/ton-args-web/tonscan.svg'
                    }
                    style={{ width: '30px', cursor: 'pointer' }}
                    alt="Contract"
                  />
                </a>
              </IconButton>
              <IconButton style={{ display: 'flex', alignItems: 'center' }} onClick={() => { }}>
                <img
                  src={
                    'https://K0nstantini.github.io/ton-args-web/question-mark.svg'
                  }
                  style={{ width: '30px', cursor: 'pointer' }}
                  alt="Question"
                />
              </IconButton>
            </Box>
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
                <MenuItem
                  onClick={() => window.open(siteUrl, "_blank", "noreferrer")} >
                  Site
                </MenuItem>
                <MenuItem
                  onClick={() => window.open(contractUrl(), "_blank", "noreferrer")} >
                  Contract
                </MenuItem>
                <MenuItem
                  onClick={() => window.open(sourceUrl, "_blank", "noreferrer")} >
                  Source
                </MenuItem>
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

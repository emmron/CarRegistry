import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, ThemeProvider, Box, Fade } from '@mui/material';
import CarList from './components/CarList';
import RegistrationStatus from './components/RegistrationStatus';
import { theme } from './theme';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssignmentIcon from '@mui/icons-material/Assignment';

function NavButton({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Button
      component={Link}
      to={to}
      color="inherit"
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
        transition: 'background-color 0.2s',
      }}
    >
      {icon}
      {children}
    </Button>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ 
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <AppBar 
            position="sticky" 
            elevation={0}
            sx={{ 
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'primary.dark'
            }}
          >
            <Container maxWidth="lg">
              <Toolbar disableGutters sx={{ gap: 2 }}>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    flexGrow: 1,
                    fontWeight: 700,
                    letterSpacing: '-0.5px'
                  }}
                >
                  Car Registry
                </Typography>
                <NavButton to="/" icon={<DirectionsCarIcon />}>
                  Inventory
                </NavButton>
                <NavButton to="/registration" icon={<AssignmentIcon />}>
                  Registration
                </NavButton>
              </Toolbar>
            </Container>
          </AppBar>
          
          <Box component="main" sx={{ flex: 1, py: 4 }}>
            <Container maxWidth="lg">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Fade in timeout={500}>
                      <div>
                        <CarList />
                      </div>
                    </Fade>
                  } 
                />
                <Route 
                  path="/registration" 
                  element={
                    <Fade in timeout={500}>
                      <div>
                        <RegistrationStatus />
                      </div>
                    </Fade>
                  } 
                />
              </Routes>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;

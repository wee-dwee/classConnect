import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ClassIcon from '@mui/icons-material/Class';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import student from './student.png';
import teacher from './teacher.png';

const pages = ['Join a Class', 'About Us', 'Contact Us'];
const pagesins = ['Create a Class', 'About Us', 'Contact Us'];
const settings = ['Profile', 'Edit Profile', 'Logout'];

function ResponsiveAppBar({ username,profileId }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [checkin,setcheckin]=useState(false); // Initialize checkin state to false
  const isMediumScreen = useMediaQuery('(max-width: 2100px)');
  const isSmallScreen = useMediaQuery('(max-width: 1700px)');
  const isExtraSmallScreen = useMediaQuery('(max-width: 1500px)');
  const isExtraexSmallScreen = useMediaQuery('(max-width: 1250px)');
  const isExtraexexSmallScreen = useMediaQuery('(max-width: 1000px)');
  const history = useHistory();

  useEffect(() => {
    // Fetch user profile when component mounts
    fetchUserProfile(profileId);
  }, [username]);

  const fetchUserProfile = async (profileId) => {
    try {
      // Assuming you have an API endpoint to fetch user profile data
      const response = await fetch(`http://localhost:3002/profiles/${profileId}`);
      const data = await response.json();
      setcheckin(data.isInstructor); // Update checkin state with fetched data
      setUserProfile(data); // Update userProfile state with fetched data
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCreateClass = () =>{
    history.push(`/createclass/${profileId}`);
    handleCloseUserMenu();
  }

  const handleJoinClass = () =>{
    history.push(`/join-class/${profileId}`);
    handleCloseUserMenu();
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleProfileClick = () => {
    history.push(`/seeprofile/${profileId}`);
    handleCloseUserMenu();
  };

  const handleEditProfile = () => {
    history.push(`/editprofile/${profileId}`);
    handleCloseUserMenu();
  };

  const handleLogout = () => {
    history.push("/");
    handleCloseUserMenu();
  };

  const handleAboutUs = () => {
    history.push(`/aboutus/${profileId}`);
    handleCloseUserMenu();
  };

  const handleContactUs = () => {
    history.push(`/contactus/${profileId}`);
    handleCloseUserMenu();
  };
  return (
    <AppBar position="sticky">
      <Container maxWidth="false">
        <Toolbar disableGutters>
          <ClassIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={`/home/${profileId}`}
            sx={{
              mr: isExtraexexSmallScreen ? '14%' : isExtraexSmallScreen? '18%' : isExtraSmallScreen ? '25%' : isSmallScreen ? '28%' : isMediumScreen ? '32%' : '37%',
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': {
                color: 'white', // Change color on hover
                textDecoration: 'none',
              },
            }}
          >
            ClassConnect
          </Typography>

          {/* Navigation Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {(checkin ? pagesins : pages).map((page) => (
                <MenuItem key={page} onClick={page==="Join a Class" ? handleJoinClass :page==="Create a Class" ? handleCreateClass : page==="About Us" ? handleAboutUs : page==="Contact Us" ? handleContactUs : handleCloseNavMenu} sx={{ marginLeft: 'auto' }}>
                  <Typography textAlign="center" sx={{ fontFamily: 'Arial, sans-serif' }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <ClassIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to={`/home/${profileId}`}
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': {
                color: 'white', // Change color on hover
                textDecoration: 'none',
              },
            }}
          >
            ClassConnect
          </Typography>

          {/* Pages */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, mx:'auto' }}>
            {(checkin ? pagesins : pages).map((page) => (
              <Button
                key={page}
                onClick={page==="Join a Class" ? handleJoinClass : page==="Create a Class" ? handleCreateClass : page==="About Us" ? handleAboutUs : page==="Contact Us" ? handleContactUs : handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'block',
                  fontFamily: 'serif',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Profile */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {userProfile && userProfile.image ? (
                  <Avatar
                    alt="User Avatar"
                    src={`http://localhost:3002/uploads/${userProfile.image}`}
                    sx={{
                      width: 40,
                      height: 40,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        width: 60,
                        height: 60,
                      },
                    }}
                  />
                ) : (
                  <Avatar
                    alt="User Avatar"
                    src={checkin ? teacher : student} // Use teacher.png if checkin is true, otherwise use student.png
                    sx={{
                      width: 40,
                      height: 40,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        width: 60,
                        height: 60,
                      },
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
            {/* User Menu */}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={setting === 'Profile' ? handleProfileClick : setting==='Edit Profile' ? handleEditProfile:setting==='Logout' ? handleLogout:handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;

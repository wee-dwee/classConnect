import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GithubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import Divider from '@mui/material/Divider';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Grid, Typography, Link } from '@mui/material';

const Footer = () => {
    const footerStyle = {
        backgroundColor: '#212330',
        color: '#fff',
        padding: 4,
        marginTop: 'auto',
    };

    const linkStyle = {
        color: '#ddd',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
        '&:hover': {
            color: 'grey',
        },
    };

    const socialMediaLinks = [
        {
            icon: <LinkedInIcon />,
            url: 'https://www.linkedin.com/your-placement-cell-link',
        },
        {
            icon: <InstagramIcon />,
            url: 'https://www.instagram.com/your-placement-cell-link',
        },
        {
            icon: <YouTubeIcon />,
            url: 'https://www.youtube.com/your-placement-cell-link',
        },
        {
            icon: <GithubIcon />,
            url: 'https://www.github.com/your-placement-cell-link',
        },
        {
            icon: <FacebookIcon />,
            url: 'https://www.facebook.com/your-placement-cell-link',
        },
        {
            icon: <TwitterIcon />,
            url: 'https://www.twitter.com/your-placement-cell-link',
        }
    ]

    return (
        <footer style={{ ...footerStyle, paddingBottom: '10px', paddingTop: '10px' }}>
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Link component={RouterLink} to="/aboutus" color="inherit">
                                <Typography variant="h6" gutterBottom sx={linkStyle}>
                                    About Placement Cell
                                </Typography>
                            </Link>
                        </Typography>
                        <Typography variant="body2">
                            The Placement Cell at DA-IICT is a concept in its own form. It comprises the placement office, faculty members, and student representatives aiming at the smooth functioning of the placement process.
                        </Typography>
                        <Divider sx={{ marginTop: '10px', marginBottom: '10px', backgroundColor: 'grey' }} />
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                            {socialMediaLinks.map((link, index) => (
                                <React.Fragment key={index}>
                                    <Link href={link.url} target="_blank" rel="noopener noreferrer" sx={linkStyle}>
                                        {link.icon}
                                    </Link>
                                    {index !== socialMediaLinks.length - 1 && <Divider orientation="vertical" flexItem style={{ backgroundColor: 'grey', marginLeft: '10px', marginRight: '10px' }} />}
                                </React.Fragment>
                            ))}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Link component={RouterLink} to="/contactus" color="inherit">
                                <Typography variant="h6" gutterBottom sx={linkStyle}>
                                    Contact Us
                                </Typography>
                            </Link>
                        </Typography>
                        <Typography variant="body2">
                            Dhirubhai Ambani Institute of Information and Communication Technology, Near Indroda Circle,
                            Gandhinagar - 382 007, Gujarat (India)
                            {/* <br />
                            <br /> */}
                            <Divider sx={{ marginTop: '10px', marginBottom: '10px', backgroundColor: 'grey' }} />
                            Mr. Admin
                            <br />
                            <Link style={{ textDecoration: 'none', color: 'grey' }} href="mailto:g28.placement@gmail.com">g28.placement@gmail.com</Link>
                            <br />
                            (O) +91 81600 04051
                            <br />
                            (M) +91 72650 68992
                        </Typography>

                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <Typography variant="h6" gutterBottom>
                            External Links
                        </Typography>
                        <Typography variant="body2">
                            <Link style={{ textDecoration: 'none', color: 'grey' }} F href="https://www.daiict.ac.in/placement-brochure">PLACEMENT BROCHURE</Link>
                            <br />
                            <br />
                            2023 - 2024 © Placement Cell, DA-IICT.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </footer>
    );
};

export default Footer;
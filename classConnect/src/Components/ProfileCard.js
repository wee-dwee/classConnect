import React from 'react';

const ProfileCard = ({ name, username, imageSrc, socialLinks }) => {
    return (
        <div className="col-md-12 col-lg-6 col-xl-4 mb-4">
            <div className="card1" style={{ borderRadius: '15px' }}>
                <div className="card-body text-center">
                    <div className="mt-3 mb-4">
                        <img src={imageSrc} className="rounded-circle img-fluid" style={{ maxWidth: '100%', height: 'auto' }} alt="Profile Image" />
                    </div>
                    <h4 className="mb-2">{name}</h4>
                    <p className="text-muted mb-4">@{username}</p>
                    <div className="mb-4 pb-2">
                        {socialLinks.map((link, index) => (
                            <a key={index} href={link.url}>
                                <button type="button" className="btn btn-outline-primary btn-floating">
                                    View Profile
                                </button>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
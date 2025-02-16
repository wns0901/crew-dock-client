import React from 'react';

const Footer = () => {
    const footerStyle = {
        backgroundColor: '#d3d3d3',
        // marginTop: '50px',
        textAlign: 'center',
        width: '100%',
        height: '50px',
        marginTop: 'auto' // ✅ Footer를 컨텐츠 아래에 붙이도록 설정
    };

    return (
        <footer style={footerStyle}>
            <p>© 2023 Your Company. All rights reserved.</p>
        </footer>
    );
};

export default Footer;

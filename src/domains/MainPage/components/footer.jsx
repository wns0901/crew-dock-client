import React from 'react';

const Footer = () => {
    const footerStyle = {
        backgroundColor: '#d3d3d3',
        textAlign: 'center',
        width: '100%',
        height: '50px',
        marginTop: 'auto' // ✅ Footer를 컨텐츠 아래에 붙이도록 설정
    };

    const textStyle = {
        marginTop: '-0.3px' // ⬅️ p 태그만 위로 이동
    };

    return (
        <footer style={footerStyle}>
            <p style={textStyle}>Contact crewdock0@gmail.com<br/>
            Copyright crewdock. All rights reserved</p>
        </footer>
    );
};

export default Footer;

import React from 'react';
import styled from 'styled-components';
import logo from '../../assets/images/text_logo.svg';

const TitleWrapper = styled.div`
  margin-bottom: 50px;
  color: #000000;
  user-select: none;
`;

const Logo = styled.img`
  -webkit-user-drag: none;
`;

const LoginTitle = () => {
    return (
        <TitleWrapper>
            <Logo src={logo} alt={'logo'}/>
        </TitleWrapper>
    )
};

export default LoginTitle;

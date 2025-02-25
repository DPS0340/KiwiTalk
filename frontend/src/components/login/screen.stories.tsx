import { StoryFn } from '@storybook/react';
import styled from 'styled-components';

import { LoginScreen } from './screen';

export default {
  title: 'KiwiTalk/login/LoginScreen',
  component: LoginScreen,
};

const Screen = styled(LoginScreen)`
  border: 1px solid #000000;
  width: 1280px;
  height: 720px;
`;

const InnerForm = styled.div`
  width: 100%;
  height: 300px;
  outline: 1px solid black;
`;

const Template: StoryFn<React.PropsWithChildren> = () => {
  return <Screen>
    <InnerForm />
  </Screen>;
};

export const Default = Template.bind({});
Default.args = {};

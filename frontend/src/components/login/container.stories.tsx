import { StoryFn } from '@storybook/react';
import styled from 'styled-components';

import { LoginContainer } from './container';

export default {
  title: 'KiwiTalk/login/LoginContainer',
  component: LoginContainer,
};

type BackgroundProp = {
  width: number;
  height: number;
};

const Template: StoryFn<BackgroundProp> = (args) => {
  const Container = styled(LoginContainer)`
    width: ${args.width}px;
    height: ${args.height}px;
    border: 1px solid #000000;
  `;

  return <Container />;
};

export const PcW16H9 = Template.bind({});
PcW16H9.args = {
  width: 1920,
  height: 1080,
};

export const PcW5H4 = Template.bind({});
PcW5H4.args = {
  width: 1280,
  height: 1024,
};

export const Windowed = Template.bind({});
Windowed.args = {
  width: 1280,
  height: 720,
};

export const Mobile = Template.bind({});
Mobile.args = {
  width: 1080,
  height: 1920,
};

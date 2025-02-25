import { Children, PropsWithChildren, ReactNode } from 'react';
import styled from 'styled-components';

export type SideMenuProp = {
  name: string,
  headContents?: ReactNode,
  className?: string,
};

export const SideMenu = ({
  name,
  headContents,
  className,

  children,
}: PropsWithChildren<SideMenuProp>) => {
  return <Container className={className}>
    <Head>
      <Name>{name}</Name>
      {headContents && <HeadContainer>{headContents}</HeadContainer>}
    </Head>
    {
      Children.count(children) > 0 ?
        <ContentList>
          {Children.map(children, (value, idx) => {
            return <ContentItem key={idx}>{value}</ContentItem>;
          })}
        </ContentList> : null
    }
  </Container>;
};

const Container = styled.div`
  padding: 1rem 1rem 0px 1rem;
  
  box-sizing: border-box;
`;

const Head = styled.div`
  display: flex;

  align-items: center;
`;

const Name = styled.span`
  font-size: 1.5rem;

  font-weight: bold;

  user-select: None;

  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeadContainer = styled.div`
  margin-left: auto;
`;

const ContentList = styled.ul`
  margin: 1rem 0px 0px 0px;
  padding: 0px;

  list-style-type: none;
`;

const ContentItem = styled.li`
  margin-top: 0.5rem;
  padding 0px;
`;

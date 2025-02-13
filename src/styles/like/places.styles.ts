import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #0c004b;
  min-height: 100vh;
  padding: 40px;
  width: 100vw;
  position: relative;
`;

export const IconContainer = styled.div`
  position: absolute;
  top: 75px;
  right: 430px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const IconImage = styled.img``;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 960px;
  margin: 0 208px;
`;

export const Title = styled.h1`
  color: #fff;
  font-family: 'Gothic A1';
  font-size: 38px;
  font-weight: 600;
  margin: 48px 0;
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 0px;
`;

export const Tab = styled.button<{ active?: boolean }>`
  width: 194px;
  height: 82px;
  border: none;
  background-color: ${(props) => (props.active ? '#fff' : '#CCC')};
  color: ${(props) => (props.active ? '#000' : '#464654')};
  border-radius: 20px 20px 0px 0px;
  cursor: pointer;
  text-align: center;
  font-family: 'Gothic A1';
  font-size: 20px;
  font-weight: 600;
`;

export const RouteListContainer = styled.div`
  background: white;
  width: 1197px;
  border-radius: 0px 20px 20px 20px;
  padding: 45px 72px;
`;

export const ListHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

export const ListTitle = styled.h2`
  color: #000;
  font-family: 'Gothic A1';
  font-size: 30px;
  font-weight: 700;
`;

export const HeaderDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #464654;
  margin: 16px 0;
`;

export const ListActions = styled.div`
  display: flex;
  gap: 8px;
  color: #666;
  font-size: 14px;
  margin-left: 900px;

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    padding: 0;

    &:hover {
      color: #333;
    }
  }
`;

export const RouteItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #e9e2ff;
  margin-bottom: 8px;
  border-radius: 15px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0ff;
  }
`;

export const RouteDetails = styled.div`
  display: flex;
  align-items: center;
`;

export const RadioButton = styled.div<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid #7b66ff;
  border-radius: 50%;
  margin-right: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.checked ? '#7B66FF' : 'transparent')};

  &::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: white;
    display: ${(props) => (props.checked ? 'block' : 'none')};
  }
`;

export const RouteTitle = styled.span`
  flex: 1;
  color: #000;
  font-family: 'Gothic A1';
  font-size: 24px;
  font-weight: 600;
`;

export const RouteAddress = styled.span`
  font-family: 'Gothic A1';
  font-size: 20px;
  font-weight: 500;
  color: #000;
  margin-top: 4px;
`;

export const StarIcon = styled.img``;

export const LoadMoreButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;

  &:hover {
    background-color: #e9e9e9;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

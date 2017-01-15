import styled, {css} from 'styled-components';

export const container = css`
  max-width: 1400px;
  width: 90vw;
  margin: 0 auto;
`;

const Container = styled.div`
  ${container}
  height: 100%;
`;

export default Container;

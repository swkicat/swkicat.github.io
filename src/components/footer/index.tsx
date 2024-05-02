import React from 'react';

import * as S from './styled';

const Footer: React.FC = () => {
  return (
    <S.Wrapper>
      <S.Footer>
        © {new Date().getFullYear()}
        &nbsp;powered by stitch
      </S.Footer>
    </S.Wrapper>
  );
};

export default Footer;
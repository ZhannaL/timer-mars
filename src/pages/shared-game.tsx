import { parseQuery } from 'components/ModalQRCode/parseQuery';
import { PageProps, navigate } from 'gatsby';

const SharedGame = (props: PageProps): JSX.Element | null => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props) {
    parseQuery(props);
    navigate('/game/');
  } else {
    navigate('/');
  }

  return null;
};

// eslint-disable-next-line import/no-default-export
export default SharedGame;

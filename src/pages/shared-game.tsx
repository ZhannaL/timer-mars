import { parseQuery } from 'components/ModalQRCode/parseQuery';
import { PageProps, navigate } from 'gatsby';

const SharedGame = (props: PageProps): JSX.Element | null => {
  // eslint-disable-next-line react/destructuring-assignment
  const gamedataParam = new URLSearchParams(props.location.search);
  const gamedata = gamedataParam.get('gd');

  if (gamedata) {
    parseQuery(gamedata);
    navigate('/game/');
  } else {
    navigate('/');
  }

  return null;
};

// eslint-disable-next-line import/no-default-export
export default SharedGame;

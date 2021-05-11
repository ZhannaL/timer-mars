import classNames from 'classnames';
import { GameSessionInfo } from 'domain/GameSessionType';
import { useEffect, useState } from 'react';
import * as styles from './allPlayers.module.css';
import { OtherPlayer } from './OtherPlayer';

type Props = {
  currGameSessionState: Array<GameSessionInfo>;
  generation: number;
};

export const AllPlayers = ({ currGameSessionState, generation }: Props): JSX.Element => {
  const [players, setPlayers] = useState<Array<GameSessionInfo>>([]);
  const [prevGeneration, setPrevGeneration] = useState(1);
  const [animationState, setAnimationState] = useState<'fadeIn' | 'none' | 'fadeOut' | 'scroll'>(
    'none',
  );

  useEffect(() => {
    if (generation !== prevGeneration) {
      setAnimationState('fadeIn');
      setTimeout(() => {
        setAnimationState('scroll');
        setTimeout(() => {
          setPlayers(currGameSessionState);
          setAnimationState('fadeOut');
          setTimeout(() => {
            setAnimationState('none');
          }, 500);
        }, 500);
      }, 500);
    } else {
      setPlayers(currGameSessionState);
    }
    setPrevGeneration(generation);
  }, [generation, currGameSessionState]);

  const style = {
    '--element-width': ` -${100 / currGameSessionState.length}%`,
  } as React.CSSProperties;

  return (
    <div
      style={style}
      className={classNames(styles.otherPlayers, animationState === 'scroll' && styles.scroll)}
    >
      {players.map((otherUser, index) => (
        <OtherPlayer
          key={otherUser.color}
          user={otherUser}
          length={currGameSessionState.length}
          animationState={
            // eslint-disable-next-line no-nested-ternary
            (animationState === 'fadeIn' || animationState === 'scroll') && index === 0
              ? 'fadeIn'
              : animationState === 'fadeOut' && index === players.length - 1
              ? 'fadeOut'
              : 'none'
          }
          isAnimated={animationState !== 'none'}
        />
      ))}
    </div>
  );
};

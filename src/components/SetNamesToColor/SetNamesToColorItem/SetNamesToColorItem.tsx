/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import classnames from 'classnames';
import { Select, MenuItem } from '@material-ui/core';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { colorToPick } from 'styles/colorsToPick';
import { useFriends } from 'Provider/FriendsContex';
import { GameInfo } from 'domain/GameType';
import { DraggableProvided } from 'react-beautiful-dnd';
import * as styles from './setNamesToColorItem.module.css';

type Props = {
  nameAndColor: GameInfo;
  onChange: (newName: string) => unknown;

  provided: DraggableProvided;
};

export const SetNamesToColorItem = ({ nameAndColor, onChange, provided }: Props): JSX.Element => {
  const [friendsState] = useFriends();

  const [person, setPerson] = useState(nameAndColor.name);
  const handleChangeColor = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPerson(event.target.value as string);
    onChange(event.target.value as string);
  };

  const hexColor = colorToPick.find((el) => el.name === nameAndColor.color)?.hex;
  return (
    <div
      className={styles.item}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
    >
      <svg width="50" height="50">
        <rect x="5" y="5" rx="5" ry="5" width="40" height="40" fill={hexColor} />
      </svg>

      <Select
        value={person}
        onChange={handleChangeColor}
        className={classnames(styles.select, person === 'NoOne' ? styles.noneSelecItem : '')}
      >
        <MenuItem value="NoOne" className={styles.noneSelecItem}>
          <em>NoOne</em>
        </MenuItem>
        {friendsState.map((friend) => (
          <MenuItem key={friend.id} value={friend.name}>
            {friend.name}
          </MenuItem>
        ))}
      </Select>

      <DragIndicatorIcon />
    </div>
  );
};

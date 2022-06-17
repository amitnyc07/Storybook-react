import React, { useState, useEffect } from 'react';
import { useStateValue } from 'state';
import styles from './DateTimePicker.module.scss';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { CalendarIcon, PencilIcon } from '../../Icons';
import clsx from 'clsx';
import { useRef } from 'react';
import { useClickOutside } from 'hooks';

const DateTimePicker = ({ value: initValue, onChange = () => null }) => {
  const dtPickerRef = useRef(null);
  const { state: { deviceSize } } = useStateValue();
  const [value, setValue] = useState(new Date());
  const [isHovered, setHovered] = useState(false);
  const [isOpened, setOpened] = useState(false);
  const [pickerMode, setPickerMode] = useState('date-only');

  useClickOutside(dtPickerRef, () => setOpened(false));

  useEffect(() => setValue(new Date(initValue)), [initValue]);

  useEffect(() => setPickerMode(['xs', 'sm', 'md'].includes(deviceSize) ? 'date-only' : 'date-time'), [deviceSize]);

  const handleChange = value => {
    setValue(value);

    onChange(value);
  };

  return (
    <div className={styles.picker__wrapper}>
      <button
        className={styles.picker__placeholder}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setOpened(true)}
      >
        <CalendarIcon className={styles.icon__calendar} />
        <span
          className={styles.picker__placeholder__date}
          dangerouslySetInnerHTML={{ __html: moment(value).format('MMMM D, YYYY') }}
        />
        <span
          className={styles.picker__placeholder__time}
          dangerouslySetInnerHTML={{ __html: moment(value).format('H:mm A') }}
        />
        <PencilIcon className={clsx(styles.icon__pencil, isHovered && styles['icon__pencil--visible'])} />
      </button>

      {isOpened ? (
        <div ref={dtPickerRef} className={styles.picker}>
          <DatePicker
            selected={value}
            onChange={handleChange}
            inline
            showTimeSelect={pickerMode === 'date-time'}
            timeIntervals={15}
          />
        </div>
      ) : null}
    </div>
  );
};

export default DateTimePicker;
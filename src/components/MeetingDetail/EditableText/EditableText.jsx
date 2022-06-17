import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import styles from './EditableText.module.scss';
import { PencilIcon, CircleCheckOutlinedIcon } from 'components/Icons';
import { useEffect } from 'react';

const EditableText = ({
  classNames = { container: '', form: '', input: '', icon: '' },
  value: initValue = '',
  onChange = () => null,
  isTitle=false
}) => {
  const [isHovered, setHovered] = useState(false);
  const [value, setValue] = useState(initValue);
  const [isUpdating, setUpdating] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => setValue(initValue), [initValue]);

  useEffect(() => {
    console.log(value);
  }, [value])

  const handleSubmit = e => {
    e.preventDefault();
    if (value === initValue) return;

    setUpdating(true);

    setTimeout(() => setUpdating(false), 1000);

    onChange(value);
  };

  const handleTitleUpdate = (e) => {
    e.preventDefault();
    const updatedTitle = e.target.innerText;
    console.log(updatedTitle);
    if (updatedTitle === initValue) return;

    setUpdating(true);

    setTimeout(() => setUpdating(false), 1000);

    onChange(updatedTitle);
  }

  return (
    <div
      className={clsx(classNames.container, styles.editable_text__wrapper)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <form className={clsx(classNames.form, styles.editable_text__form)} onSubmit={handleSubmit}>
      {isTitle ?
        <div
          contentEditable
          className={clsx(classNames.input, styles.editable_text_textarea)}
          onBlur={handleTitleUpdate}
          suppressContentEditableWarning={true}>{value}</div>
          :
        <input
          type='text'
          className={clsx(classNames.input, styles.editable_text)}
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={handleSubmit}
        />
      }

        {isUpdating ? (
          <CircleCheckOutlinedIcon className={clsx(classNames.icon, styles.icon, styles['icon--visible'])} />
        ) : (
          <PencilIcon className={clsx(classNames.icon, styles.icon, isHovered && styles['icon--visible'])} />
        )}

      </form>
    </div>
  )
};

export default EditableText;
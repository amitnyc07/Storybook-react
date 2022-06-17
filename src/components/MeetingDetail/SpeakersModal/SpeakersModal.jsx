import React from 'react';
import { Modal } from 'components';
import { CloseCircleIcon } from 'components/Icons';
import EditableText from '../EditableText';
import styles from './SpeakersModal.module.scss';

const SpeakersModal = ({
  show = false, onClose = () => null,
  participants = [],
  onChange = () => null
}) => {
  return (
    <Modal
      classNames={{ modal: styles.modal }}
      show={show} onClose={onClose}
    >
      <div
        className={styles.modal__title}
        dangerouslySetInnerHTML={{ __html: 'Speakers' }}
      />

      <button className={styles.button__close} onClick={onClose}>
        <CloseCircleIcon />
      </button>

      <div className={styles.participant__wrapper}>
        {participants.map((participant, pIndex) => (
          <EditableText
            classNames={{
              container: styles.participant,
              form: styles.participant__form,
              input: styles.participant__input,
              icon: styles.participant__icon,
            }}
            key={pIndex}
            value={participant}
            onChange={value => onChange(pIndex, value)}
          />
        ))}
      </div>
    </Modal>
  );
};

export default SpeakersModal;
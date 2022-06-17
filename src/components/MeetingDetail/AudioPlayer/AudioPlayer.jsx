import React, { useEffect, useState, forwardRef, useRef } from 'react';
import styles from './AudioPlayer.module.scss';
import { mstToTime } from 'utils';
import { PlayerPlayIcon, PlayerPauseIcon, PlayerRewindIcon, PlayerForwardIcon } from 'components/Icons';
import clsx from 'clsx';
import { useClickOutside } from 'hooks';
import { useStateValue } from 'state';

const AudioPlayer = forwardRef(({ audio, onCanplayThrough = () => null }, ref) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [canPlay, setCanPlay] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const rateMenuRef = useRef(null);
  const [rate, setRate] = useState(1);
  const [isRateMenuOpened, setRateMenuOpened] = useState(false);
  const { state: { isNavOpened } } = useStateValue();

  useClickOutside(rateMenuRef, () => setRateMenuOpened(false));

  useEffect(() => {
    if (!audio?.src || !ref) return;

    ref.current = document.createElement('audio')
    ref.current.src = audio.src;
    ref.current.type = audio.type;
    ref.current.onplay = () => setPlaying(true);
    ref.current.onpause = () => setPlaying(false);
    ref.current.ontimeupdate = () => setCurrentTime(ref.current.currentTime * 1000);
    ref.current.oncanplaythrough = () => {
      setCanPlay(true);
      onCanplayThrough(ref.current.duration * 1000)
      setDuration(ref.current.duration * 1000);
      setCurrentTime(ref.current.currentTime * 1000);
    };
    ref.current.playbackRate = 1;
    ref.current.load();
  }, [audio]);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.playbackRate = rate;
    setRateMenuOpened(false);
  }, [rate]);

  const handleClickPlay = e => {
    e.preventDefault();

    if (isPlaying) ref.current.pause();
    else ref.current.play();
  };

  const handleClickRewind = e => {
    e.preventDefault();

    ref.current.currentTime -= 10;
  };

  const handleClickForward = e => {
    e.preventDefault();
    ref.current.currentTime += 10;
  };

  if (!canPlay) return <React.Fragment />;

  return (
    <div className={clsx(styles.container, isNavOpened && styles['container--opened'])}>
      <div
        className={styles.progress_bar}
        style={{ '--progress_bar__percentage': `${(currentTime / duration * 100).toFixed(1)}%` }}
      />

      <div className={styles.main}>
        <div className={styles.time}>
          <div
            className={styles.time__current}
            dangerouslySetInnerHTML={{ __html: mstToTime(currentTime) }}
          />

          <span dangerouslySetInnerHTML={{ __html: '&nbsp;/&nbsp;' }} />

          <div
            className={styles.time__duration}
            dangerouslySetInnerHTML={{ __html: mstToTime(duration) }}
          />
        </div>

        <div className={styles.control__wrapper}>
          <div ref={rateMenuRef} className={styles.control__rate}>
            <button dangerouslySetInnerHTML={{ __html: `${rate}x` }} onClick={() => setRateMenuOpened(!isRateMenuOpened)} />

            <div className={clsx(
              styles.control__rate__menu,
              styles[`control__rate__menu--${isRateMenuOpened ? 'opened' : 'closed'}`]
            )}>
              {[0.5, 1, 1.5, 2].map((rate, rIndex) => (<button key={rIndex}
                dangerouslySetInnerHTML={{ __html: `${rate}x` }}
                onClick={() => setRate(rate)}
              />))}
            </div>
          </div>

          <button
            className={styles.control__rewind}
            onClick={handleClickRewind}
          ><PlayerRewindIcon /></button>

          <button
            className={clsx(styles.control__play, styles[`control__play--${isPlaying ? 'playing' : 'paused'}`])}
            onClick={handleClickPlay}
          >{isPlaying ? <PlayerPauseIcon /> : <PlayerPlayIcon />}</button>

          <button
            className={styles.control__forward}
            onClick={handleClickForward}
          ><PlayerForwardIcon /></button>
        </div>
      </div>
    </div>
  );
});

export default AudioPlayer;
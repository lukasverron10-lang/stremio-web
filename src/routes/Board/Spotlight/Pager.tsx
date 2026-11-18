// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import styles from './Pager.less';

type Props = {
    className?: string,
    id: string,
    labels: string[],
    index: number,
    stopped: boolean,
    onSelect: (slide: number) => void,
    onPrevious: () => void,
    onNext: () => void,
    onTogglePause: () => void,
    onCycle: () => void,
};

const Pager = ({ className, id, labels, index, stopped, onSelect, onPrevious, onNext, onTogglePause, onCycle }: Props) => {
    const { t } = useTranslation();

    const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, slide: number) => {
        let next = slide;
        if (event.key === 'ArrowRight') {
            next = (slide + 1) % labels.length;
        } else if (event.key === 'ArrowLeft') {
            next = (slide - 1 + labels.length) % labels.length;
        } else if (event.key === 'Home') {
            next = 0;
        } else if (event.key === 'End') {
            next = labels.length - 1;
        } else {
            return;
        }

        event.preventDefault();
        const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
        tabs?.[next]?.focus();
        onSelect(next);
    };

    return (
        <div className={classNames(className, styles['pager'], { [styles['stopped']]: stopped })}>
            <Button className={styles['control']} aria-label={t('BOARD_SPOTLIGHT_PREVIOUS')} onClick={onPrevious}>
                <Icon className={styles['icon']} name={'chevron-back'} />
            </Button>
            <div className={styles['segments']} role={'tablist'} aria-label={t('BOARD_SPOTLIGHT')}>
                {
                    labels.map((label, slide) => (
                        <Button
                            key={slide}
                            className={classNames(styles['segment'], { [styles['on']]: slide === index })}
                            id={`${id}-tab-${slide}`}
                            role={'tab'}
                            tabIndex={slide === index ? 0 : -1}
                            aria-selected={slide === index}
                            aria-controls={`${id}-${slide}`}
                            aria-label={label}
                            onClick={() => onSelect(slide)}
                            onKeyDown={(event) => onTabKeyDown(event, slide)}
                        >
                            <div className={styles['bar']}>
                                <div className={styles['fill']} onAnimationEnd={slide === index ? onCycle : undefined} />
                            </div>
                        </Button>
                    ))
                }
            </div>
            <Button className={styles['control']} aria-label={t('BOARD_SPOTLIGHT_NEXT')} onClick={onNext}>
                <Icon className={styles['icon']} name={'chevron-forward'} />
            </Button>
            <Button className={styles['control']} aria-label={stopped ? t('BOARD_SPOTLIGHT_RESUME') : t('BOARD_SPOTLIGHT_PAUSE')} onClick={onTogglePause}>
                <Icon className={styles['icon']} name={stopped ? 'play' : 'pause'} />
            </Button>
        </div>
    );
};

export default Pager;

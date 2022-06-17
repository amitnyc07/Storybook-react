import clsx from 'clsx';
import React, { useRef } from 'react';
import { CreateCheckout, CreateCustomerPortal } from 'utils';
import styles from './Subscription.module.scss';
import { CSSTransition } from 'react-transition-group';

const Subscription = ({
  plan={},
  price={},
  stripeRole='',
  classNames = {},
  children,
  isCurrent = false
}) => {
  
  const nodeRef = useRef(null);
  
  return (
    <CSSTransition
      in
      nodeRef={nodeRef}
      classNames={{
        appear: styles['fade--enter']
      }}
      appear
    >
    <div ref={nodeRef} className={clsx(classNames.container, styles.subscription__wrapper)}>
      <div className={clsx(classNames.subscription, styles.subscription)}>
        <div className={styles.subscription__box}>
          <div className={styles.subscription__label} dangerouslySetInnerHTML={{ __html: plan.name }} />

          {plan.description.split(',').map((service, index) => <div
            key={index}
            className={styles.subscription__service}
            dangerouslySetInnerHTML={{ __html: service }}
          />)}
        </div>

        <div className={styles.subscription__box}>
          {isCurrent ? (
            <div
              className={styles.subscription__current}
              dangerouslySetInnerHTML={{ __html: 'Current Plan' }} />
          ) : (
            <button
              type='button'
              className={styles.subscription__amount}
              value={price.price_id}
              onClick={async(e) => stripeRole === "free" ? await CreateCheckout(e.target.value) : await CreateCustomerPortal()}
              dangerouslySetInnerHTML={{ __html: `$${price.unit_amount / 100} Monthly`}}
            />
          )}
        </div>
      </div>
      {plan.metadata.firebaseRole === stripeRole ? (
        <div className={styles.subscription__remaining}>
          <span dangerouslySetInnerHTML={{ __html: '100' }} />
        </div>
      ) : null}
      </div>
      </CSSTransition>
  );
};

export default Subscription;
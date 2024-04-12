import { TonConnectButton } from '@tonconnect/ui-react';
import styles from '../css/TonConnect.module.css'

export const TonConnectBtn = () => {
	return (
		<div className={styles.tonConnect}>
      <TonConnectButton />
		</div>
	);
};


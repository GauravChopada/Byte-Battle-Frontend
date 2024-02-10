import Image from 'next/image';

import styles from './Avatar.module.scss'

type Props = {
  src?: string;
  name?: string | null;
};

const Avatar = ({ src, name = '' }: Props) => {
  const initials = name?.split(' ').map((n) => n[0]).join('') || 'XX'
  return (
    <div className={styles.Avatar}>
      {src && <Image unoptimized width={20} height={20} className={styles.Avatar__Image} src={src} alt='profile' />}
      {!src && <span className={styles.Avatar__Initials}>{initials}</span>}
    </div>
  )
}

export default Avatar

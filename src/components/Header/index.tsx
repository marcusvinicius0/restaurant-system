import { useContext, useState } from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';

import { BiMenuAltRight } from 'react-icons/bi';
import { FiLogOut, FiX } from 'react-icons/fi';

import { AuthContext } from '../../contexts/AuthContext';

export function Header() {
    const { signOut } = useContext(AuthContext);
    const [showMenu, setShowMenu] = useState(false);

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/dashboard">
                    <img src="/logo2.png" width={170} height={50} />
                </Link>

                <nav className={ showMenu ? styles.menuOn : styles.menuNav}>
                    
                        <Link href="/category">
                            <a>Categoria</a>
                        </Link>

                        <Link href="/product">
                            <a>Cardápio</a>
                        </Link>

                        <button onClick={signOut}>
                            <FiLogOut color="#FFF" size={24} />
                        </button>
                   
                </nav>

                <span onClick={() => setShowMenu(!showMenu)}>
                    {showMenu ? <FiX size={40} color="var(--red-900)" />
                        :
                        <BiMenuAltRight size={40} color="var(--red-900)" />
                    }
                </span>
            </div>
        </header>
    )
}
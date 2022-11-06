import Image from 'next/image';
import styles from '../styles/Products.module.scss'

export function ProductCard({ product }) {
    return (
        <div className={styles.productCard}>
            <div className={styles.imageContainer}>
                <Image
                    src={"https:" + product.node.thumbnailImage.file.url}
                    alt="Picture of the author"
                    width={300}
                    height={300}
                />
            </div>
            <div className={styles.name}>{product.node?.name}</div>
            <div className={styles.price}>{product.node?.shopifyProductEu?.variants?.edges[0]?.node?.price}</div>
        </div>
    )
}   
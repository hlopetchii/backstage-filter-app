import styles from '../styles/Pagination.module.scss'

export function Pagination({page, setPage, totalPages}) {
    return (
        totalPages && totalPages > 1 &&
        <div className={styles.paginationContainer}>
            <div className={styles.paginationButtons}>
                <button disabled={page == 1} className={styles.buttonPrev} onClick={() => {setPage(prev => prev - 1)}}>Prev</button>
                <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
                <button disabled={page == totalPages} className={styles.buttonNext} onClick={() => {setPage(prev => prev + 1)}}>Next</button>
            </div>
        </div>
    )
}   
import styles from '../styles/Filter.module.scss'
import { useState } from "react";
import Select from 'react-select'

export default function FilterPanel({filtersHandler, filterOptions}) {
    const [opened, setOpened] = useState(false);
    const [color, setColor] = useState([]);
    const [priceFrom, setPriceFrom] = useState("");
    const [priceTo, setPriceTo] = useState("");
    const [category, setCategory] = useState([]);

    const togleFilterPannel = () => {
        setOpened(prev => !prev);
    }

    const clearFilters = () => {
        setColor([]);
        setPriceFrom("");
        setPriceTo("");
        setCategory([]);
    }

    const applyFilters = () => {
        filtersHandler({
            color: color.map(elem => elem.value),
            priceFrom,
            priceTo,
            category: category.map(elem => elem.value)
        });
        setOpened(false);
    }

    return (
        <>
            {opened && <div className={styles.disglobal} />}
            <div className={`${styles.filterContainer} ${opened ? styles.expanded : styles.collapsed}`} onClick={() => { !opened && togleFilterPannel() }}>
                <span className={styles.filterButton} onClick={() => { opened && togleFilterPannel() }}>{opened ? "Close" : "Filters"}</span>
                <div className={styles.filterContent}>
                    <div className={styles.fieldContainer}>
                        <label>Category</label>
                        <Select
                            options={filterOptions?.tags?.map(tag => ({value: tag, label: tag}))}
                            isMulti
                            value={category}
                            placeholder="Select"
                            onChange={setCategory}
                        ></Select>
                    </div>
                    <div className={styles.fieldContainer}>
                        <label>Color</label>
                        <Select
                            options={filterOptions?.colors?.map(color => ({value: color, label: color}))}
                            isMulti
                            value={color}
                            placeholder="Select"
                            onChange={setColor}
                        ></Select>
                    </div>
                    <div className={styles.fieldContainer}>
                        <label>Price from</label>
                        <input
                            type="number"
                            name="priceFrom"
                            className={styles.currencyInput}
                            placeholder="000.00"
                            value={priceFrom}
                            onChange={(e) => setPriceFrom(e.target.value)}>
                        </input>
                    </div>
                    <div className={styles.fieldContainer}>
                        <label>Price to</label>
                        <input
                            type="number"
                            name="priceTo"
                            className={styles.currencyInput}
                            placeholder="000.00"
                            value={priceTo}
                            onChange={(e) => setPriceTo(e.target.value)}>
                        </input>
                    </div>
                    <div className="w-full flex justify-between mt-10">
                        <button type="button" className={styles.buttonClear} onClick={clearFilters}>
                            Clear
                        </button>
                        <button type="button" className={styles.buttonApply} onClick={applyFilters}>
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
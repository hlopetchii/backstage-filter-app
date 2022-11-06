import styles from '../styles/Products.module.scss'
import { ProductCard } from "./productCard"
import uuid from 'react-uuid';
import FilterPanel from './filterPanel';
import { useState } from 'react'
import useSWR from 'swr'
import { Pagination } from './pagination';
import { Loader } from './loader';

export function Products() {
    const[filters, setFilters] = useState({
        color: [],
        priceFrom: "",
        priceTo: "",
        category: []
    });
    const[page, setPage] = useState(1);

    // fetcher the almighty. used for SWR
    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
    // Building url for the request, adding querry params from filters and page
    const createUrl = () => {
        let url = "api/getProducts";
        let querryParams = [];
        if(page){
            querryParams.push(`page=${page}`);
        }
        if(filters.color && filters.color.length){
            querryParams.push(`color=${encodeURIComponent(filters.color.toString())}`);
        }
        if(filters.priceFrom){
            querryParams.push(`priceFrom=${filters.priceFrom}`);
        }
        if(filters.priceTo){
            querryParams.push(`priceTo=${filters.priceTo}`);
        }
        if(filters.category && filters.category.length){
            querryParams.push(`category=${encodeURIComponent(filters.category.toString())}`);
        }
        if(querryParams.length){
            url = url + "?" + querryParams.join("&");
        }
        return url;
    }

    // api request
    const { data, error } = useSWR(createUrl(), fetcher);

    // filters callback funtion
    const filtersHandler = (filters) => {
        setFilters(filters);
        setPage(1);
    }

    return (
        <>
            {!data && !error && <Loader/>}
            <FilterPanel filtersHandler={filtersHandler} filterOptions={data?.filterOptions} />
            {data?.products?.length == 0 && <div className={styles.noDataDiv}>No products found</div>}

            <div className={styles.productsContainer}>
                {error && "Fetch error"}
                { 
                    data?.products.map(product => (
                        <ProductCard key={uuid()} product={product} />
                    ))
                }
            </div>
            <Pagination page={page} setPage={setPage} totalPages={data?.totalPages}/>
        </>
    )
}
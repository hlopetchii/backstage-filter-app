import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {   ``
  const jsonData = await getData(req);
  res.status(200).json(jsonData);
}

// Made a separate function to use it in getServersideProps.
export async function getData(req) {
  const itemsPerPage = 20;
  const jsonDirectory = path.join(process.cwd(), 'json');  // Find the absolute path of the json directory
  const response = await fs.readFile(jsonDirectory + '/data.json', 'utf8');  // Read the json data file data.json. Should be an external api or DB request, but alas
  const products = JSON.parse(response)?.data?.allContentfulProductPage?.edges || [];  // Extracting only the products
  const filterOptions = getFilterOptions(products);  // getting the options for the filter selects. Was thinking to make this only on the first call, but then realized that product list can be updated and the new tags/colors should appear in filters
  let filteredProducts = filterProducts(products, req?.query); // applying query filters
  const totalPages = Math.ceil(filteredProducts.length/itemsPerPage); // getting total pages for pagination
  filteredProducts = aplyPagination(filteredProducts, req?.query?.page, itemsPerPage); // applying pagination on filtered array
  //Return all the data
  return {
    products: filteredProducts,
    filterOptions,
    totalPages
  };
}
//applying a page selector on the products list
function aplyPagination(products, page = 1, itemsPerPage) {
  return products.slice((page - 1)*itemsPerPage, page*itemsPerPage);
}

// Filters the data by the filters obtained in query
function filterProducts(products, query) {
  if(!query)return products; // If no query - no need to filter
  const {color, category, priceFrom, priceTo} = query; //Getting the filter values from query
 
  if(!color && !category && !priceFrom && !priceTo)return products;  // If no filters - no need to filter
  
  // Returns filtered array
  return products.filter(item => {
    let colorPassed = true;
    let categoryPassed = true;
    let priceFromPassed = true;
    let priceToPassed = true;
    // Filter by color
    if(color){
      colorPassed = color.split(",").some(color => item.node?.colorFamily?.[0]?.name === color)
    }
    // Filter by category (tags)
    if(category){
      categoryPassed = category.split(",").some(cat => item.node?.categoryTags?.includes(cat))
    }
     // Filter by price range
    if(priceFrom || priceTo){
      let itemPrice = item.node?.shopifyProductEu?.variants?.edges?.[0]?.node?.price;
      if(itemPrice){
        itemPrice = parseFloat(itemPrice);
        if(priceFrom)priceFromPassed = (itemPrice >= parseFloat(priceFrom));
        if(priceTo)priceToPassed = (itemPrice <= parseFloat(priceTo));
      }
    }

    return colorPassed && categoryPassed && priceFromPassed && priceToPassed;
  });
}

// obtaining filter options from data
// Cause I'm too lazy to manually extract the data from JSON
function getFilterOptions (products) {
  const filterOptions = products.reduce((prev, curr) => {
    const newColor = curr.node?.colorFamily?.[0]?.name; // Getting color from the product
    const newTags = curr.node?.categoryTags; // Getting tags from the product 
    let colors = prev.colors;
    let tags = prev.tags;

    if(newColor) {
      colors = [...new Set([...colors, newColor])]; // saving product colors in array. Using Set to avoid duplicates.
    }
    if(newTags && newTags.length){
      tags = [...new Set([...tags, ...newTags])]; // saving product tags in array. Using Set to avoid duplicates.
    }

    return {
      colors,
      tags
    }
  }, {
    colors: [],
    tags: []
  });

  // Sorting options arrays. Cause why not?
  filterOptions.colors.sort();
  filterOptions.tags.sort();

  return filterOptions;
}
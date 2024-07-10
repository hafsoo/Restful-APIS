import React, { useState, useEffect } from 'react';
import Newsitems from './Newitems';
import Spiner from './Spiner';
import PropTypes from 'prop-types';

const News = (props) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    fetchData();
  }, [page, props.category]);

  const fetchData = async () => {
    setLoading(true);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=d2b853034f414b67ba41017f928414fe&page=${page}&pageSize=${props.pageSize}`;
    let res = await fetch(url);
    let result = await res.json();
    setData(result.articles);
    setTotalResults(result.totalResults);
    setLoading(false);
  };

  const handlePrevClick = async () => {
    setPage(page - 1);
  };

  const handleNextClick = async () => {
    if (page + 1 <= Math.ceil(totalResults / props.pageSize)) {
      setPage(page + 1);
    }
  };

  return (
    <>
      <div className="container my-3">
        <h1 className='text-center' style={{ margin: '35px 0px', marginTop: '90px' }}>
          NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
        </h1>
        {loading && <Spiner />}
        <div className='row'>
          {!loading && data ? data.map((element) => (
            <div className="col-md-4" key={element.url}>
              <Newsitems
                title={element.title ? element.title : ""}
                description={element.description ? element.description : ""}
                imageUrl={element.urlToImage}
                newsUrl={element.url}
                autor={element.author}
                date={element.publishedAt}
                source={element.source.name}
              />
            </div>
          )) : null}
        </div>
        <div className='container d-flex justify-content-between'>
          <button disabled={page <= 1} type="button" className="btn btn-dark" onClick={handlePrevClick}>&larr; Previous</button>
          <button disabled={page + 1 > Math.ceil(totalResults / props.pageSize)} type="button" className="btn btn-dark" onClick={handleNextClick}>Next &rarr;</button>
        </div>
      </div>
    </>
  );
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string
};

export default News;

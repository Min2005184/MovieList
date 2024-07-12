import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MoviesList from '../movies/MovieList';
import styles from './anime.module.css';
import { urlGetAllPosters, urlgetByFilter, urlGetDataByTrendingScore, urlGetDataByPopularity, urlGetDataByReleaseDate } from '../endpoint';
import { movieData } from '../movies/movieModel';
import { useSearch } from '../NavigationBar/SearchContext';

type SortOption = 'Trending' | 'Popularity' | 'Release Date';

const AnimeList: React.FC = () => {
    const [data, setData] = useState<movieData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sortedData, setSortedData] = useState<movieData[]>([]);
    const [selectedOption, setSelectedOption] = useState<SortOption | 'All'>('All');
    const { searchTerm } = useSearch();
    console.log("Search: ", searchTerm);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const option = event.target.value as SortOption | 'All';
        setSelectedOption(option);

        if (option === 'All') {
            setSortedData(data);
        } else {
            fetchSortedData(option);
        }
    };

    const loadData = async () => {
        try {
            setIsLoading(true);
            const url = searchTerm === "" ? urlGetAllPosters : `${urlgetByFilter}/${searchTerm}`;
            console.log('Fetching data from URL:', url);
            const response = await axios.get<movieData[]>(url);
            if (!response.data) {
                console.error("No response data received.");
                alert('Failed to load data. Please try again.');
                return;
            }
            setData(response.data);
            setSortedData(response.data); // Display all movies initially
        } catch (error) {
            console.error('There was an error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSortedData = async (option: SortOption) => {
        try {
            let response;
            switch (option) {
                case 'Trending':
                    response = await axios.get<movieData[]>(urlGetDataByTrendingScore);
                    break;
                case 'Popularity':
                    response = await axios.get<movieData[]>(urlGetDataByPopularity);
                    break;
                case 'Release Date':
                    response = await axios.get<movieData[]>(urlGetDataByReleaseDate);
                    break;
                default:
                    response = { data: [] };
            }

            if (!response.data) {
                console.error("No response data received.");
                alert('Failed to load data. Please try again.');
                return;
            }

            setSortedData(response.data);
        } catch (error) {
            console.error(`There was an error in ${option}:`, error);
        }
    };

    const renderList = () => {
        return (
            <>
                <h3>Anime List</h3>
                <MoviesList movies={sortedData} />
            </>
        );
    }

    useEffect(() => {
        loadData();
    }, [searchTerm]);

    return (
        <>
            <div className={styles['anime-background']}></div>
            <div className={styles.container}>
                <div className="dropdown">
                    <label htmlFor="sort-options">Sort by: </label>
                    <select id="sort-options" value={selectedOption} onChange={handleChange}>
                        <option value="All">All Anime</option>
                        <option value="Trending">Trending</option>
                        <option value="Popularity">Popularity</option>
                        <option value="Release Date">Release Date</option>
                    </select>
                </div>
                {isLoading ? <div>Loading...</div> : renderList()}
            </div>
        </>
    );
};

export default AnimeList;

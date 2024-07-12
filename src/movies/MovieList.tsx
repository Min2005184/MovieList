import React from 'react';
import IndividualMovie from "./IndividualMovie";
import { movieData } from "./movieModel";
import css from './MoviesList.module.css';
import GenericList from './../utils/GenericList';

const MoviesList: React.FC<MoviesListProps> = (props) => {
    console.log("Movies:", props.movies?.map( movie  => movie.movieID))
    return (
        <GenericList list={props.movies}>
            <div className={css.div}>
                {props.movies?.map(movie =>
                    <IndividualMovie {...movie} key={movie.movieID} />
                )}
                
            </div>
        </GenericList>
    );
};

interface MoviesListProps {
    movies?: movieData[];
}

export default MoviesList;


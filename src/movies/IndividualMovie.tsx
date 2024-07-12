import React from 'react';
import { movieData } from './movieModel';
import css from './IndividualMovie.module.css';
import { Link } from 'react-router-dom';
import { urlGetPosterById } from '../endpoint';

const IndividualMovie: React.FC<movieData> = (props) => {
    const buildLink = () => `/movie/${props.movieID}`;
    
    const getImageUrl = (id: number) => {
        console.log("Id", id);
        const url = `${urlGetPosterById}/${id}`;
        console.log("Url", url);
        return url; //we returned image url(string) that come from backend controller
    }

    return (
        <div className={css.card}>
            <Link to={buildLink()}>
                <img src={getImageUrl(props.movieID)} alt={props.title} className={css.image}/> 
            </Link>
            <p>{props.title}</p>           
        </div>
    );
};

export default IndividualMovie;


